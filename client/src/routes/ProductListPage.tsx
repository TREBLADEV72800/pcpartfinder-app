import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  Filter,
  Package,
  ShoppingCart,
} from "lucide-react";
import { useComponents } from "@hooks/useComponents";
import { CATEGORIES } from "@shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// ═════════════════════════════════════════════════════════════
// ProductListPage
// ═════════════════════════════════════════════════════════════
export default function ProductListPage() {
  const { category } = useParams<{ category: string }>();
  const query = useComponents(category as any);
  const components = query.data;
  const loading = query.isPending;

  const [sortBy, setSortBy] = useState<"name" | "price" | "year">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const categoryMeta = category
    ? CATEGORIES[category.toUpperCase() as keyof typeof CATEGORIES]
    : null;
  const categoryName = categoryMeta?.name || "Componenti";

  // Sort and filter components
  const { sortedComponents, availableBrands } = useMemo(() => {
    let items = [...(components || [])];

    // Sort
    items.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "price": {
          const priceA = a.prices?.[0]?.price || 0;
          const priceB = b.prices?.[0]?.price || 0;
          comparison = priceA - priceB;
          break;
        }
        case "year": {
          comparison = (b.releaseYear || 0) - (a.releaseYear || 0);
          break;
        }
        default:
          comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    // Filter
    if (selectedBrands.length > 0) {
      items = items.filter((c) => selectedBrands.includes(c.brand));
    }
    if (maxPrice !== null) {
      items = items.filter((c) => (c.prices?.[0]?.price || 0) <= maxPrice);
    }

    // Extract unique brands
    const brands = Array.from(
      new Set((components || []).map((c) => c.brand))
    ).sort();

    return { sortedComponents: items, availableBrands: brands };
  }, [components, sortBy, sortOrder, selectedBrands, maxPrice]);

  const componentCount = sortedComponents.length;
  const hasActiveFilters = selectedBrands.length > 0 || maxPrice !== null;

  return (
    <div className="w-full min-h-screen">
      {/* ── Header ──────────────────────────────────────────── */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Badge
                variant="secondary"
                className="mb-2 inline-flex w-fit"
              >
                <Package className="mr-1.5 h-3.5 w-3.5" />
                Catalogo
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {categoryName}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {componentCount} component
                {componentCount !== 1 ? "i" : ""} disponibile
                {componentCount !== 1 ? "i" : ""}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordina per" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="price">Prezzo</SelectItem>
                  <SelectItem value="year">Anno</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>

              <Button
                variant={showFilters ? "default" : "outline"}
                size={showFilters ? "default" : "icon"}
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-primary text-primary-foreground" : ""}
              >
                <Filter className="h-4 w-4" />
                {!showFilters && <span className="hidden sm:inline ml-2">Filtri</span>}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters Panel ─────────────────────────────────────── */}
      {showFilters && (
        <section className="border-b border-border bg-muted/20">
          <div className="container px-4 py-6">
            <FilterPanel
              availableBrands={availableBrands}
              selectedBrands={selectedBrands}
              onBrandChange={setSelectedBrands}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              hasActiveFilters={hasActiveFilters}
              onClear={() => {
                setSelectedBrands([]);
                setMaxPrice(null);
              }}
            />
          </div>
        </section>
      )}

      {/* ── Products Grid ──────────────────────────────────────── */}
      <section className="py-12">
        <div className="container px-4">
          {loading ? (
            <LoadingState />
          ) : sortedComponents.length === 0 ? (
            <EmptyState hasFilters={hasActiveFilters} category={categoryName} />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedComponents.map((component) => (
                <ProductCard key={component.id} component={component} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Sub-components
// ═════════════════════════════════════════════════════════════

interface ProductCardProps {
  component: {
    id: string;
    name: string;
    brand: string;
    specs: Record<string, unknown>;
    prices?: Array<{
      price: number;
      retailer: string;
      url: string;
      currency: string;
    }>;
  };
}

function ProductCard({ component }: ProductCardProps) {
  const price = component.prices?.[0];

  // Get key specs
  const keySpecs = Object.entries(component.specs)
    .filter(([key]) =>
      ["socket", "formFactor", "memoryType", "capacityGb", "cores", "tdp"].includes(key)
    )
    .slice(0, 3);

  return (
    <Card className="group h-full overflow-hidden border-border transition-all duration-200 hover:border-primary/40 hover:shadow-lg">
      <CardContent className="flex h-full flex-col p-5">
        {/* Image placeholder */}
        <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-lg mb-4 flex items-center justify-center">
          <Package className="h-10 w-10 text-muted-foreground/50" />
        </div>

        {/* Brand */}
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {component.brand}
          </Badge>
        </div>

        {/* Name */}
        <h3 className="font-semibold mb-3 line-clamp-2 flex-1 min-h-[2.5rem]">
          {component.name}
        </h3>

        {/* Specs preview */}
        {keySpecs.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {keySpecs.map(([key, value]) => (
              <Badge
                key={key}
                variant="secondary"
                className="text-xs"
              >
                {value === true || value === false
                  ? key
                  : String(value ?? "")}
              </Badge>
            ))}
          </div>
        )}

        {/* Separator */}
        <div className="my-4" />

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex-1">
            {price ? (
              <>
                <span className="text-xl font-bold text-primary">
                  {price.currency === "EUR"
                    ? `€${(price.price).toFixed(2)}`
                    : price.price}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {price.retailer}
                </p>
              </>
            ) : (
              <span className="text-muted-foreground">Prezzo N/A</span>
            )}
          </div>

          {price && price.url && (
            <Button
              asChild
              size="sm"
              className="shrink-0"
            >
              <a
                href={price.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface FilterPanelProps {
  availableBrands: string[];
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  maxPrice: number | null;
  onMaxPriceChange: (price: number | null) => void;
  hasActiveFilters: boolean;
  onClear: () => void;
}

function FilterPanel({
  availableBrands,
  selectedBrands,
  onBrandChange,
  maxPrice,
  onMaxPriceChange,
  hasActiveFilters,
  onClear,
}: FilterPanelProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Brand Filter */}
      <div>
        <Label className="mb-3 text-sm font-medium">Brand</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {availableBrands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onBrandChange([...selectedBrands, brand]);
                  } else {
                    onBrandChange(selectedBrands.filter((b) => b !== brand));
                  }
                }}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm cursor-pointer flex-1"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="mb-3 text-sm font-medium">Prezzo Massimo</Label>
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="€"
            value={maxPrice ?? ""}
            onChange={(e) =>
              onMaxPriceChange(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full"
          />
          {maxPrice && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => onMaxPriceChange(null)}
            >
              Cancella
            </Button>
          )}
        </div>
      </div>

      {/* Clear Filters */}
      <div className="flex items-end">
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="w-full"
          >
            Cancella filtri
          </Button>
        )}
      </div>
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
      <p className="mt-4 text-muted-foreground">Caricamento prodotti...</p>
    </div>
  );
}

interface EmptyStateProps {
  hasFilters: boolean;
  category: string;
}

function EmptyState({ hasFilters, category }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Package className="h-10 w-10 text-primary" />
      </div>

      {hasFilters ? (
        <>
          <h3 className="text-lg font-semibold mb-2">
            Nessun prodotto trovato
          </h3>
          <p className="text-muted-foreground mb-6">
            Prova a modificare i filtri applicati
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-2">
            Nessun prodotto in {category}
          </h3>
          <p className="text-muted-foreground mb-6">
            Prova con un'altra categoria o torna più tardi
          </p>
        </>
      )}
    </div>
  );
}
