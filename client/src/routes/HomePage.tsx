import { Link } from "react-router-dom";
import {
  Cpu,
  HardDrive,
  Monitor,
  Fan,
  Box,
  Zap,
  Server,
  Disc,
  Wind,
  Droplet,
  TrendingDown,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  MonitorPlay,
  MemoryStick,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES, type CategoryMetadata } from "@shared";

// ── Icon map ────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, React.ReactElement> = {
  CPU: <Cpu className="h-7 w-7" />,
  CPU_COOLER: <Fan className="h-7 w-7" />,
  MOTHERBOARD: <Server className="h-7 w-7" />,
  MEMORY: <MemoryStick className="h-7 w-7" />,
  STORAGE: <HardDrive className="h-7 w-7" />,
  VIDEO_CARD: <Monitor className="h-7 w-7" />,
  CASE: <Box className="h-7 w-7" />,
  POWER_SUPPLY: <Zap className="h-7 w-7" />,
  MONITOR: <MonitorPlay className="h-7 w-7" />,
  OS: <Disc className="h-7 w-7" />,
  CASE_FAN: <Wind className="h-7 w-7" />,
  THERMAL_PASTE: <Droplet className="h-7 w-7" />,
};

// ── Feature definitions ─────────────────────────────────────
const FEATURES = [
  {
    icon: <Cpu className="h-8 w-8" />,
    title: "System Builder",
    description:
      "Configura il tuo PC componente per componente con verifica compatibilità automatica.",
    link: "/builder",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Verifica Compatibilità",
    description:
      "Controlla automaticamente socket, form factor, wattaggio e molto altro.",
  },
  {
    icon: <HardDrive className="h-8 w-8" />,
    title: "Database Completo",
    description:
      "Migliaia di componenti con prezzi aggiornati da più rivenditori.",
    link: "/products/CPU",
  },
  {
    icon: <TrendingDown className="h-8 w-8" />,
    title: "Storico Prezzi",
    description:
      "Tieni traccia dei prezzi e ricevi avvisi quando scendono.",
    link: "/price-drops",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Community Builds",
    description:
      "Condividi le tue build e scopri quelle della community.",
    link: "/builds",
  },
  {
    icon: <Monitor className="h-8 w-8" />,
    title: "Confronto Prodotti",
    description:
      "Confronta specifiche e prezzi di diversi componenti affiancati.",
    link: "/compare",
  },
] as const;

// ── Stats ───────────────────────────────────────────────────
const STATS = [
  { value: "12", label: "Categorie" },
  { value: "10k+", label: "Componenti" },
  { value: "50+", label: "Rivenditori" },
  { value: "∞", label: "Configurazioni" },
];

// ═════════════════════════════════════════════════════════════
// HomePage
// ═════════════════════════════════════════════════════════════
export default function HomePage() {
  return (
    <div className="w-full">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-background to-muted/40 py-20 md:py-28">
        {/* Decorative grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"
        />

        {/* Decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[480px] w-[720px] rounded-full bg-primary/10 blur-[120px]"
        />

        <div className="container relative z-10 px-4 text-center">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-1.5 text-sm font-medium"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Assistenza AI integrata
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Build Your{" "}
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Dream PC
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Configura il tuo PC perfetto con verifica compatibilità in tempo
            reale, confronto prezzi e assistenza AI.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="min-w-[200px] text-base">
              <Link to="/builder">
                Inizia a Costruire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-w-[200px] text-base"
            >
              <Link to="/builds">Esplora Build</Link>
            </Button>
          </div>

          {/* Stats strip */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">
              Tutto ciò che ti serve per assemblare il tuo PC
            </h2>
            <p className="mt-3 text-muted-foreground">
              Strumenti professionali, completamente gratuiti.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Category Browse ───────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Esplora per Categoria</h2>
            <p className="mt-3 text-muted-foreground">
              Sfoglia il catalogo per trovare il componente ideale.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Object.values(CATEGORIES).map((cat: CategoryMetadata) => (
              <CategoryCard key={cat.slug} cat={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20">
        {/* Decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]"
        />

        <div className="container relative z-10 px-4 text-center">
          <h2 className="text-3xl font-bold">Pronto a iniziare?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Inizia subito a configurare il tuo PC. La verifica compatibilità ti
            guiderà verso scelte corrette.
          </p>
          <Button asChild size="lg" className="mt-8 min-w-[220px] text-base">
            <Link to="/builder">
              Vai al System Builder
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Sub-components
// ═════════════════════════════════════════════════════════════

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}

function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  const inner = (
    <Card className="group relative h-full overflow-hidden border-border transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
      <CardContent className="flex h-full flex-col p-6">
        {/* Icon wrapper */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {icon}
        </div>

        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {link && (
          <span className="mt-4 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Scopri di più
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </span>
        )}
      </CardContent>
    </Card>
  );

  if (link) {
    return (
      <Link to={link} className="block h-full">
        {inner}
      </Link>
    );
  }

  return inner;
}

function CategoryCard({ cat }: { cat: CategoryMetadata }) {
  return (
    <Link
      to={`/products/${cat.slug}`}
      className="group flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
    >
      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {CATEGORY_ICONS[cat.slug] || <Cpu className="h-7 w-7" />}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold leading-snug">{cat.name}</h3>
        {cat.description && (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {cat.description}
          </p>
        )}
      </div>

      {/* Arrow indicator */}
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" />
    </Link>
  );
}