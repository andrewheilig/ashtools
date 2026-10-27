import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('sync_deploy', Path(__file__).with_name('sync-deploy.py'))
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class SyncTest(unittest.TestCase):
    def test_sync_skip_delete_backup_and_retry(self):
        with tempfile.TemporaryDirectory() as temporary:
            base = Path(temporary)
            remote, local = base / 'remote', base / 'local'
            remote.mkdir()
            local.mkdir()
            (remote / 'src').mkdir()
            (local / 'src').mkdir()
            state = local / '.sync-deploy'
            state.mkdir()
            (local / 'src' / 'old.txt').write_text('local backup')
            (local / 'package.json').write_text('keep local config')
            (remote / 'src' / 'app.txt').write_text('first')
            def git(*args):
                subprocess.run(['git', *args], cwd=remote, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            git('init')
            def commit():
                git('add', '.')
                git('-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'test')
            commit()
            original_run = sync.run
            deployments = []
            fail = False
            def run(*args, **kwargs):
                if args[0] == 'npx':
                    deployments.append(args)
                    self.assertEqual(kwargs['cwd'], local)
                    if fail:
                        raise subprocess.CalledProcessError(1, args)
                    return None
                return original_run(*args, **kwargs)
            with patch.object(sync, 'run', run):
                self.assertTrue(sync.sync_once(local, state, str(remote)))
                self.assertFalse((local / 'src' / 'old.txt').exists())
                self.assertEqual(next((state / 'backups').glob('*/old.txt')).read_text(), 'local backup')
                self.assertEqual((local / 'src' / 'app.txt').read_text(), 'first')
                self.assertFalse(sync.sync_once(local, state, str(remote)))
                (remote / 'README.md').write_text('outside src')
                commit()
                self.assertFalse(sync.sync_once(local, state, str(remote)))
                previous = (state / 'deployed-tree').read_text()
                (remote / 'src' / 'app.txt').unlink()
                (remote / 'src' / 'new.txt').write_text('second')
                commit()
                fail = True
                with self.assertRaises(subprocess.CalledProcessError):
                    sync.sync_once(local, state, str(remote))
                self.assertEqual((state / 'deployed-tree').read_text(), previous)
                fail = False
                self.assertTrue(sync.sync_once(local, state, str(remote)))
                self.assertFalse((local / 'src' / 'app.txt').exists())
                self.assertEqual((local / 'src' / 'new.txt').read_text(), 'second')
                self.assertEqual((local / 'package.json').read_text(), 'keep local config')
                self.assertEqual(deployments, [('npx', 'firebase-tools', 'deploy')] * 3)


if __name__ == '__main__':
    unittest.main()
