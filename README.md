# Swarm Rebuild

English-only marketing site for **Swarm Rebuild**, a Chrome extension that
wipes any web page to a blank canvas and lets a swarm of multiplayer cursors
build it back live.

## Local development

```bash
pnpm install
pnpm dev
```

## Verification

```bash
pnpm exec tsc --noEmit
pnpm build
```

## Product flow

- Act while signed out: opens the Google sign-in dialog.
- Act while signed in without a paid plan: redirects to `/pricing`.
- Act while signed in with an active subscription: opens the intentionally
  endless demo build queue.
- Pricing buttons open Stripe hosted checkout directly with no provider picker.

The repository contains no production credentials and performs no deployment.
