# ASH Tools

A React + Vite tool hub, styled after TKS Tools. No tools are published yet.

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
