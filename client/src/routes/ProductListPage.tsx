import { useParams } from "react-router-dom";
import { useState } from "react";
import { useComponents } from "@hooks/useComponents";
import { CATEGORIES } from "@shared";
import { formatPrice } from "@lib/utils";
import { SlidersHorizontal } from "lucide-react";

export default function ProductListPage() {
  const { category } = useParams<{ category: string }>();
  const query = useComponents(category as any);
  const components = query.data;
  const loading = query.isPending;

  const [sortBy, setSortBy] = useState<"name" | "price" | "year">("name");
  const [showFilters, setShowFilters] = useState(false);

  const categoryMeta = category ? CATEGORIES[category.toUpperCase() as keyof typeof CATEGORIES] : null;
  const categoryName = categoryMeta?.name || "Componenti";

  // Sort components
  const sortedComponents = [...(components || [])].sort((a, b) => {
    switch (sortBy) {
      case "price":
        const priceA = a.prices?.[0]?.price || 0;
        const priceB = b.prices?.[0]?.price || 0;
        return priceA - priceB;
      case "year":
        return (b.releaseYear || 0) - (a.releaseYear || 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
        <p className="text-muted-foreground">
          {components?.length || 0} component{((components?.length || 0) !== 1) ? "i" : ""} disponibili
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtri
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-border rounded-lg bg-background"
          >
            <option value="name">Nome A-Z</option>
            <option value="price">Prezzo</option>
            <option value="year">Anno</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 border border-border rounded-lg bg-card">
          <FiltersPanel />
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedComponents.map((component) => (
            <ProductCard key={component.id} component={component} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  component: {
    id: string;
    name: string;
    brand: string;
    specs: Record<string, unknown>;
    prices?: Array<{ price: number; retailer: string; url: string }>;
  };
}

function ProductCard({ component }: ProductCardProps) {
  const price = component.prices?.[0];

  return (
    <div className="border border-border rounded-lg bg-card hover:shadow-lg transition-shadow">
      <div className="p-4">
        {/* Image placeholder */}
        <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
          <span className="text-muted-foreground">{component.brand}</span>
        </div>

        {/* Info */}
        <p className="text-sm text-muted-foreground mb-1">{component.brand}</p>
        <h3 className="font-semibold mb-2 line-clamp-2">{component.name}</h3>

        {/* Specs preview */}
        <div className="flex flex-wrap gap-1 mb-3">
          {Object.entries(component.specs)
            .filter(([key]) => ["socket", "formFactor", "memoryType", "capacity_gb", "tdp"].includes(key))
            .slice(0, 3)
            .map(([key, value]) => (
              <span key={key} className="text-xs px-2 py-1 bg-muted rounded">
                {String(value ?? "")}
              </span>
            ))}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          {price ? (
            <div>
              <span className="text-lg font-bold text-primary">
                {formatPrice(price.price)}
              </span>
              <p className="text-xs text-muted-foreground">{price.retailer}</p>
            </div>
          ) : (
            <span className="text-muted-foreground">Prezzo N/A</span>
          )}

          {price && (
            <a
              href={price.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Acquista
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function FiltersPanel() {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Brand Filter */}
      <div>
        <h4 className="font-medium mb-2">Brand</h4>
        <div className="space-y-1">
          {["AMD", "Intel", "NVIDIA", "ASUS", "MSI", "Corsair"].map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded" />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-2">Prezzo</h4>
        <div className="space-y-2">
          <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-border rounded" />
          <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-border rounded" />
        </div>
      </div>

      {/* Specs Filter */}
      <div>
        <h4 className="font-medium mb-2">Specifiche</h4>
        <select className="w-full px-3 py-2 border border-border rounded bg-background">
          <option>Tutti</option>
        </select>
      </div>

      {/* Year Filter */}
      <div>
        <h4 className="font-medium mb-2">Anno</h4>
        <div className="space-y-1">
          {["2024+", "2023+", "2022+", "Tutti"].map((year) => (
            <label key={year} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="year"
                defaultChecked={year === "Tutti"}
                className="rounded"
              />
              {year}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
