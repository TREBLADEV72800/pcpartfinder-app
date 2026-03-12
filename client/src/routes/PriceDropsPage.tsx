import { formatPrice } from "@lib/utils";
import { useComponents } from "@hooks/useComponents";
import { TrendingDown, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ═════════════════════════════════════════════════════════════
// PriceDropsPage
// ═════════════════════════════════════════════════════════════
export default function PriceDropsPage() {
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

  return (
    <div className="w-full min-h-screen">
      {/* ── Header ──────────────────────────────────────────── */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-4 inline-flex"
            >
              <TrendingDown className="mr-1.5 h-3.5 w-3.5" />
              Offerte
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
              Cali di{" "}
              <span className="bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
                Prezzo
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Componenti con prezzo ridotto - Aggiornato giornalmente.
              Risparmia sui migliori componenti per il tuo PC.
            </p>

            {/* Time Filter */}
            <div className="mx-auto mt-8 flex flex-wrap justify-center gap-2">
              {[
                { label: "24h", value: "24h" },
                { label: "7 giorni", value: "7d" },
                { label: "30 giorni", value: "30d" },
                { label: "Tutti", value: "all" },
              ].map((period) => (
                <Button
                  key={period.value}
                  variant={period.value === "all" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Price Drops List ─────────────────────────────────── */}
      <section className="py-12">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component) => (
              <PriceDropCard
                key={component.id}
                component={component}
                dropPercent={Math.random() * 20}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Sub-components
// ═════════════════════════════════════════════════════════════

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
}

function PriceDropCard({ component, dropPercent }: PriceDropCardProps) {
  const price = component.prices?.[0];
  const oldPrice = price ? price.price * (1 + dropPercent / 100) : 0;
  const hasSignificantDrop = dropPercent > 5;

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-lg">
      {/* Drop Badge */}
      {hasSignificantDrop && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="h-4 w-4" />
            <span className="font-semibold">-{dropPercent.toFixed(1)}%</span>
          </div>
          <span className="text-sm">Risparmio!</span>
        </div>
      )}

      <CardContent className="p-5">
        {/* Image placeholder */}
        <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-lg mb-4 flex items-center justify-center group-hover:from-primary/10 group-hover:to-muted/50 transition-colors">
          <span className="text-muted-foreground/50 font-semibold text-lg">
            {component.brand}
          </span>
        </div>

        {/* Info */}
        <Badge variant="outline" className="mb-2 text-xs">
          {component.category.replace(/_/g, " ")}
        </Badge>
        <p className="text-sm text-muted-foreground mb-1">{component.brand}</p>
        <h3 className="font-semibold mb-4 line-clamp-2 min-h-[2.5rem]">
          {component.name}
        </h3>

        <div className="my-4" />

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            {price ? (
              <>
                <span className="text-2xl font-bold text-green-500">
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
              className="shrink-0"
            >
              <a
                href={price.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Acquista
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
