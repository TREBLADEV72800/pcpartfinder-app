# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Framework**: React + Vite
- **Linguaggio**: TypeScript
- **Deploy**: Vercel (`pcpartfinder-app.vercel.app`)
- **Repo**: https://github.com/TREBLADEV72800/pcpartfinder-app

## Comandi di sviluppo

```bash
# Installa dipendenze
npm install

# Avvia server di sviluppo (http://localhost:5173)
npm run dev

# Build per produzione
npm run build

# Preview della build
npm run preview

# Linting
npm run lint
```

## Deploy su Vercel

Ogni push sul branch `main` attiva automaticamente il deploy su Vercel.

```bash
git add .
git commit -m "descrizione delle modifiche"
git push
```
