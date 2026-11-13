# GalaxyAI

English-only production site for **GalaxyAI Inc.** at
`https://galaxyai.homes`, inspired by the visual language of `galaxy.ai`.

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
  endless Galaxy Studio demo queue.
- Pricing buttons open Stripe hosted Checkout directly with no provider picker.

The repository contains no production credentials and performs no deployment.
