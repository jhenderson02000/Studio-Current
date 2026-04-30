# Vercel Launch Checklist

Use this repo as a static site on Vercel.

## Steps

1. Create a new Vercel project from this repository.
2. Keep the framework preset as `Other`.
3. Leave the root directory as the repo root.
4. Deploy without a build command.
5. Open the generated `*.vercel.app` URL.
6. Test:
   - `Connect Input`
   - `Play Pattern`
   - playlist drag and drop
   - vocal recording and playback
   - mixer faders
7. Register `studiocurrentdaw.com`.
8. Add `www.studiocurrentdaw.com` as the production domain in Vercel.
9. Redirect `studiocurrentdaw.com` to `https://www.studiocurrentdaw.com`.

## Why Vercel first

- Fast static deployment
- HTTPS by default
- Good fit for browser audio testing
- Minimal config needed for this project
