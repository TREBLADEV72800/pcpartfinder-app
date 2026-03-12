import { useParams, Link } from "react-router-dom";
import { useState } from "react";
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
} from "lucide-react";
import { useComponent, usePriceHistory } from "@hooks/useComponents";
import { formatPrice } from "@lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ═════════════════════════════════════════════════════════════
// ProductDetailPage
// ═════════════════════════════════════════════════════════════
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
        <section className="py-20">
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
        <section className="py-20">
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
    <div className="w-full min-h-screen">
      {/* ── Header ──────────────────────────────────────────── */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container px-4">
          {/* Back Button */}
          <Link
            to={`/products/${component.category.toLowerCase()}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna a {categoryLabel}
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Badge
                variant="secondary"
                className="mb-4 inline-flex"
              >
                <Package className="mr-1.5 h-3.5 w-3.5" />
                {categoryLabel}
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                {component.name}
              </h1>

              <p className="text-xl text-muted-foreground mb-6">
                {component.brand}
              </p>

              {/* Key Specs */}
              <div className="flex flex-wrap gap-2">
                {component.socket && (
                  <Badge variant="outline">{component.socket}</Badge>
                )}
                {component.tdp && (
                  <Badge variant="outline">{component.tdp}W TDP</Badge>
                )}
                {component.releaseYear && (
                  <Badge variant="outline">{component.releaseYear}</Badge>
                )}
              </div>
            </div>

            {/* Price Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {price ? (
                    <>
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">
                          Prezzo più basso
                        </p>
                        <p className="text-4xl font-bold text-primary">
                          {formatPrice(price.price)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          da {price.retailer}
                        </p>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-3">
                        <Button
                          asChild
                          className="w-full"
                          size="lg"
                        >
                          <a
                            href={price.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Acquista ora
                          </a>
                        </Button>

                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4 mr-2" />
                            Salva
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Condividi
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nessun prezzo disponibile
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs Content ─────────────────────────────────────── */}
      <section className="py-12">
        <div className="container px-4">
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Panoramica</TabsTrigger>
              <TabsTrigger value="specs">Specifiche</TabsTrigger>
              <TabsTrigger value="reviews">Recensioni</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="lg:col-span-2">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Descrizione
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {component.name} è un componente {categoryLabel} di alta qualità
                        prodotto da {component.brand}
                        {component.releaseYear && ` nel ${component.releaseYear}`}
                        {component.tdp && ` con un TDP di ${component.tdp}W`}.
                        {component.socket && ` Compatibile con socket ${component.socket}.`}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Price History */}
                  {priceHistory && priceHistory.length > 0 && (
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">
                          Storico Prezzi
                        </h2>
                        <PriceHistoryChart history={priceHistory} />
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Informazioni
                      </h3>
                      <div className="space-y-4">
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
                      </div>
                    </CardContent>
                  </Card>

                  {/* All Prices */}
                  {component.prices && component.prices.length > 1 && (
                    <Card className="mt-6">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Tutti i Prezzi</h3>
                        <div className="space-y-3">
                          {component.prices.map((p, i) => (
                            <a
                              key={i}
                              href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-accent/50 transition-all"
                            >
                              <div>
                                <p className="font-medium">{p.retailer}</p>
                                <p className="text-sm text-muted-foreground">
                                  {p.inStock ? "Disponibile" : "Esaurito"}
                                </p>
                              </div>
                              <span className="font-semibold text-primary">
                                {formatPrice(p.price)}
                              </span>
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Specs Tab */}
            <TabsContent value="specs">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    Specifiche Tecniche
                  </h2>
                  <SpecsGrid specs={specs} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    Recensioni
                  </h2>
                  <ReviewsPlaceholder />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Sub-components
// ═════════════════════════════════════════════════════════════

interface StatRowProps {
  label: string;
  value: string;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
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
    <div className="space-y-4">
      {/* Price change indicator */}
      <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/30">
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
      <div className="h-40 relative">
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
          className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
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
    <div className="text-center py-12">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Info className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
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
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
      </div>
      <p className="mt-4 text-muted-foreground">Caricamento componente...</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Package className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">
        Componente non trovato
      </h2>
      <p className="text-muted-foreground mb-6">
        Il componente che stai cercando non esiste o è stato rimosso
      </p>
      <Button asChild>
        <Link to="/products/CPU">
          Torna al catalogo
        </Link>
      </Button>
    </div>
  );
}
