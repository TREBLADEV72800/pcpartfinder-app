# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Development Commands](#development-commands)
4. [Project Structure](#project-structure)
5. [Database Schema (Prisma)](#database-schema-prisma)
6. [Zustand Stores](#zustand-stores)
7. [Frontend Routes](#frontend-routes)
8. [API Endpoints](#api-endpoints)
9. [Compatibility System](#compatibility-system)
10. [Wattage Calculation](#wattage-calculation)
11. [Components Reference](#components-reference)
12. [Python Scraper](#python-scraper)
13. [Deploy](#deploy)
14. [Troubleshooting](#troubleshooting)
15. [Appendix](#appendix)

---

## Project Overview

**PCPartFinder App** is a web application for building, comparing, and finding PC components with real-time compatibility checking, price tracking, and AI-powered assistance.

### Core Features
- **PC Builder**: Drag-and-drop component selection with real-time compatibility validation
- **Component Catalog**: Browse and filter 12 component categories with advanced specs
- **Price Tracking**: Historical price data from multiple retailers
- **AI Assistant**: Context-aware chat for build recommendations
- **Build Gallery**: Share and discover community builds
- **User Accounts**: Save builds, set price alerts, write reviews

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI Framework |
| Vite | 7 | Build Tool & Dev Server |
| TypeScript | 5.9+ | Type Safety |
| React Router | 7 | Client-side Routing |
| Zustand | latest | State Management |
| TanStack Query | 5 | Data Fetching & Caching |
| Tailwind CSS | 4 | Styling |
| Radix UI | latest | Unstyled Components |
| shadcn/ui | latest | Component Library |
| Recharts | latest | Charts |
| Lucide React | latest | Icons |
| Sonner | latest | Toast Notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 22 LTS | Runtime |
| Hono | latest | Web Framework |
| Prisma | latest | ORM |
| PostgreSQL | 16 | Database |
| Redis | 7 (ioredis) | Caching |
| OpenAI SDK | latest | AI Integration |
| Zod | latest | Validation |

### Deploy
- **Frontend**: Vercel → `pcpartfinder-app.vercel.app`
- **Repository**: https://github.com/TREBLADEV72800/pcpartfinder-app

---

## Development Commands

### Frontend (Client)
```bash
cd client

# Install dependencies
npm install

# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit
```

### Backend (Server)
```bash
cd server

# Install dependencies
npm install

# Development server (http://localhost:3001)
npm run dev

# Production build
npm run build

# Database migrations
npx prisma migrate dev

# Seed database
npm run prisma:seed

# Generate Prisma Client
npx prisma generate
```

### Database (Docker)
```bash
# Start PostgreSQL + Redis
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Python Scraper
```bash
cd scraper

# Setup
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Import seed data from dataset
python seed_from_dataset.py

# Scrape single category (category, pages, region)
python scrape_category.py cpu 3 us

# Update prices for recent components (limit, region)
python update_prices.py 100 us
```

---

## Project Structure

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
│   │   │   ├── builder/                     # Builder (14)
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
├── scraper/                                 # Python Scraper
│   ├── scrapers/                            # Scraper modules
│   ├── transformers/                        # Data transformers
│   ├── loaders/                             # Database loaders
│   └── *.py                                 # Entry scripts
└── docker-compose.yml
```

---

## Database Schema (Prisma)

### Models Overview

#### Component
Core model for all PC components.

**Key Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| pcppId | String? | PCPartPicker ID (unique) |
| name | String | Component name |
| brand | String | Manufacturer |
| category | ComponentCategory | Component type |
| specs | Json | Category-specific specs |
| socket | String? | CPU/Mobo socket |
| tdp | Int? | Thermal Design Power |
| isActive | Boolean | Soft delete flag |

**Indexes:**
- `category`
- `category, releaseYear`
- `category, isActive, releaseYear`
- `brand`, `socket`, `formFactor`, `memoryType`, `name`

#### Price & PriceHistory
Current prices and historical tracking.

**Price Fields:**
- `retailer`: Store name
- `price`: Current price
- `inStock`: Availability flag
- `url`: Affiliate link

**PriceHistory Fields:**
- `recordedAt`: Timestamp
- Unique constraint: `(componentId, retailer, recordedAt)`

#### Build & BuildItem
User PC builds with components.

**Build Fields:**
| Field | Type | Description |
|-------|------|-------------|
| shareId | String (unique) | Public share URL ID |
| userId | String? | Owner (nullable for anonymous) |
| isPublic | Boolean | Visibility in gallery |
| totalPrice | Float? | Cached total |
| totalWattage | Int? | Cached wattage |

**BuildItem Fields:**
- `categorySlot`: Which slot this occupies
- `quantity`: Default 1
- `customPrice`: Override current price

#### CompatibilityResult & CompatibilityRule
Validation results and rule definitions.

**CompatStatus Enum:** `OK` | `WARNING` | `ERROR` | `INFO`

#### User & Review
User accounts and component reviews.

**User Fields:**
- `email`, `username` (unique)
- `passwordHash` (TODO: bcrypt)
- `avatarUrl`, `bio`

#### ChatSession & ChatMessage
AI chat history.

**ChatRole Enum:** `SYSTEM` | `USER` | `ASSISTANT`

#### ScrapeLog
Scraper execution tracking.

**ScrapeStatus Enum:** `RUNNING` | `COMPLETED` | `FAILED` | `PARTIAL`

### Relationships
```
Component (1) ─── (N) Price
Component (1) ─── (N) PriceHistory
Component (1) ─── (N) Review
Component (1) ─── (N) BuildItem

Build (1) ─── (N) BuildItem
Build (1) ─── (N) CompatibilityResult

User (1) ─── (N) Build
User (1) ─── (N) Review
User (1) ─── (N) PriceAlert
User (1) ─── (N) ChatSession

ChatSession (1) ─── (N) ChatMessage
```

---

## Zustand Stores

### useBuildStore
Manages the current PC build being edited.

**Location:** `client/src/stores/useBuildStore.ts`

**State:**
```typescript
interface BuildState {
  slots: BuildSlot[];           // 12 component slots
  name: string;                 // Build name
  description?: string;         // Optional description
  useCase?: string;             // Build purpose
  isPublic: boolean;            // Share visibility
}
```

**Initial Slots:**
CPU, CPU_COOLER, MOTHERBOARD, MEMORY, STORAGE, VIDEO_CARD, CASE, POWER_SUPPLY, MONITOR, OS, CASE_FAN, THERMAL_PASTE

**Actions:**
| Action | Parameters | Description |
|--------|------------|-------------|
| setSlot | category, component | Add/replace component in slot |
| setSlotCustomPrice | category, price | Override component price |
| setSlotNotes | category, notes | Add notes to slot |
| setName | name | Update build name |
| setDescription | description | Update description |
| setUseCase | useCase | Set use case |
| setIsPublic | isPublic | Toggle public visibility |
| clearBuild | - | Reset to initial state |
| getSlot | category | Get slot by category |
| getTotalPrice | - | Calculate total (with customs) |
| getTotalWattage | - | Calculate total + 50W base |
| hasComponent | componentId | Check if component is used |

**Persistence:** `localStorage` key `pcbuilder-build`

---

### useFilterStore
Manages component filtering state.

**Location:** `client/src/stores/useFilterStore.ts`

**State:**
```typescript
interface FilterState {
  // Year filter
  minYear: number;              // Default: 2019
  recentOnly: boolean;          // Default: true ★ ACTIVE BY DEFAULT

  // Generic filters
  maxPrice: number | null;
  minPrice: number | null;
  selectedBrands: string[];
  inStockOnly: boolean;

  // Category-specific filters
  socketFilter: string | null;      // CPU/Motherboard
  formFactorFilter: string | null;  // Motherboard/Case
  memoryTypeFilter: string | null;  // RAM
  searchQuery: string;
}
```

**Actions:**
| Action | Parameters | Description |
|--------|------------|-------------|
| setRecentOnly | val: boolean | Toggle year filter |
| setMinYear | year: number | Set minimum year |
| setPriceRange | min, max | Set price bounds |
| toggleBrand | brand: string | Add/remove brand |
| setInStockOnly | val: boolean | Filter by stock |
| setSocketFilter | socket: string \| null | Filter by socket |
| setFormFactorFilter | ff: string \| null | Filter by form factor |
| setMemoryTypeFilter | mt: string \| null | Filter by RAM type |
| setSearchQuery | q: string | Text search |
| resetFilters | - | Reset to defaults |

**Persistence:** `localStorage` key `pcbuilder-filters`

---

### useAuthStore
Manages user authentication state.

**Location:** `client/src/stores/useAuthStore.ts`

**State:**
```typescript
interface AuthState {
  user: User | null;              // Logged in user
  token: string | null;           // JWT token
  isAuthenticated: boolean;
}

interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
}
```

**Actions:**
| Action | Parameters | Description |
|--------|------------|-------------|
| setUser | user: User \| null | Set current user |
| setToken | token: string \| null | Store auth token |
| login | user, token | Full login |
| logout | - | Clear auth state |

**Persistence:** `localStorage` key `pcbuilder-auth` (token only)

---

### useChatStore
Manages AI chat sessions (non-persistent).

**Location:** `client/src/stores/useChatStore.ts`

**State:**
```typescript
interface ChatState {
  currentSession: ChatSession | null;
  isTyping: boolean;
}

interface ChatSession {
  id: string;                // UUID
  buildId?: string;          // Context build
  messages: ChatMessage[];
  totalTokens: number;
  isOpen: boolean;           // UI state
}
```

**Actions:**
| Action | Parameters | Description |
|--------|------------|-------------|
| startSession | buildId? | Create new session |
| endSession | - | Clear current session |
| addMessage | message (Omit id, timestamp) | Append message |
| setIsTyping | isTyping: boolean | UI loading state |
| toggleChat | - | Toggle widget visibility |

**Note:** No persistence - sessions are ephemeral

---

## Frontend Routes

All routes use lazy loading for code splitting.

**Location:** `client/src/App.tsx`

| Path | Component | Description | Lazy Loaded |
|------|-----------|-------------|-------------|
| `/` | HomePage | Landing page | Yes |
| `/builder` | BuilderPage | PC Builder tool | Yes |
| `/builder/:shareId` | BuilderPage | Load shared build | Yes |
| `/products/:category` | ProductListPage | Browse components | Yes |
| `/product/:id` | ProductDetailPage | Component details | Yes |
| `/compare` | ComparePage | Side-by-side comparison | Yes |
| `/builds` | BuildsGalleryPage | Community builds | Yes |
| `/build/:shareId` | BuildDetailPage | View shared build | Yes |
| `/price-drops` | PriceDropsPage | Price reductions | Yes |
| `/login` | LoginPage | User login | Yes |
| `/register` | RegisterPage | User registration | Yes |
| `/profile/:username` | ProfilePage | User profile | Yes |
| `*` | Navigate to `/` | 404 redirect | - |

### Route Components Summary

**HomePage:** Hero section, featured components, recent builds

**BuilderPage:**
- Props: `shareId?` from URL params
- Features: Component picker, compatibility banner, wattage estimator, build actions

**ProductListPage:**
- Props: `category` from URL params
- Features: Filters sidebar, product table, infinite scroll

**ProductDetailPage:**
- Props: `id` from URL params
- Features: Specs, prices, reviews, price history chart, compatibility info

**ComparePage:** Multi-component comparison table

**BuildsGalleryPage:** Public builds grid with use case filters

**BuildDetailPage:** Shared build view with full breakdown

---

## API Endpoints

### Base URL
- Development: `http://localhost:3001`
- Production: `https://pcpartfinder-app.vercel.app/api`

### Components API

#### `GET /api/components`
List components with filtering and pagination.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| category | ComponentCategory? | - | Filter by category |
| minYear | number? | - | Minimum release year |
| minPrice | number? | - | Minimum price |
| maxPrice | number? | - | Maximum price |
| brands | string[]? | - | Brand filter array |
| socket | string? | - | Socket filter |
| formFactor | string? | - | Form factor filter |
| memoryType | string? | - | RAM type filter |
| search | string? | - | Text search in name |
| inStockOnly | boolean? | - | Only in-stock items |
| page | number | 1 | Page number |
| pageSize | number | 24 | Items per page (max 100) |
| sortBy | string | "name" | Sort field |
| sortOrder | "asc"\|"desc" | "asc" | Sort direction |

**Response:**
```typescript
{
  data: Component[],
  meta: {
    total: number,
    page: number,
    pageSize: number,
    totalPages: number
  }
}
```

#### `GET /api/components/categories`
Get all categories with component counts.

**Response:** `Array<{ category: ComponentCategory; count: number }>`

#### `GET /api/components/brands`
Get all brands, optionally filtered by category.

**Query:** `category?: ComponentCategory`

**Response:** `string[]`

#### `GET /api/components/:id`
Get component by ID.

**Response:** Full `Component` object with relations

**Error:** `404` if not found

#### `GET /api/components/:id/price-history`
Get historical price data.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| days | number | 30 | Days of history |

**Response:**
```typescript
Array<{
  retailer: string;
  price: number;
  currency: string;
  recordedAt: string;
}>
```

---

### Builds API

#### `GET /api/builds`
List public builds.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| pageSize | number | 12 | Items per page |
| useCase | BuildUseCase? | - | Filter by use case |

**BuildUseCase values:** `GAMING` | `WORKSTATION` | `STREAMING` | `OFFICE` | `HOME_SERVER` | `HTPC` | `BUDGET` | `CUSTOM`

#### `GET /api/builds/my`
Get authenticated user's builds.

**Headers:** `X-User-ID: string` (temporary auth)

**Query:** `page`, `pageSize`

#### `GET /api/builds/:id`
Get build by ID.

**Response:** Full build with items and compatibility results

#### `GET /api/builds/by-share/:shareId`
Get build by public share ID.

**Response:** Same as `/:id`

#### `POST /api/builds`
Create new build.

**Headers:** `X-User-ID?: string`

**Body:**
```typescript
{
  name?: string;              // Max 200 chars
  description?: string;       // Max 1000 chars
  useCase?: BuildUseCase;
  isPublic?: boolean;         // Default: false
  items: Array<{
    componentId: string;
    categorySlot: ComponentCategory;
    quantity?: number;        // Default: 1
    customPrice?: number;
    notes?: string;
  }>;                         // Min 1 item
}
```

**Response:** `201` with created build

#### `PUT /api/builds/:id`
Update existing build.

**Headers:** `X-User-ID: string` (required)

**Body:** Same as POST (all fields optional)

**Error:** `403` if not owner, `400` for validation errors

#### `DELETE /api/builds/:id`
Delete build.

**Headers:** `X-User-ID: string` (required)

**Response:** `{ success: true }`

#### `POST /api/builds/:id/clone`
Clone build to user's account.

**Headers:** `X-User-ID: string` (required)

**Response:** `201` with new build

#### `POST /api/builds/:id/like`
Toggle like on build.

**Headers:** `X-User-ID: string` (required)

**Response:** `{ likesCount: number }`

---

### Chat API

#### `POST /api/chat`
Send message to AI assistant.

**Headers:** `X-User-ID?: string`

**Body:**
```typescript
{
  message: string;            // 1-1000 chars
  sessionId?: string;         // Continue existing session
  buildId?: string;           // Context build
  model?: string;             // Override model
}
```

**Response:**
```typescript
{
  sessionId: string;
  message: {
    role: "assistant";
    content: string;
    tokensInput?: number;
    tokensOutput?: number;
  };
  totalTokens: number;
}
```

#### `GET /api/chat/:sessionId/history`
Get chat session history.

**Response:** Array of all messages in session

#### `DELETE /api/chat/:sessionId`
Delete chat session.

**Headers:** `X-User-ID?: string` (required if session has owner)

---

### Auth API

#### `POST /api/auth/register`
Create new user account.

**Body:**
```typescript
{
  email: string;              // Valid email
  username: string;           // Min 3 chars
  password: string;           // Min 6 chars (TODO: hash!)
}
```

**Response:**
```typescript
{
  token: string;              // JWT
  user: {
    id: string;
    username: string;
    email: string;
  }
}
```

**Errors:**
- `400` "Email already registered"
- `400` "Username already taken"

#### `POST /api/auth/login`
Authenticate user.

**Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:** Same as register

**Error:** `401` "Invalid credentials"

---

### Prices API

#### `GET /api/prices/components/:id`
Get latest prices for component.

**Response:**
```typescript
Array<{
  retailer: string;
  price: number;
  basePrice?: number;
  shipping?: number;
  tax?: number;
  total?: number;
  currency: string;
  url: string;
  inStock: boolean;
  scrapedAt: string;
}>
```

#### `GET /api/prices/components/:id/history`
Get price history (alias for components endpoint).

#### `POST /api/prices/alerts` (Protected)
Create price alert.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```typescript
{
  componentId: string;
  targetPrice: number;        // Must be positive
}
```

#### `GET /api/prices/alerts` (Protected)
Get user's price alerts.

**Headers:** `Authorization: Bearer <token>`

#### `DELETE /api/prices/alerts/:id` (Protected)
Delete price alert.

**Headers:** `Authorization: Bearer <token>`

---

### Health Check

#### `GET /health`
Check API health.

**Response:**
```typescript
{
  status: "ok",
  timestamp: string
}
```

---

## Compatibility System

### Overview
Real-time compatibility validation between PC components using rule-based checks.

**Location:** `shared/src/compatibility-rules.ts`, `client/src/lib/compatibility/`

### Component Categories

12 categories defined in `shared/src/categories.ts`:

| Category | Slug | Icon | Required | Multiple |
|----------|------|------|----------|----------|
| CPU | cpu | Cpu | Yes | No |
| CPU Cooler | cpu-cooler | Fan | No | No |
| Motherboard | motherboard | Server | Yes | No |
| Memory | memory | Memory | Yes | No |
| Storage | storage | HardDrive | Yes | **Yes** |
| Video Card | video-card | Monitor | No | No |
| Case | case | Box | Yes | No |
| Power Supply | power-supply | Zap | Yes | No |
| Monitor | monitor | MonitorPlay | No | **Yes** |
| OS | os | Disc | No | No |
| Case Fan | case-fan | Wind | No | **Yes** |
| Thermal Paste | thermal-paste | Droplet | No | No |

### Compatibility Rules

8 core rules defined in `shared/src/compatibility-rules.ts`:

| Rule ID | Name | Category A | Category B | Severity |
|---------|------|------------|------------|----------|
| `cpu-mobo-socket` | CPU / Motherboard Socket | CPU | MOTHERBOARD | ERROR |
| `mobo-ram-ddr` | Motherboard / RAM DDR Type | MOTHERBOARD | MEMORY | ERROR |
| `mobo-ram-slots` | Motherboard / RAM Slots | MOTHERBOARD | MEMORY | ERROR |
| `mobo-case-ff` | Motherboard / Case Form Factor | MOTHERBOARD | CASE | ERROR |
| `gpu-case-len` | GPU / Case Clearance | VIDEO_CARD | CASE | ERROR |
| `cooler-case-h` | Cooler / Case Height | CPU_COOLER | CASE | ERROR |
| `cooler-cpu-socket` | Cooler / CPU Socket | CPU_COOLER | CPU | ERROR |
| `psu-wattage` | PSU / System Wattage | POWER_SUPPLY | CPU | WARNING |

### Rule Implementations

**Socket Match:** CPU socket === Motherboard socket
- Values: `AM4`, `AM5`, `LGA1700`, `LGA1200`, etc.

**Memory Type Match:** RAM DDR type supported by motherboard
- Values: `DDR3`, `DDR4`, `DDR5`

**Slot Count:** RAM modules ≤ Motherboard RAM slots

**Form Factor Check:** Case supports motherboard form factor
- Values: `ATX`, `Micro-ATX`, `Mini-ITX`, `E-ATX`

**Length Check:** GPU length ≤ Case max GPU length

**Height Check:** Cooler height ≤ Case max cooler height

**Socket Support:** Cooler supports CPU socket

**Wattage Check:** PSU wattage ≥ Total system TDP + 20% headroom

### Severity Levels

| Level | Icon | Behavior |
|-------|------|----------|
| OK | ✓ | No issues |
| INFO | ℹ️ | Informational notice |
| WARNING | ⚠️ | May cause issues (e.g., insufficient wattage) |
| ERROR | ✗ | Incompatible, will not work |

### Usage in Components

**CompatibilityBanner:** Displays all validation results with severity indicators

**CompatibilityIcon:** Visual indicator per slot showing status

---

## Wattage Calculation

### Overview
Estimates total power consumption for PSU sizing.

**Location:** `client/src/lib/wattage.ts`

### Base Calculation

```typescript
const BASE_SYSTEM_WATTAGE = 50; // Mobo + fans + peripherals
```

### Component Contributions

| Component | Wattage Calculation |
|-----------|---------------------|
| CPU | `specs.tdp || tdp || 65` |
| GPU | `specs.tdp || tdp || 150` |
| RAM (DDR4) | `modules × 3W` |
| RAM (DDR5) | `modules × 5W` |
| NVMe SSD | `8W` per drive |
| SATA SSD | `5W` per drive |
| HDD | `10W` per drive |
| Liquid Cooler | `15W` |
| Air Cooler | `5W` |
| Case Fan | `3W` per fan |

### Functions

**`calculateTotalTDP(build: BuildComponents): number`**
Returns total wattage for PSU sizing

**`getWattageBreakdown(build): Array<{label, wattage, color}>`**
Returns breakdown for WattageDonut chart

### Recommended PSU Sizing

| System TDP | Recommended PSU |
|------------|-----------------|
| < 200W | 300-450W |
| 200-350W | 450-550W |
| 350-500W | 550-650W |
| 500-700W | 650-750W |
| 700-900W | 750-850W |
| > 900W | 850W+ |

---

## Components Reference

### UI Components (shadcn/ui)
Location: `client/src/components/ui/`

18 base components:
- **Button**: default, destructive, outline, ghost, link variants
- **Card**: header, content, footer subcomponents
- **Input**, **Label**, **Badge**
- **Dialog**, **Sheet**, **Popover**
- **Select**, **DropdownMenu**
- **Tabs**, **Slider**, **Switch**
- **Tooltip**, **ScrollArea**
- **Table**, **Skeleton**

### Common Components
Location: `client/src/components/common/`

| Component | Props | Description |
|-----------|-------|-------------|
| LoadingSpinner | size?: "sm"\|"md"\|"lg" | Animated loader |
| ErrorBoundary | children, fallback | React error boundary |
| EmptyState | icon, title, action | Placeholder for no data |
| SearchBar | value, onChange, onSearch | Search input with icon |
| PriceTag | price, originalPrice?, discount? | Formatted price with badge |
| RatingStars | rating (1-5), size? | Star rating display |
| ComponentIcon | category, size?, className? | Category icon mapping |
| RecentFilter | active, onChange | Year filter toggle |
| InfiniteScroll | hasMore, onLoadMore, children | Scroll-triggered loading |

### Chart Components
Location: `client/src/components/charts/`

| Component | Props | Description |
|-----------|-------|-------------|
| PriceHistoryChart | data: Array<{date, price, retailer}> | Line chart with retailer series |
| WattageDonut | breakdown: Array<{label, wattage, color}> | Power consumption donut |

### Product Components
Location: `client/src/components/products/`

| Component | Props | Description |
|-----------|-------|-------------|
| ProductTable | components, selectable?, onSelect? | Grid with checkboxes |
| ProductFilters | filters, onChange | Sidebar filters |
| ProductRow | component, selected, onSelect | Single product row |
| ProductSpecs | component, category | Category-specific specs |
| ProductPrices | prices, currency | Multi-retailer prices |
| ProductReviews | reviews | Review list with distribution |
| ProductCompareCard | component, onRemove | Comparison card |

### Builder Components
Location: `client/src/components/builder/`

| Component | Props | Description |
|-----------|-------|-------------|
| BuilderTable | slots, onSlotChange | Main build table |
| BuilderRow | slot, onComponentSelect, onRemove | Single slot row |
| ComponentPicker | category, onSelect | Component selection dialog |
| ComponentPickerFilters | filters, onChange | Picker filters |
| ComponentPickerTable | components, onSelect | Picker results table |
| ComponentCard | component, compact? | Mini component display |
| CompatibilityBanner | results | All compatibility issues |
| CompatibilityIcon | status, size? | Status indicator icon |
| WattageEstimator | totalWattage | PSU recommendation |
| WattageBreakdown | breakdown | Power breakdown chart |
| BuildSummary | build | Build totals and info |
| BuildActions | build, onSave, onShare | Save, export, share actions |
| BuildShareDialog | open, onClose, shareId | Share link dialog |
| BuildExport | build | Export to JSON/CSV |

### Chat Components
Location: `client/src/components/chat/`

| Component | Props | Description |
|-----------|-------|-------------|
| ChatWidget | buildId | Floating chat button |
| ChatWindow | session, onSend, onClose | Full chat interface |

### Layout Components
Location: `client/src/components/layout/`

| Component | Description |
|-----------|-------------|
| Layout | Main app wrapper with Header/Footer |
| Header | Navigation, user menu |
| Footer | Links, copyright |

---

## Python Scraper

### Overview
Python-based data pipeline for scraping PCPartPicker and importing component data.

**Location:** `scraper/`

### Architecture

```
scraper/
├── scrapers/           # Data fetching
│   ├── base_scraper.py
│   ├── pypartpicker_scraper.py
│   ├── category_scraper.py
│   └── price_scraper.py
├── transformers/       # Data processing
│   ├── normalizer.py
│   ├── spec_parser.py
│   ├── year_inferrer.py
│   └── deduplicator.py
└── loaders/           # Database operations
    ├── db_loader.py
    ├── seed_loader.py
    └── price_updater.py
```

### Entry Scripts

| Script | Parameters | Description |
|--------|------------|-------------|
| `seed_from_dataset.py` | - | Import seed data from GitHub dataset |
| `scrape_category.py` | category, pages, region | Scrape single category |
| `update_prices.py` | limit, region | Update prices for recent components |
| `scrape_all.py` | - | Scrape all categories (not recommended) |

### Example Usage

```bash
cd scraper
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Import seed data
python seed_from_dataset.py

# Scrape CPUs, 3 pages, US region
python scrape_category.py cpu 3 us

# Update last 100 components
python update_prices.py 100 us
```

### Features
- PCPartPicker scraping via pypartpicker
- Brand/model normalization
- Spec parsing and inference
- Year inference from product names
- Deduplication by part_number
- Batch database loading

---

## Deploy

### Automatic Deploy
Every push to `main` branch triggers automatic Vercel deployment.

### Manual Deploy
```bash
cd client
npm run build
vercel --prod
```

### Git Workflow
```bash
git add .
git commit -m "description"
git push origin main
```

### Production URL
Frontend: `https://pcpartfinder-app.vercel.app`

---

## Troubleshooting

### Database Issues

**Problem:** Migration fails
```bash
# Reset database (WARNING: destroys data)
npx prisma migrate reset

# Or create new migration
npx prisma migrate dev --name init
```

**Problem:** Prisma Client outdated
```bash
npx prisma generate
```

### Development Issues

**Problem:** Port already in use
```bash
# Find and kill process on port 5173 (Vite)
lsof -ti:5173 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5173  # Windows
```

**Problem:** Module not found
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Scraper Issues

**Problem:** Rate limiting
- Increase delay in `config.py`
- Reduce pages per request

**Problem:** Database connection
- Check DATABASE_URL in `.env`
- Ensure PostgreSQL is running: `docker-compose ps`

---

## Appendix

### Resources

**Documentation:**
- [React 19](https://react.dev)
- [Vite 7](https://vitejs.dev)
- [Hono](https://hono.dev)
- [Prisma](https://www.prisma.io/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs)
- [Tailwind CSS 4](https://tailwindcss.com/docs)

**Tools:**
- [shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)
- [Recharts](https://recharts.org)

### Glossary

| Term | Definition |
|------|------------|
| TDP | Thermal Design Power - CPU/GPU heat output in watts |
| Socket | Physical CPU interface (AM4, AM5, LGA1700, etc.) |
| Form Factor | Motherboard/case size standard (ATX, mATX, ITX) |
| Part Number | Unique manufacturer identifier |
| Share ID | Public build URL identifier |
| pcppId | PCPartPicker component identifier |

### FAQ

**Q: How do I add a new component category?**
1. Add to `ComponentCategory` enum in Prisma schema
2. Run `npx prisma migrate dev`
3. Add to `shared/src/categories.ts`
4. Update builder slots in `useBuildStore.ts`

**Q: Where is the API base URL configured?**
A: In `client/src/lib/api.ts` (create if using fetch directly)

**Q: How do I add a new compatibility rule?**
A: Add to `COMPATIBILITY_RULES` array in `shared/src/compatibility-rules.ts`

**Q: What's the default recent year filter?**
A: 2019, enabled by default in `useFilterStore`

**Q: How do I reset the build state?**
A: Call `useBuildStore.getState().clearBuild()`
