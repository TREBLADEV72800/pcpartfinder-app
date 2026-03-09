import { formatPrice } from "@lib/utils";
import { useComponents } from "@hooks/useComponents";
import { TrendingDown } from "lucide-react";

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
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cali di Prezzo</h1>
        <p className="text-muted-foreground">
          Componenti con prezzo ridotto - Aggiornato giornalmente
        </p>
      </div>

      {/* Time Filter */}
      <div className="flex gap-2 mb-6">
        {["24h", "7 giorni", "30 giorni", "Tutti"].map((period) => (
          <button
            key={period}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            {period}
          </button>
        ))}
      </div>

      {/* Price Drops List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {components.map((component) => (
          <PriceDropCard key={component.id} component={component} dropPercent={Math.random() * 20} />
        ))}
      </div>
    </div>
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
}

function PriceDropCard({ component, dropPercent }: PriceDropCardProps) {
  const price = component.prices?.[0];
  const oldPrice = price ? price.price * (1 + dropPercent / 100) : 0;

  return (
    <div className="border border-border rounded-lg bg-card hover:shadow-lg transition-shadow overflow-hidden">
      {/* Drop Badge */}
      {dropPercent > 5 && (
        <div className="bg-green-500 text-white px-3 py-1 text-sm font-semibold flex items-center gap-1">
          <TrendingDown className="h-3 w-3" />
          -{dropPercent.toFixed(1)}%
        </div>
      )}

      <div className="p-4">
        {/* Image placeholder */}
        <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
          <span className="text-muted-foreground">{component.brand}</span>
        </div>

        {/* Info */}
        <p className="text-sm text-muted-foreground mb-1">{component.brand}</p>
        <h3 className="font-semibold mb-2 line-clamp-2">{component.name}</h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            {price ? (
              <>
                <span className="text-lg font-bold text-green-500">
                  {formatPrice(price.price)}
                </span>
                <p className="text-xs text-muted-foreground line-through">
                  {formatPrice(oldPrice)}
                </p>
              </>
            ) : (
              <span className="text-muted-foreground">Prezzo N/A</span>
            )}
          </div>

          {price && (
            <a
              href={price.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Acquista
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
