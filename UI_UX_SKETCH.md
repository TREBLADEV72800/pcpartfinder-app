# PCPartFinder - UI/UX Design Sketch

## Table of Contents
1. [Design System](#design-system)
2. [Layout Structure](#layout-structure)
3. [Pages Overview](#pages-overview)
4. [Component Library](#component-library)
5. [User Flows](#user-flows)

---

## Design System

### Color Palette
```
Primary:    #3b82f6 (Blue 500) - CTAs, links, accents
Secondary:  #64748b (Slate 500) - Secondary actions
Background: #ffffff / #09090b - Light/dark mode
Card:       #ffffff / #18181b
Border:     #e2e8f0 / #27272a
Muted:      #f1f5f9 / #27272a
Success:    #22c55e (Green)
Warning:    #f59e0b (Amber)
Error:      #ef4444 (Red)
Info:       #3b82f6 (Blue)
```

### Typography
```
Headings: Inter, sans-serif (font-bold)
Body:      Inter, sans-serif (font-normal)
Mono:      JetBrains Mono (for specs/technical data)

Sizes:
- H1: text-4xl md:text-6xl
- H2: text-3xl
- H3: text-xl
- Body: text-base
- Small: text-sm / text-xs
```

### Spacing
```
Container padding: px-4 (mobile), px-4 (desktop)
Section spacing:   py-8 to py-20
Gap:               gap-2 to gap-8
```

### Border Radius
```
Buttons:  rounded-lg
Inputs:   rounded-lg
Cards:    rounded-lg
Badges:   rounded
```

---

## Layout Structure

### Global Layout (Layout.tsx)

```
┌─────────────────────────────────────────────────────────────┐
│  Header (sticky, h-16)                                       │
│  ┌────────────┬───────────────────────────┬──────────────┐ │
│  │ Logo       │ Nav (hidden on mobile)     │ Search|Login │ │
│  │ PCBuilderAI│ Builder|Components|...      │ [🔍][👤]   │ │
│  └────────────┴───────────────────────────┴──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Main Content (min-h-screen)                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │  [Page Content Here]                                  │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Footer                                                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Links | Copyright | Social                              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Header Component

**Desktop:**
```
┌────────────────────────────────────────────────────────────────┐
│ [🖥️] PCBuilderAI    System Builder  Components  Builds        │
│                    Compare  Price Drops          [🔍] [👤]     │
└────────────────────────────────────────────────────────────────┘
```

**Mobile (with menu open):**
```
┌─────────────────────────┐
│ [🖥️] PCBuilderAI  [🍔]  │
├─────────────────────────┤
│ ▼ System Builder        │
│ ▼ Components            │
│ ▼ Builds                │
│ ▼ Compare               │
│ ▼ Price Drops           │
│ ▼ Accedi                │
└─────────────────────────┘
```

---

## Pages Overview

### 1. Home Page (/)

**Hero Section:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              BUILD YOUR DREAM PC                            │
│        Configura il tuo PC perfetto con                     │
│      verifica compatibilità in tempo reale                  │
│                                                             │
│    [Inizia a Costruire]  [Esplora Build]                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Features Grid:**
```
┌──────────────┬──────────────┬──────────────┐
│ 🖥️          │ ⚡           │ 💾           │
│ System       │ Verifica     │ Database     │
│ Builder      │ Compat.      │ Completo     │
├──────────────┼──────────────┼──────────────┤
│ 📉           │ 👥           │ 🖥️           │
│ Storico      │ Community    │ Confronto    │
│ Prezzi       │ Builds       │ Prodotti     │
└──────────────┴──────────────┴──────────────┘
```

**Category Browse:**
```
┌────────┬────────┬────────┬────────┐
│ 🖥️ CPU │ 👾 GPU │ 📦 RAM │ 💾 SSD │
│ ────── │ ────── │ ────── │ ────── │
│ Unità  │ Scheda │ Memoria│ Storage│
│ proc.  │ video  │        │        │
├────────┼────────┼────────┼────────┤
│ 🌪️ Fan │ 🔌 PSU │ 📺 Monitor│💿 OS  │
│ ────── │ ────── │ ────── │ ────── │
│ Cooler │ Alim.  │ Display │ S.O.   │
└────────┴────────┴────────┴────────┘
```

---

### 2. Builder Page (/builder)

**Main Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ System Builder                                              │
│ Configura il tuo PC componente per componente               │
├─────────────────────────────────┬───────────────────────────┤
│ Builder Table (2/3 width)       │ Sidebar (1/3 width)       │
│                                 │                           │
│ ┌─────────────────────────────┐ │ ┌─────────────────────┐ │
│ │ [🖥️] CPU         ─────  ─  │ │ │ Azioni Build        │ │
│ │    Scegli CPU              │ │ │ [Salva][Esporta][   │ │
│ ├─────────────────────────────┤ │ │  Condividi]          │ │
│ │ [🌪️] CPU Cooler   ─────  ─  │ │ │                     │ │
│ │    Scegli CPU Cooler       │ │ │ Statistiche          │ │
│ ├─────────────────────────────┤ │ │ Componenti: 3/12     │ │
│ │ [🖥️] Motherboard  ─────  ─  │ │ │ Wattaggio: ~250W    │ │
│ │    Scegli Motherboard      │ │ │ Prezzo: €1,234.56    │ │
│ ├─────────────────────────────┤ │ └─────────────────────┘ │
│ │ [💾] Memory      ─────  ─  │ │                           │
│ │    Scegli RAM              │ │                           │
│ ├─────────────────────────────┤ │                           │
│ │ ...                        │ │                           │
│ ├═════════════════════════════┤ │                           │
│ │ Totale Build        €1,235  │ │                           │
│ └─────────────────────────────┘ │                           │
│                                 │                           │
│ Compatibilità                   │                           │
│ ┌─────────────────────────────┐ │                           │
│ │ ✓ Socket AM5 compatibile    │ │                           │
│ │ ✓ DDR5 compatibile          │ │                           │
│ │ ⚠️ Wattaggio: raccomandato  │ │                           │
│ │    650W                      │ │                           │
│ └─────────────────────────────┘ │                           │
└─────────────────────────────────┴───────────────────────────┘
```

**Component Picker (Slide-over Panel):**
```
┌─────────────────────────────────────────────────────────────┐
│ Scegli CPU                                    [X]           │
├─────────────────────────────────────────────────────────────┤
│ 🔍 Cerca per nome o brand...                                │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [AMD]                          [📊]               €320  │ │
│ │ Ryzen 7 7800X3D               Amazon.it         [🛒]   │ │
│ │ Socket: AM5  TDP: 120W                              │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ [Intel]                        [📊]               €380  │ │
│ │ Core i7-14700K                Amazon.it         [🛒]   │ │
│ │ Socket: LGA1700  TDP: 125W                          │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ...                                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                       [Annulla]│
└─────────────────────────────────────────────────────────────┘
```

**Compatibility Banner States:**
```
┌─────────────────────────────────────────────────────────────┐
│ OK State                                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ✓ Tutti i componenti sono compatibili                   │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Warning State                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⚠️ Attenzione                                           │ │
│ │ • PSU 550W sufficiente ma margine basso.                │ │
│ │   Raccomandato: 650W                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Error State                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ✗ Incompatibilità rilevate                             │ │
│ │ • Socket AM5 incompatibile con LGA1700                  │ │
│ │ • GPU 320mm troppo lunga per il case (max: 300mm)       │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. Product List Page (/products/:category)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ CPU                                   24 componenti disponibili│
├─────────────────────────────────────────────────────────────┤
│ [≡ Filtri] [Nome A-Z ▼]                                     │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────┬─────────────────┬─────────────────┐     │
│ │ [📷]            │ [📷]            │ [📷]            │     │
│ │ AMD             │ Intel           │ AMD             │     │
│ │ Ryzen 7 7800X3D │ Core i7-14700K  │ Ryzen 5 7600X   │     │
│ │ AM5 120W        │ LGA1700 125W    │ AM5 65W         │     │
│ │ €320            │ €380            │ €220            │     │
│ │ Amazon [🛒]     │ Amazon [🛒]     │ Amazon [🛒]     │     │
│ ├─────────────────┼─────────────────┼─────────────────┤     │
│ │ ...             │ ...             │ ...             │     │
│ └─────────────────┴─────────────────┴─────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

**Filters Panel (expandable):**
```
┌─────────────────────────────────────────────────────────────┐
│ ┌──────────┬──────────┬──────────┬──────────┐              │
│ │ Brand    │ Prezzo   │ Specifiche| Anno     │              │
│ │ ☑ AMD    │ Min: [  ]│ Socket:  │ ○ 2024+  │              │
│ │ ☑ Intel  │ Max: [  ]│ [▼]      │ ○ 2023+  │              │
│ │ ☐ NVIDIA │          │          │ ○ 2022+  │              │
│ │          │          │          │ ● Tutti  │              │
│ └──────────┴──────────┴──────────┴──────────┘              │
└─────────────────────────────────────────────────────────────┘
```

---

### 4. Product Detail Page (/product/:id)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to CPU                                               │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┬─────────────────────────────┐   │
│ │                         │  AMD Ryzen 7 7800X3D         │   │
│ │     [Large Image]       │  ★★★★★ 4.8 (245 reviews)    │   │
│ │                         │  ─────────────────────────   │   │
│ │                         │  €320.00                      │   │
│ │                         │  [Amazon.it 🛒]              │   │
│ │                         │  [eBay 🛒]                   │   │
│ │                         │  [Alternative 🛒]            │   │
│ ├─────────────────────────┴─────────────────────────────┤   │
│ │ Specifiche Tecniche                                    │   │
│ │ ┌─────────────────────────────────────────────────┐   │   │
│ │ │ Socket:     AM5                                  │   │   │
│ │ │ Cores:      8                                    │   │   │
│ │ │ Threads:    16                                   │   │   │
│ │ │ Base Clock: 4.2 GHz                             │   │   │
│ │ │ Boost:      5.0 GHz                             │   │   │
│ │ │ TDP:        120W                                 │   │   │
│ │ │ Cache:      96MB                                 │   │   │
│ │ └─────────────────────────────────────────────────┘   │   │
├─────────────────────────────────────────────────────────────┤
│ Storico Prezzi                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ €400 ┤                                                    │ │
│ │ €350 ┤    ╱───╲                                          │ │
│ │ €300 ┤   ╱     ╲─╲                                       │ │
│ │ €250 ┤  ╱         ╲                                      │ │
│ │      └──────────────────────────────►                   │ │
│ │        Jan   Feb   Mar   Apr                             │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Recensioni                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ★★★★★                                                   │ │
│ │ "Ottima CPU, gaming top!"                                │ │
│ │ - Mario R. - 2 giorni fa                                 │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ★★★★☆                                                   │ │
│ │ "Si surriscalda un po' sotto load"                       │ │
│ │ - Luca G. - 1 settimana fa                               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### 5. Compare Page (/compare)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Confronta Prodotti                                [Clear All]│
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────────┬────────────────────┬──────────────┐ │
│ │ AMD Ryzen 7 7800X3D   │ Intel i7-14700K    │ + Aggiungi   │ │
│ │ [📷]                 │ [📷]              │              │ │
│ │ €320                 │ €380              │              │ │
│ ├──────────────────────┼────────────────────┼──────────────┤ │
│ │ Socket               │ Socket            │              │ │
│ │ AM5                  │ LGA1700           │              │ │
│ ├──────────────────────┼────────────────────┼──────────────┤ │
│ │ Cores                │ Cores             │              │ │
│ │ 8                    │ 20                │              │ │
│ ├──────────────────────┼────────────────────┼──────────────┤ │
│ │ Threads              │ Threads           │              │ │
│ │ 16                   │ 28                │              │ │
│ ├──────────────────────┼────────────────────┼──────────────┤ │
│ │ TDP                  │ TDP               │              │ │
│ │ 120W                 │ 125W              │              │ │
│ └──────────────────────┴────────────────────┴──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### 6. Builds Gallery Page (/builds)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Community Builds                                            │
│                                           [Tutti ▼] [Ordina]│
├─────────────────────────────────────────────────────────────┤
│ ┌────────────────────┬────────────────────┬──────────────┐ │
│ │ [Screenshot]       │ [Screenshot]       │ [Screenshot] │ │
│ │ Gaming Beast 2024  │ Workstation Pro    │ Budget Build │ │
│ │ by @techmaster     │ by @devpro         │ by @savvy    │ │
│ │ ─────────────────  │ ─────────────────  │ ──────────── │ │
│ │ €1,850             │ €2,400             │ €650         │ │
│ │ ★ 4.8  (124 likes) │ ★ 4.5  (89 likes)  │ ★ 4.2  (45)  │ │
│ │ [View Build]       │ [View Build]       │ [View Build] │ │
│ ├────────────────────┼────────────────────┼──────────────┤ │
│ │ ...                │ ...                │ ...          │ │
│ └────────────────────┴────────────────────┴──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### 7. Build Detail Page (/build/:shareId)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Builds                                            │
├─────────────────────────────────────────────────────────────┤
│ Gaming Beast 2024                          by @techmaster  │
│ "Configurazione top per gaming a 1440p ultra"              │
│ ─────────────────────────────────────────────────────────── │
│ [👍 Like] [📋 Copy Build] [💬 Comment]                     │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Components                              Price            │ │
│ │ ├─ AMD Ryzen 7 7800X3D                 €320             │ │
│ │ ├─ NVIDIA RTX 4080                     €1,100           │ │
│ │ ├─ 32GB DDR5-6000                      €150             │ │
│ │ ├─ 2TB NVMe SSD                        €180             │ │ │
│ │ ├─ ...                                 ...              │ │
│ │ ─────────────────────────────────────────────────        │ │
│ │ Total                                  €1,850           │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Wattage Estimato: ~520W → Raccomandato: 650W PSU           │
│ Compatibilità: ✓ Tutti i componenti compatibili            │
└─────────────────────────────────────────────────────────────┘
```

---

### 8. Auth Pages (Login/Register)

**Login Form:**
```
┌─────────────────────────────────────────────────────────────┐
│                    Accedi                                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Email                                               │   │
│  │ [──────────────────────────────────────────────]   │   │
│  │                                                     │   │
│  │ Password                                            │   │
│  │ [──────────────────────────────────────────────]   │   │
│  │                              [Mostra]               │   │
│  │                                                     │   │
│  │              [Accedi]                              │   │
│  │                                                     │   │
│  │  Non hai un account? [Registrati]                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

### 9. Profile Page (/profile/:username)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ ┌────────┐  @techmaster                     [Edit Profile] │
│ │ [Avatar│                                                   │
│ │  64px] │  PC building enthusiast since 2015.             │
│ └────────┘  Always hunting for the best price/perf.        │
├─────────────────────────────────────────────────────────────┤
│ Le Mie Build (3)                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Gaming Beast 2024     €1,850     ★ 4.8  [Edit][Delete]  │ │
│ │ Workstation Lite      €2,400     ★ 4.5  [Edit][Delete]  │ │
│ │ Budget Build          €650      ★ 4.2  [Edit][Delete]  │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Prezzi Monitorati (5)                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ RTX 4080       Target: €999    Attuale: €1,100  [✕]    │ │
│ │ Ryzen 7 7800X3D Target: €299    Attuale: €320    [✕]    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### 10. Price Drops Page (/price-drops)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Sconti e Calo Prezzi                                        │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📉 [📷]            RTX 4080             -15%  €1,100   │ │
│ │        era €1,299                                 [🛒]  │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ 📉 [📷]            Ryzen 7 7800X3D      -10%  €320     │ │
│ │        era €355                                    [🛒]  │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ 📉 [📷]            Samsung 990 Pro      -20%  €180     │ │
│ │        era €225                                    [🛒]  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### 11. AI Chat Widget

**Closed State:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                    ┌───────┐│
│                                                    │  🤖   ││
│                                                    │ AI    ││
│                                                    └───────┘│
└─────────────────────────────────────────────────────────────┘
```

**Open State:**
```
┌──────────────────────────────────────┐
│ AI Assistant                  [─] [×] │
├──────────────────────────────────────┤
│ ┌────────────────────────────────┐   │
│ │ 👤 Ho €1000 per gaming,       │   │
│ │    cosa mi consigli?          │   │
│ ├────────────────────────────────┤   │
│ │ 🤖 Per €1000 ti consiglio:    │   │
│ │    • CPU: Ryzen 5 7600 (~€220) │   │
│ │    • GPU: RTX 4060 Ti (~€380)  │   │
│ │    • RAM: 16GB DDR5 (~€80)    │   │
│ │    • ...                      │   │
│ │    Totale: ~€950              │   │
│ │                               │   │
│ │    [Applica al Builder]       │   │
│ └────────────────────────────────┘   │
│                                      │
│ [────────────────────────────] [📤] │
└──────────────────────────────────────┘
```

---

## Component Library

### Buttons

```
Primary Button:       [Primary Label]      (bg-primary text-white)
Secondary Button:     [Secondary Label]    (bg-secondary)
Ghost Button:         [Ghost Label]        (transparent hover:bg-accent)
Icon Button:          [🔍]                  (p-2 hover:bg-accent rounded)
```

### Cards

```
Basic Card:
┌─────────────────────┐
│ Card Content        │
└─────────────────────┘

Clickable Card:
┌─────────────────────┐
│ [Hover Effect]      │
│ Card Content        │
└─────────────────────┘

Product Card:
┌─────────────────────┐
│ [Image 16:9]        │
│ Brand               │
│ Product Name        │
│ [Spec] [Spec] [Spec]│
│ €Price  [🛒]        │
└─────────────────────┘
```

### Badges

```
Status Badges:
[Success] ✓  (bg-green-100 text-green-700)
[Warning] ⚠  (bg-yellow-100 text-yellow-700)
[Error]   ✗  (bg-red-100 text-red-700)
[Info]    ℹ  (bg-blue-100 text-blue-700)

Spec Badges:
[AM5] [DDR5] [650W]  (bg-muted text-muted-foreground px-2 py-1 rounded)
```

### Tables

```
Product Table:
┌──────────────────────────────────────────────────────┐
│ Product           │ Specs    │ Price    │ Actions    │
├──────────────────────────────────────────────────────┤
│ Product Name      │ Spec...  │ €123     │ [🛒][⭐]   │
│ └─ Brand          │          │          │            │
├──────────────────────────────────────────────────────┤
│ ...               │ ...      │ ...      │ ...        │
└──────────────────────────────────────────────────────┘
```

### Dialogs/Modals

```
Modal Dialog:
┌─────────────────────────────────────────┐
│ Title                        [×]         │
├─────────────────────────────────────────┤
│                                         │
│  Content                                │
│                                         │
├─────────────────────────────────────────┤
│              [Cancel] [Confirm]         │
└─────────────────────────────────────────┘
```

### Forms

```
Input Field:
┌─────────────────────────────────────────┐
│ Label                                   │
│ [─────────────────────────────────────] │
│ Helper text                             │
└─────────────────────────────────────────┘

Select:
┌─────────────────────────────────────────┐
│ Label                                   │
│ [Selected Option            ▼]          │
└─────────────────────────────────────────┘

Checkbox:
☑ Label text
☐ Label text

Radio:
● Selected option
○ Unselected option
```

---

## User Flows

### 1. New User Building a PC

```
Home Page
    ↓
[Click "Inizia a Costruire"]
    ↓
Builder Page
    ↓
[Click on CPU slot]
    ↓
Component Picker Opens
    ↓
[Search/Select CPU]
    ↓
CPU Added → Compatibility Check Runs
    ↓
[Repeat for other components]
    ↓
[Build Complete] → Save/Share/Export
```

### 2. Browse Components Flow

```
Home Page
    ↓
[Click on Category Card]
    ↓
Product List Page
    ↓
[Apply Filters / Sort]
    ↓
[Click Product Card]
    ↓
Product Detail Page
    ↓
[View Specs / Prices / Reviews]
    ↓
[Click "Add to Build" or "Buy"]
```

### 3. Get Build Inspiration Flow

```
Home Page
    ↓
[Click "Esplora Build"]
    ↓
Builds Gallery
    ↓
[Filter by Use Case / Sort by Likes]
    ↓
[Click Build Card]
    ↓
Build Detail Page
    ↓
[Click "Copy Build" → Opens Builder with components]
```

### 4. AI Assistant Flow

```
Any Page
    ↓
[Click Chat Widget]
    ↓
Chat Window Opens
    ↓
[Ask Question: "Ho €1000 per gaming"]
    ↓
AI Responds with Recommendations
    ↓
[Click "Applica al Builder"]
    ↓
Builder Opens with Pre-filled Components
```

---

## Responsive Breakpoints

```
Mobile:     < 768px   (single column, hamburger menu)
Tablet:     768-1024px (2 columns, horizontal nav)
Desktop:    > 1024px  (3 columns, full nav)
```

## Dark Mode Support

All components support dark mode with:
- `bg-background` (switches white/black)
- `text-foreground` (switches black/white)
- `border-border` (switches light/dark gray)

---

*Document generated from codebase analysis*
*Last updated: 2025-01-XX*
