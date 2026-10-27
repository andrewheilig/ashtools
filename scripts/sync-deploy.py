#!/usr/bin/env python3
"""Watch the remote src tree and deploy it from this local project."""
import argparse
import fcntl
import os
from pathlib import Path, PurePosixPath
import shutil
import subprocess
import sys
import tarfile
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]


def run(*args, cwd=ROOT, capture=False):
    return subprocess.run(args, cwd=cwd, check=True, text=True,
                          stdout=subprocess.PIPE if capture else None,
                          env={**os.environ, 'GIT_TERMINAL_PROMPT': '0'}).stdout


def sync_once(root, state, repo, branch=None):
    cache = state / 'repository.git'
    if not cache.exists():
        run('git', 'init', '--bare', str(cache))
    run('git', '-C', str(cache), 'fetch', '--depth=1', repo, branch or 'HEAD')
    commit = run('git', '-C', str(cache), 'rev-parse', 'FETCH_HEAD', capture=True).strip()
    tree = run('git', '-C', str(cache), 'rev-parse', f'{commit}:src', capture=True).strip()
    if run('git', '-C', str(cache), 'cat-file', '-t', tree, capture=True).strip() != 'tree':
        raise RuntimeError('Remote src is not a directory.')
    marker = state / 'deployed-tree'
    if marker.exists() and marker.read_text().strip() == tree:
        return False
    if (root / 'src').is_symlink():
        raise RuntimeError('Local src must be a directory, not a symbolic link.')

    with tempfile.TemporaryDirectory(prefix='ash-sync-') as temp:
        temp = Path(temp)
        archive = temp / 'src.tar'
        run('git', '-C', str(cache), 'archive', '--format=tar', f'--output={archive}', commit, 'src')
        with tarfile.open(archive) as tar:
            for member in tar.getmembers():
                path = PurePosixPath(member.name)
                if path.is_absolute() or '..' in path.parts or path.parts[0] != 'src':
                    raise RuntimeError('Unexpected path in source archive.')
                if not (member.isfile() or member.isdir()):
                    raise RuntimeError('Source archive contains unsupported links or special files.')
                destination = temp.joinpath(*path.parts)
                if member.isdir():
                    destination.mkdir(parents=True, exist_ok=True)
                else:
                    destination.parent.mkdir(parents=True, exist_ok=True)
                    with tar.extractfile(member) as source, destination.open('wb') as output:
                        shutil.copyfileobj(source, output)
                    destination.chmod(member.mode & 0o777)
        backup = state / 'backups' / f'{time.time_ns()}'
        backup.mkdir(parents=True)
        print(f'Syncing {commit[:12]}; replaced/deleted files saved in {backup}', flush=True)
        run('rsync', '-rc', '--delete', '--backup', f'--backup-dir={backup}',
            f'{temp / "src"}/', f'{root / "src"}/')
    # Equivalent to: cd ~/word-math/ash-tools/ && npx firebase-tools deploy
    run('npx', 'firebase-tools', 'deploy', cwd=root)
    pending = state / 'deployed-tree.tmp'
    pending.write_text(tree + '\n')
    pending.replace(marker)
    print(f'Deployed {commit[:12]} successfully.', flush=True)
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', default='https://github.com/Bluegrayfoo/ash-tools.git',
                        help='Git URL; supports HTTPS credentials or an SSH URL')
    parser.add_argument('--branch', help='Branch to watch (default: remote default branch)')
    parser.add_argument('--interval', type=int, default=60, help='Seconds between checks (default: 60)')
    parser.add_argument('--once', action='store_true', help='Check, sync/deploy if changed, then exit')
    args = parser.parse_args()
    if args.interval < 1:
        parser.error('--interval must be at least 1')
    for command in ('git', 'rsync', 'npx'):
        if not shutil.which(command):
            parser.error(f'{command} is required')
    state = ROOT / '.sync-deploy'
    state.mkdir(exist_ok=True)
    with (state / 'watch.lock').open('w') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            parser.error('A sync/deploy watcher is already running for this project.')
        print(f'Watching {args.repo} ({args.branch or "default branch"}) every {args.interval}s. Ctrl+C stops.', flush=True)
        while True:
            try:
                sync_once(ROOT, state, args.repo, args.branch)
            except (subprocess.CalledProcessError, OSError, RuntimeError, tarfile.TarError) as error:
                print(f'Sync/deploy failed: {error}', file=sys.stderr, flush=True)
                if args.once:
                    return 1
                print('Will retry on the next check; deployment has not been marked successful.', flush=True)
            if args.once:
                return 0
            time.sleep(args.interval)


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print('\nWatcher stopped.')
