# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

### Frontend
- **Framework**: React + Vite
- **Linguaggio**: TypeScript
- **Routing**: React Router 7
- **State**: Zustand
- **Data Fetching**: TanStack Query
- **UI**: Tailwind CSS 4 + Radix UI

### Backend
- **Runtime**: Node.js
- **Framework**: Hono
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis (ioredis)
- **AI**: OpenRouter (`openai/gpt-oss-120b:free`)

### Deploy
- **Frontend**: Vercel (`pcpartfinder-app.vercel.app`)
- **Repo**: https://github.com/TREBLADEV72800/pcpartfinder-app

## Comandi di sviluppo

```bash
# Client (Frontend)
cd client
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview

# Server (Backend)
cd server
npm install
npm run dev       # http://localhost:3001
npm run build

# Database
docker-compose up -d  # PostgreSQL + Redis
cd server && npx prisma migrate dev
cd server && npm run prisma:seed

# AI Chat Config (OpenRouter)
# Modello: openai/gpt-oss-120b:free
# Chiave richiesta su https://openrouter.ai/keys
```

## Struttura Progetto

```
ppfa/
├── client/          # Frontend React + Vite
├── server/          # Backend Hono + Prisma
├── shared/          # Tipi condivisi
├── scraper/         # Data pipeline Python (TODO)
└── docker-compose.yml
```

## API Endpoints

- `GET /api/components` - Lista componenti con filtri
- `GET /api/components/:id` - Dettaglio componente
- `GET /api/components/:id/price-history` - Storico prezzi
- `GET /api/builds` - Lista build pubbliche
- `GET /api/builds/:id` - Dettaglio build
- `POST /api/builds` - Crea build
- `PUT /api/builds/:id` - Aggiorna build
- `POST /api/chat` - AI Chat

## Deploy

Ogni push sul branch `main` attiva automaticamente il deploy su Vercel.

```bash
git add .
git commit -m "descrizione delle modifiche"
git push
```
