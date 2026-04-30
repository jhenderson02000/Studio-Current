# Studio Current Deployment

Target custom domain:

`https://www.studiocurrentdaw.com`

Primary launch path:

`Vercel`

Temporary production URL:

`https://<your-vercel-project>.vercel.app`

Important:

- `studiocurrent.com` is already in use by another company as of April 23, 2026, so this repo now targets `studiocurrentdaw.com` instead.
- You still need to register and control `studiocurrentdaw.com` before attaching it to hosting.

Configured hosts in this repo:

- Vercel via [vercel.json](./vercel.json)
- Netlify via [netlify.toml](./netlify.toml)
- GitHub Pages via [.github/workflows/deploy-pages.yml](./.github/workflows/deploy-pages.yml)

Recommended next steps:

1. Import the repo into Vercel as a static site.
2. Let Vercel generate the default `*.vercel.app` URL.
3. Verify recording, microphone permissions, playlist drag/drop, and playback over HTTPS.
4. Register `studiocurrentdaw.com` and attach `www.studiocurrentdaw.com` to the Vercel project.
5. Redirect the root domain `studiocurrentdaw.com` to `https://www.studiocurrentdaw.com`.

Notes:

- The current project is a static web app, so it can be hosted without a backend.
- Browser audio input works best over `https` in production.
