import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  Minus,
  Package,
  ShoppingCart,
  Heart,
  Share2,
  Info,
  Shield,
  Layers,
  Star,
} from "lucide-react";
import { useComponent, usePriceHistory } from "@hooks/useComponents";
import { formatPrice } from "@lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
   PRODUCT DETAIL PAGE
   ═════════════════════════════════════════════════════════════ */
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const query = useComponent(id || "");
  const component = query.data;
  const loading = query.isPending;
  const { data: priceHistory } = usePriceHistory(id || "");
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "reviews">("overview");

  if (loading) {
    return (
      <div className="w-full min-h-screen">
        <section className="py-32">
          <div className="container px-4">
            <LoadingState />
          </div>
        </section>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="w-full min-h-screen">
        <section className="py-32">
          <div className="container px-4">
            <NotFoundState />
          </div>
        </section>
      </div>
    );
  }

  const specs = component.specs as Record<string, unknown>;
  const price = component.prices?.[0];
  const categoryLabel = component.category.replace(/_/g, " ");

  return (
    <div className="w-full overflow-x-hidden">
      {/* ── Hero ──────────────────────────────────────────── */}
      <DetailHero
        categoryName={categoryLabel}
        component={component}
        price={price}
      />

      {/* ── Tabs Content ─────────────────────────────────────── */}
      <section className="py-12 bg-muted/20">
        <div className="container px-4">
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
            <TabsList className="mb-8 bg-background p-1">
              <TabsTrigger value="overview" className="gap-2">
                <Info className="h-4 w-4" />
                Panoramica
              </TabsTrigger>
              <TabsTrigger value="specs" className="gap-2">
                <Layers className="h-4 w-4" />
                Specifiche
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <Star className="h-4 w-4" />
                Recensioni
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <DetailCard
                    title="Descrizione"
                    icon={<Info className="h-5 w-5" />}
                  >
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {component.name} è un componente {categoryLabel} di alta qualità
                      prodotto da {component.brand}
                      {component.releaseYear && ` nel ${component.releaseYear}`}
                      {component.tdp && ` con un TDP di ${component.tdp}W`}.
                      {component.socket && ` Compatibile con socket ${component.socket}.`}
                    </p>
                  </DetailCard>

                  {/* Price History */}
                  {priceHistory && priceHistory.length > 0 && (
                    <DetailCard
                      title="Storico Prezzi"
                      icon={<TrendingDown className="h-5 w-5" />}
                    >
                      <PriceHistoryChart history={priceHistory} />
                    </DetailCard>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="lg:col-span-1 space-y-6">
                  <DetailCard
                    title="Informazioni"
                    icon={<Shield className="h-5 w-5" />}
                  >
                    <StatRow
                      label="Categoria"
                      value={categoryLabel}
                    />
                    {component.socket && (
                      <StatRow label="Socket" value={component.socket} />
                    )}
                    {component.formFactor && (
                      <StatRow label="Form Factor" value={component.formFactor} />
                    )}
                    {component.tdp && (
                      <StatRow label="TDP" value={`${component.tdp}W`} />
                    )}
                    {component.releaseYear && (
                      <StatRow label="Anno" value={String(component.releaseYear)} />
                    )}
                  </DetailCard>

                  {/* All Prices */}
                  {component.prices && component.prices.length > 1 && (
                    <DetailCard
                      title="Tutti i Prezzi"
                      icon={<ShoppingCart className="h-5 w-5" />}
                    >
                      <div className="space-y-3">
                        {component.prices.map((p, i) => (
                          <PriceLink
                            key={i}
                            retailer={p.retailer}
                            price={p.price}
                            currency={p.currency}
                            url={p.url}
                            inStock={p.inStock}
                          />
                        ))}
                      </div>
                    </DetailCard>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Specs Tab */}
            <TabsContent value="specs">
              <DetailCard
                title="Specifiche Tecniche"
                icon={<Layers className="h-5 w-5" />}
              >
                <SpecsGrid specs={specs} />
              </DetailCard>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <DetailCard
                title="Recensioni"
                icon={<Star className="h-5 w-5" />}
              >
                <ReviewsPlaceholder />
              </DetailCard>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Sub-components                                                 */
/* ───────────────────────────────────────────────────────────── */

function DetailHero({
  categoryName,
  component,
  price,
}: {
  categoryName: string;
  component: any;
  price: any;
}) {
  const { ref, inView } = useInView(0.1);

  return (
    <section ref={ref} className="relative min-h-[60vh] flex items-end overflow-hidden border-b border-border">
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

      {/* ── Radial glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── Content ── */}
      <div className="container relative z-10 px-4 pb-16">
        {/* Back Button */}
        <Link
          to={`/products/${component.category.toLowerCase()}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna a {categoryName}
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 items-end">
          {/* Left: Info */}
          <div
            className="flex-1 transition-all duration-700"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(30px)",
            }}
          >
            <Badge
              variant="secondary"
              className="mb-4 inline-flex gap-2"
            >
              <Package className="h-3.5 w-3.5" />
              {categoryName}
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4">
              {component.name}
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              {component.brand}
            </p>

            {/* Key Specs */}
            <div className="flex flex-wrap gap-2">
              {component.socket && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {component.socket}
                </Badge>
              )}
              {component.tdp && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {component.tdp}W TDP
                </Badge>
              )}
              {component.releaseYear && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {component.releaseYear}
                </Badge>
              )}
            </div>
          </div>

          {/* Right: Price Card */}
          {price && (
            <PriceCard
              price={price.price}
              retailer={price.retailer}
              url={price.url}
              inStock={price.inStock}
              currency={price.currency}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function PriceCard({
  price,
  retailer,
  url,
  inStock,
  currency,
}: {
  price: number;
  retailer: string;
  url: string;
  inStock?: boolean;
  currency: string;
}) {
  return (
    <Card className="sticky top-24 border-primary/20 bg-card overflow-hidden">
      {/* Top gradient */}
      <div className="h-1 bg-gradient-to-r from-primary via-blue-400 to-cyan-400" />

      <CardContent className="p-6">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">
            Prezzo più basso
          </p>
          <p className="text-4xl font-extrabold text-primary">
            {currency === "EUR" ? `€${price.toFixed(2)}` : price}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            da {retailer}
          </p>
        </div>

        <Separator className="my-4" />

        <Button
          asChild
          className="w-full h-14 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group"
          disabled={!inStock}
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            {inStock ? "Acquista ora" : "Non disponibile"}
          </a>
        </Button>

        <div className="mt-6 space-y-3">
          <Button
            variant="outline"
            className="w-full group"
            size="lg"
          >
            <Heart className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Salva
          </Button>
          <Button
            variant="outline"
            className="w-full group"
            size="lg"
          >
            <Share2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Condividi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface PriceLinkProps {
  retailer: string;
  price: number;
  currency: string;
  url: string;
  inStock?: boolean;
}

function PriceLink({ retailer, price, currency, url, inStock }: PriceLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:bg-accent/50 transition-all group"
    >
      <div>
        <p className="font-medium">{retailer}</p>
        <p className="text-xs text-muted-foreground">
          {inStock ? "Disponibile" : "Esaurito"}
        </p>
      </div>
      <span className="font-semibold text-primary">
        {currency === "EUR" ? `€${price.toFixed(2)}` : price}
      </span>
    </a>
  );
}

interface DetailCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function DetailCard({ title, icon, children }: DetailCardProps) {
  return (
    <Card className="border-border/60 bg-card overflow-hidden">
      <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </Card>
  );
}

interface StatRowProps {
  label: string;
  value: string;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

interface PriceHistoryChartProps {
  history: Array<{ price: number; recordedAt: string }>;
}

function PriceHistoryChart({ history }: PriceHistoryChartProps) {
  if (history.length < 2) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Dati insufficienti per il grafico
      </div>
    );
  }

  const minPrice = Math.min(...history.map((h) => h.price));
  const maxPrice = Math.max(...history.map((h) => h.price));
  const priceRange = maxPrice - minPrice || 1;

  // Simple SVG chart
  const points = history.map((h, i) => {
    const x = (i / (history.length - 1)) * 100;
    const y = 100 - ((h.price - minPrice) / priceRange) * 80 - 10;
    return `${x},${y}`;
  }).join(" ");

  const firstPrice = history[0]?.price || 0;
  const lastPrice = history[history.length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = ((priceChange / firstPrice) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Price change indicator */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
        {priceChange > 0 ? (
          <>
            <TrendingUp className="h-5 w-5 text-red-500" />
            <div>
              <span className="text-red-500 font-semibold">
                +{formatPrice(Math.abs(priceChange))} (+{priceChangePercent}%)
              </span>
              <p className="text-sm text-muted-foreground">Aumento di prezzo</p>
            </div>
          </>
        ) : priceChange < 0 ? (
          <>
            <TrendingDown className="h-5 w-5 text-green-500" />
            <div>
              <span className="text-green-500 font-semibold">
                -{formatPrice(Math.abs(priceChange))} ({priceChangePercent}%)
              </span>
              <p className="text-sm text-muted-foreground">Riduzione di prezzo</p>
            </div>
          </>
        ) : (
          <>
            <Minus className="h-5 w-5 text-muted-foreground" />
            <div>
              <span className="text-muted-foreground font-semibold">
                Nessun cambio prezzo
              </span>
              <p className="text-sm text-muted-foreground">Prezzo stabile</p>
            </div>
          </>
        )}
      </div>

      {/* Simple line chart */}
      <div className="h-48 relative">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points={`0,100 ${points} 100,100`}
            fill="url(#chartGradient)"
          />
          <polyline
            points={points}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Price range */}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Min: {formatPrice(minPrice)}</span>
        <span className="text-muted-foreground">Max: {formatPrice(maxPrice)}</span>
      </div>
    </div>
  );
}

interface SpecsGridProps {
  specs: Record<string, unknown>;
}

function SpecsGrid({ specs }: SpecsGridProps) {
  const displaySpecs = Object.entries(specs).filter(([_, value]) =>
    value !== null && value !== undefined && value !== ""
  );

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {displaySpecs.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card hover:border-primary/20 transition-colors"
        >
          <span className="text-muted-foreground capitalize">
            {key.replace(/_/g, " ")}
          </span>
          <span className="font-medium">{String(value)}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewsPlaceholder() {
  return (
    <div className="text-center py-16">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <Star className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-3">
        Nessuna recensione ancora
      </h3>
      <p className="text-muted-foreground">
        Sii il primo a recensire questo componente
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
      </div>
      <p className="text-lg text-muted-foreground">Caricamento componente...</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Package className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-4">
        Componente non trovato
      </h2>
      <p className="text-muted-foreground mb-8">
        Il componente che stai cercando non esiste o è stato rimosso
      </p>
      <Button asChild size="lg">
        <Link to="/products/CPU">
          Torna al catalogo
        </Link>
      </Button>
    </div>
  );
}
