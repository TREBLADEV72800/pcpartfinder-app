import { useParams } from "react-router-dom";
import { useComponent, usePriceHistory } from "@hooks/useComponents";
import { formatPrice } from "@lib/utils";
import { ArrowLeft, ExternalLink, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const query = useComponent(id || "");
  const component = query.data;
  const loading = query.isPending;
  const { data: priceHistory } = usePriceHistory(id || "");

  if (loading) {
    return (
      <div className="container px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!component) {
    return (
      <div className="container px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Componente non trovato</h1>
        <Link to="/products/CPU" className="text-primary hover:underline">
          Torna alla lista componenti
        </Link>
      </div>
    );
  }

  const specs = component.specs as Record<string, unknown>;

  return (
    <div className="container px-4 py-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <Link
        to={`/products/${component.category.toLowerCase()}`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Torna a {component.category.replace("_", " ")}
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <p className="text-sm text-muted-foreground">{component.brand}</p>
            <h1 className="text-3xl font-bold mb-2">{component.name}</h1>
            {component.releaseYear && (
              <span className="text-sm px-2 py-1 bg-muted rounded">
                {component.releaseYear}
              </span>
            )}
          </div>

          {/* Specs */}
          <div className="border border-border rounded-lg bg-card">
            <h2 className="text-lg font-semibold p-4 border-b border-border">Specifiche</h2>
            <div className="p-4 grid grid-cols-2 gap-4">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, " ")}:
                  </span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price History */}
          {priceHistory && priceHistory.length > 0 && (
            <div className="border border-border rounded-lg bg-card">
              <h2 className="text-lg font-semibold p-4 border-b border-border">
                Storico Prezzi
              </h2>
              <div className="p-4">
                <PriceHistoryChart history={priceHistory} />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Pricing */}
        <div className="space-y-4">
          {/* Price Card */}
          <div className="border border-border rounded-lg bg-card p-4">
            <h2 className="font-semibold mb-4">Prezzi</h2>

            {component.prices && component.prices.length > 0 ? (
              <div className="space-y-3">
                {component.prices.map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{formatPrice(p.price)}</span>
                      <p className="text-xs text-muted-foreground">{p.retailer}</p>
                    </div>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg flex items-center gap-1 text-sm ${
                        p.inStock
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      {p.inStock ? (
                        <>
                          Acquista
                          <ExternalLink className="h-3 w-3" />
                        </>
                      ) : (
                        "Esaurito"
                      )}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Nessun prezzo disponibile</p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="border border-border rounded-lg bg-card p-4">
            <h2 className="font-semibold mb-4">Statistiche</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categoria:</span>
                <span>{component.category.replace("_", " ")}</span>
              </div>
              {component.socket && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Socket:</span>
                  <span>{component.socket}</span>
                </div>
              )}
              {component.tdp && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TDP:</span>
                  <span>{component.tdp}W</span>
                </div>
              )}
              {component.releaseYear && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Anno:</span>
                  <span>{component.releaseYear}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PriceHistoryChartProps {
  history: Array<{ price: number; recordedAt: string }>;
}

function PriceHistoryChart({ history }: PriceHistoryChartProps) {
  if (history.length < 2) {
    return <p className="text-muted-foreground text-sm">Dati insufficienti per il grafico</p>;
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
      <div className="flex items-center gap-2">
        {priceChange > 0 ? (
          <>
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-green-500">+{formatPrice(Math.abs(priceChange))} (+{priceChangePercent}%)</span>
          </>
        ) : priceChange < 0 ? (
          <>
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span className="text-red-500">-{formatPrice(Math.abs(priceChange))} ({priceChangePercent}%)</span>
          </>
        ) : (
          <>
            <Minus className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Nessun cambio</span>
          </>
        )}
      </div>

      {/* Simple line chart */}
      <div className="h-32 relative">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
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
