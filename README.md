# Studio Current

Studio Current is a browser-based vocal production DAW prototype focused on:

- vocal recording through an audio interface
- real-time vocal cleanup and tuning controls
- a simple channel rack and pattern sequencer
- playlist-style clip arrangement
- mixer strip balancing

## Local Run

Requirements:

- Node.js

Start the local server:

```powershell
node server.js
```

Then open:

`http://127.0.0.1:4173`

Current public deployment:

`https://studio-current.vercel.app`

## Deploy

Primary deployment path:

- Vercel

See:

- [DEPLOY.md](./DEPLOY.md)
- [VERCEL.md](./VERCEL.md)

## Project Files

- `index.html` - DAW interface
- `styles.css` - workstation layout and styling
- `app.js` - audio, sequencing, mixer, and UI behavior
- `server.js` - local static server for browser testing
