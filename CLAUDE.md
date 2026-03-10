# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

### Frontend
- **Framework**: React 19 + Vite 7
- **Linguaggio**: TypeScript 5.9+
- **Routing**: React Router 7
- **State**: Zustand
- **Data Fetching**: TanStack Query v5
- **UI**: Tailwind CSS 4 + Radix UI + shadcn/ui components
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend
- **Runtime**: Node.js 22 LTS
- **Framework**: Hono
- **Database**: PostgreSQL 16 + Prisma ORM
- **Cache**: Redis 7 (ioredis)
- **AI**: OpenAI SDK (configurabile via baseURL + apiKey)

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

# Scraper Python (Data Pipeline)
cd scraper
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed_from_dataset.py              # Import all seed data
python scrape_category.py cpu 3 us       # Scrape single category
python update_prices.py 100 us           # Update prices
```

## Struttura Progetto

```
ppfa/
├── client/                                  # Frontend React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                          # shadcn/ui components (18)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   ├── popover.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   └── skeleton.tsx
│   │   │   ├── common/                      # Common components (9)
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── PriceTag.tsx
│   │   │   │   ├── RatingStars.tsx
│   │   │   │   ├── ComponentIcon.tsx
│   │   │   │   ├── RecentFilter.tsx
│   │   │   │   └── InfiniteScroll.tsx
│   │   │   ├── charts/                      # Charts (2)
│   │   │   │   ├── PriceHistoryChart.tsx
│   │   │   │   └── WattageDonut.tsx
│   │   │   ├── products/                    # Products (7)
│   │   │   │   ├── ProductTable.tsx
│   │   │   │   ├── ProductFilters.tsx
│   │   │   │   ├── ProductRow.tsx
│   │   │   │   ├── ProductSpecs.tsx
│   │   │   │   ├── ProductPrices.tsx
│   │   │   │   ├── ProductReviews.tsx
│   │   │   │   └── ProductCompareCard.tsx
│   │   │   ├── builder/                     # Builder (14 total)
│   │   │   │   ├── BuilderTable.tsx
│   │   │   │   ├── BuilderRow.tsx
│   │   │   │   ├── ComponentPicker.tsx
│   │   │   │   ├── ComponentPickerFilters.tsx
│   │   │   │   ├── ComponentPickerTable.tsx
│   │   │   │   ├── ComponentCard.tsx
│   │   │   │   ├── CompatibilityBanner.tsx
│   │   │   │   ├── CompatibilityIcon.tsx
│   │   │   │   ├── WattageEstimator.tsx
│   │   │   │   ├── WattageBreakdown.tsx
│   │   │   │   ├── BuildSummary.tsx
│   │   │   │   ├── BuildActions.tsx
│   │   │   │   ├── BuildShareDialog.tsx
│   │   │   │   └── BuildExport.tsx
│   │   │   ├── chat/                        # AI Chat (2)
│   │   │   │   ├── ChatWidget.tsx
│   │   │   │   └── ChatWindow.tsx
│   │   │   └── layout/                      # Layout (3)
│   │   │       ├── Header.tsx
│   │   │       ├── Footer.tsx
│   │   │       └── Layout.tsx
│   │   ├── routes/                          # Pages
│   │   ├── stores/                          # Zustand stores
│   │   ├── hooks/                           # Custom hooks
│   │   ├── lib/                             # Utilities
│   │   │   └── compatibility/               # Compatibility engine
│   │   └── types/                           # TypeScript types
│   └── components.json                      # shadcn config
├── server/                                  # Backend Hono + Prisma
│   ├── src/
│   │   ├── routes/                          # API routes
│   │   ├── services/                        # Business logic
│   │   ├── middleware/                      # Middleware
│   │   └── lib/                             # Utilities
│   └── prisma/
│       ├── schema.prisma                    # Database schema
│       └── seed.ts                          # Seed data
├── shared/                                  # Shared types
│   └── src/
│       ├── categories.ts
│       ├── constants.ts
│       ├── component-specs.ts
│       ├── sockets.ts
│       ├── compatibility-rules.ts
│       └── index.ts
├── scraper/                                 # Python Scraper (COMPLETO)
│   ├── requirements.txt
│   ├── config.py
│   ├── .env.example
│   ├── scrapers/                            # Scraper modules
│   │   ├── base_scraper.py
│   │   ├── pypartpicker_scraper.py
│   │   ├── category_scraper.py
│   │   └── price_scraper.py
│   ├── transformers/                        # Data transformers
│   │   ├── normalizer.py
│   │   ├── spec_parser.py
│   │   ├── year_inferrer.py
│   │   └── deduplicator.py
│   ├── loaders/                             # Database loaders
│   │   ├── db_loader.py
│   │   ├── seed_loader.py
│   │   └── price_updater.py
│   ├── scrape_all.py                        # Scrape all categories
│   ├── scrape_category.py                   # Scrape single category
│   ├── update_prices.py                     # Update prices only
│   └── seed_from_dataset.py                 # Import seed data
└── docker-compose.yml
```

## Componenti Implementati

### UI Components (shadcn/ui - 18 componenti)
Tutti i componenti base sono implementati in `client/src/components/ui/`:
- Button con varianti (default, destructive, outline, ghost, link)
- Card con header, content, footer
- Input, Label, Badge
- Dialog, Sheet, Popover
- Select, Dropdown Menu
- Tabs, Slider, Switch
- Tooltip, Scroll Area
- Table, Skeleton

### Common Components (9)
- LoadingSpinner - Spinner animato con size variant
- ErrorBoundary - React Error Boundary con fallback
- EmptyState - Stato vuoto con icona e azione
- SearchBar - Input con icona search
- PriceTag - Prezzo formattato con discount badge
- RatingStars - Stelle recensione (1-5)
- ComponentIcon - Icona per categoria componente
- RecentFilter - Toggle componenti recenti (2019+)
- InfiniteScroll - Wrapper infinite scroll

### Charts (2)
- PriceHistoryChart - Grafico storico prezzi (Recharts)
- WattageDonut - Donut chart wattaggio sistema

### Products (7)
- ProductTable - Tabella con selezione multipla
- ProductFilters - Filtri sidebar completi (prezzo, brand, specs)
- ProductRow - Riga componente con checkbox e azioni
- ProductSpecs - Specifiche dettagliate category-based
- ProductPrices - Prezzi multi-retailer con link
- ProductReviews - Recensioni con distribuzione stelle
- ProductCompareCard - Card confronto side-by-side

### Builder (14 totali)
Già presenti + aggiunti:
- BuilderTable, BuilderRow - Tabella build
- ComponentPicker, ComponentPickerFilters, ComponentPickerTable - Selezione componenti
- ComponentCard - Card componente compatta
- CompatibilityBanner, CompatibilityIcon - Status compatibilità
- WattageEstimator, WattageBreakdown - Calcolo wattaggio
- BuildSummary - Riepilogo build con totale
- BuildActions, BuildShareDialog, BuildExport - Azioni build

## API Endpoints

- `GET /api/components` - Lista componenti con filtri
- `GET /api/components/:id` - Dettaglio componente
- `GET /api/components/:id/price-history` - Storico prezzi
- `GET /api/builds` - Lista build pubbliche
- `GET /api/builds/:id` - Dettaglio build
- `POST /api/builds` - Crea build
- `PUT /api/builds/:id` - Aggiorna build
- `DELETE /api/builds/:id` - Elimina build
- `POST /api/chat` - AI Chat
- `GET /api/prices` - Gestione prezzi
- `POST /api/auth/register` - Registrazione
- `POST /api/auth/login` - Login

## Scraper Python

Lo scraper è completamente implementato in `scraper/`:

### Funzionalità
- **Scrape completo** da PCPartPicker via pypartpicker
- **Import seed data** dal dataset GitHub docyx
- **Update incrementale** dei prezzi
- **Normalizzazione** automatica di brand, modelli, specs
- **Inferenza anno** da pattern nomi
- **Deduplicazione** per part_number
- **Caricamento batch** in PostgreSQL

### Script principali
```bash
cd scraper
python seed_from_dataset.py              # Import tutto
python scrape_category.py cpu 3 us       # Scrape categoria
python update_prices.py 100 us           # Update prezzi
```

## Deploy

Ogni push sul branch `main` attiva automaticamente il deploy su Vercel.

```bash
git add .
git commit -m "descrizione delle modifiche"
git push origin main
```

### Deploy manuale su Vercel
```bash
cd client
npm run build
vercel --prod
```

## Note Importanti

- Tutti i componenti supportano **dark mode** automatica
- Il **color system** usa CSS variables semantiche
- Le **API calls** usano TanStack Query con cache
- La **compatibilità** è validata client-side in tempo reale
- Lo **scraper** rispetta rate limits con delay automatico
- Il **database** usa Prisma migrations per versioning
