# ASH Tools

A React + Vite tool hub, styled after TKS Tools. Pennywise is available at `/pennywise`, with Greedy and Threshold computer opponents. Language Model Lab is available at `/language-model`, with browser-based training, custom corpora, prompt continuation, and candidate generation.

## Development

```sh
npm install
npm run dev
```

`npm run lint` checks the source; `npm run build` creates `dist`.

## Firebase

The web app is initialized in `src/firebase.js` using the `ashtools` configuration.
`.firebaserc` selects `ashtools`, and `firebase.json` hosts `dist` with an SPA fallback.

To deploy with an authenticated Firebase CLI:

```sh
firebase deploy --only hosting
```

The hosting predeploy hook builds the app first.

## Dependency security

A scoped npm override updates Firestore’s `@grpc/grpc-js` dependency to
`^1.13.6`, resolving the vulnerable version pinned by Firebase while retaining
the current Firebase SDK. Revisit the override when Firebase updates its dependency.
Run `npm audit` to check the installed dependency tree.

## Automatically sync GitHub source and deploy

Authenticate Git for access to the private `Bluegrayfoo/ash-tools` repository
and run `npx firebase-tools login` once if needed. Then start:

```sh
cd ~/word-math/ash-tools/ && npm run sync:deploy
```

The first check syncs and deploys immediately. Subsequent checks poll the remote
default branch every 60 seconds and deploy only when its `src` contents differ
from the last successful deployment. Keep this process running and the Mac awake;
Ctrl+C stops it. This is a local polling watcher, not a GitHub-hosted workflow.

The remote `src` replaces local `src`, including deleting files removed remotely.
The previous local `src` is backed up before each sync under `.sync-deploy/backups/`.
Other project files (including package.json, public assets, and Firebase config)
are not synced. Install any new dependencies separately when needed.

Every deployment runs `npx firebase-tools deploy` from this project directory.
The existing Firebase predeploy hook builds first. Failed syncs/deployments retry
on the next check, and only successful deployments update the saved source hash.

Optional commands:

```sh
npm run sync:deploy -- --once
npm run sync:deploy -- --branch main --interval 30
npm run sync:deploy -- --repo git@github.com:Bluegrayfoo/ash-tools.git
```

HTTPS uses your configured Git credential helper; the SSH URL uses your SSH key.
No credentials are stored in the script. Only one watcher can run per local project.
