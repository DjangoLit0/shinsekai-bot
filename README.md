# shinsekai-bot

Discord bot for Shinsekai Cup.

## Features
- Slash command `/setup` (admin only):
  - Creates roles: `Admin`, `Arbitre`, `Joueur`
  - Creates text channels: `annonces`, `inscriptions`, `pairings`, `resultats`
  - Creates voice channels: `Match-1`, `Match-2`, `Arbitrage`
  - Locks `Arbitrage` so only `Admin` + `Arbitre` can see/join/stream

## Local run
```bash
cp .env.example .env
npm install
npm run dev
```

## Deploy on Render (Background Worker)
- Build command: `npm install`
- Start command: `npm start`
- Env vars:
  - `DISCORD_BOT_TOKEN` (secret)
  - `DISCORD_GUILD_ID=1481742296688099381`
