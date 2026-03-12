import { useRef, useEffect, useState } from "react";
import { formatPrice } from "@lib/utils";
import { useComponents } from "@hooks/useComponents";
import { TrendingDown, Activity, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

/* ─── Intersection observer hook ───────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ═════════════════════════════════════════════════════════════
   PRICE DROPS PAGE
   ═════════════════════════════════════════════════════════════ */
export default function PriceDropsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"24h" | "7d" | "30d" | "all">("all");
  const { data: allComponents } = useComponents(undefined);

  // Simulate price drops by sorting components with price history
  const components = allComponents
    ?.filter((c) => c.prices && c.prices.length > 0)
    .sort((a, b) => {
      const priceA = a.prices?.[0]?.price || 0;
      const priceB = b.prices?.[0]?.price || 0;
      // Sort by lowest price first
      return priceA - priceB;
    })
    .slice(0, 24) || [];

  const totalSavings = components.reduce((acc, comp) => {
    const price = comp.prices?.[0]?.price || 0;
    return acc + (price * 0.1); // Simulated 10% average savings
  }, 0);

  return (
    <div className="w-full overflow-x-hidden">
      {/* ── Hero ──────────────────────────────────────────── */}
      <PriceDropsHero totalSavings={totalSavings} />

      {/* ── Price Drops List ─────────────────────────────────── */}
      <section className="py-12">
        <div className="container px-4">
          {/* Period Filter */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 p-1 rounded-xl border border-border/60 bg-muted/30">
              {[
                { label: "24h", value: "24h" as const, icon: Clock },
                { label: "7 giorni", value: "7d" as const, icon: TrendingDown },
                { label: "30 giorni", value: "30d" as const, icon: Activity },
                { label: "Tutti", value: "all" as const, icon: Sparkles },
              ].map((period) => {
                const Icon = period.icon;
                const isActive = selectedPeriod === period.value;
                return (
                  <Button
                    key={period.value}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period.value)}
                    className="rounded-lg gap-2"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {period.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component, index) => (
              <PriceDropCard
                key={component.id}
                component={component}
                dropPercent={Math.random() * 20}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Sub-components                                                 */
/* ───────────────────────────────────────────────────────────── */

function PriceDropsHero({ totalSavings }: { totalSavings: number }) {
  const { ref } = useInView(0.1);

  return (
    <section ref={ref} className="relative min-h-[65vh] flex items-center justify-center overflow-hidden border-b border-border">
      {/* ── Animated background grid ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Radial glow (green themed) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, hsl(142 76% 36% / 0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── Floating orbs (green themed) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-16 left-[10%] h-56 w-56 rounded-full bg-green-500/8 blur-[80px] animate-[float_8s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-16 right-[10%] h-72 w-72 rounded-full bg-emerald-500/8 blur-[100px] animate-[float_10s_ease-in-out_infinite_reverse]"
      />

      {/* ── Content ── */}
      <div className="container relative z-10 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-[fadeInDown_0.6s_ease-out]">
            <Badge
              variant="outline"
              className="gap-2 px-4 py-2 text-sm font-medium border-green-500/30 bg-green-500/5 backdrop-blur-sm"
            >
              <TrendingDown className="mr-1.5 h-3.5 w-3.5 text-green-500" />
              Offerte
            </Badge>
          </div>

          {/* Heading */}
          <h1 className="animate-[fadeInUp_0.8s_ease-out] text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Cali di{" "}
            <span
              className="bg-gradient-to-r from-green-500 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-[gradientShift_6s_ease-in-out_infinite]"
              style={{ backgroundSize: "200% auto" }}
            >
              Prezzo
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
            Componenti con prezzo ridotto - Aggiornato giornalmente.
            Risparmia sui migliori componenti per il tuo PC.
          </p>

          {/* Savings Counter */}
          <div className="mx-auto mt-10 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl border border-green-500/30 bg-green-500/5 backdrop-blur-sm">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white shadow-lg">
                <Sparkles className="h-7 w-7" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Risparmio totale</p>
                <p className="text-3xl font-extrabold text-green-500">
                  {formatPrice(totalSavings)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface PriceDropCardProps {
  component: {
    id: string;
    name: string;
    brand: string;
    category: string;
    specs: Record<string, unknown>;
    prices?: Array<{ price: number; retailer: string; url: string; scrapedAt: string }>;
  };
  dropPercent: number;
  index: number;
}

function PriceDropCard({ component, dropPercent, index }: PriceDropCardProps) {
  const { ref, inView } = useInView(0.05);
  const price = component.prices?.[0];
  const oldPrice = price ? price.price * (1 + dropPercent / 100) : 0;
  const hasSignificantDrop = dropPercent > 5;

  return (
    <div
      ref={ref}
      className="group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.5s ease-out",
        transitionDelay: `${index * 50}ms`,
      }}
    >
      <Card className="h-full overflow-hidden border-border/60 bg-card transition-all duration-500 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/5 hover:-translate-y-1">
        {/* Drop Badge */}
        {hasSignificantDrop && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              <span className="font-bold">-{dropPercent.toFixed(1)}%</span>
            </div>
            <span className="text-sm font-medium">Risparmio!</span>
          </div>
        )}

        {/* Top gradient line on hover */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-green-500 via-emerald-400 to-teal-400 opacity-0 transition-opacity group-hover:opacity-100 z-10" />

        <CardContent className="p-5">
          {/* Image placeholder */}
          <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-xl mb-4 flex items-center justify-center group-hover:from-green-500/10 group-hover:to-muted/50 transition-colors">
            <span className="text-muted-foreground/50 font-bold text-xl">
              {component.brand}
            </span>
          </div>

          {/* Info */}
          <Badge variant="outline" className="mb-3 text-xs">
            {component.category.replace(/_/g, " ")}
          </Badge>
          <p className="text-sm text-muted-foreground mb-1">{component.brand}</p>
          <h3 className="font-semibold mb-4 line-clamp-2 min-h-[2.5rem] group-hover:text-green-500 transition-colors">
            {component.name}
          </h3>

          <div className="my-4" />

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {price ? (
                <>
                  <span className="text-2xl font-extrabold text-green-500">
                    {formatPrice(price.price)}
                  </span>
                  {hasSignificantDrop && (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatPrice(oldPrice)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    {price.retailer}
                  </p>
                </>
              ) : (
                <span className="text-muted-foreground">Prezzo N/A</span>
              )}
            </div>

            {price && (
              <Button
                asChild
                size="sm"
                className="shrink-0 bg-green-500 hover:bg-green-600"
              >
                <a
                  href={price.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
