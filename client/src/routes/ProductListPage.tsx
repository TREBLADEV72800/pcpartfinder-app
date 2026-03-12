import { useParams } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  ArrowUpDown,
  Euro,
  Filter,
  Package,
  ShoppingCart,
  SlidersHorizontal,
  Search,
  X,
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
   PRODUCT LIST PAGE
   ═════════════════════════════════════════════════════════════ */
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
  const [searchQuery, setSearchQuery] = useState("");

  const categoryMeta = category
    ? CATEGORIES[category.toUpperCase() as keyof typeof CATEGORIES]
    : null;
  const categoryName = categoryMeta?.name || "Componenti";

  // Sort and filter components
  const { sortedComponents, availableBrands } = useMemo(() => {
    let items = [...(components || [])];

    // Search filter
    if (searchQuery) {
      items = items.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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
  }, [components, sortBy, sortOrder, selectedBrands, maxPrice, searchQuery]);

  const componentCount = sortedComponents.length;
  const hasActiveFilters = selectedBrands.length > 0 || maxPrice !== null || searchQuery !== "";

  return (
    <div className="w-full overflow-x-hidden">
      {/* ── Hero ──────────────────────────────────────────── */}
      <ListHero
        categoryName={categoryName}
        componentCount={componentCount}
        hasActiveFilters={hasActiveFilters}
      />

      {/* ── Filters Bar ────────────────────────────────────── */}
      <section className="border-b border-border bg-muted/30 sticky top-16 z-40">
        <div className="container px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cerca componenti..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
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
                className="h-11 w-11"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>

              <Button
                variant={showFilters ? "default" : "outline"}
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className="h-11 w-11"
              >
                <Filter className="h-4 w-4" />
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
                setSearchQuery("");
              }}
            />
          </div>
        </section>
      )}

      {/* ── Products Grid ─────────────────────────────────────── */}
      <section className="py-12">
        <div className="container px-4">
          {loading ? (
            <LoadingState />
          ) : sortedComponents.length === 0 ? (
            <EmptyState hasFilters={hasActiveFilters} category={categoryName} />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedComponents.map((component, index) => (
                <ProductCard key={component.id} component={component} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   Sub-components
   ═════════════════════════════════════════════════════════════ */

function ListHero({
  categoryName,
  componentCount,
  hasActiveFilters,
}: {
  categoryName: string;
  componentCount: number;
  hasActiveFilters: boolean;
}) {
  const { ref, inView } = useInView(0.1);

  return (
    <section ref={ref} className="relative min-h-[50vh] flex items-center justify-center overflow-hidden border-b border-border">
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
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── Content ── */}
      <div className="container relative z-10 px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div
            className="transition-all duration-700"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <Badge
              variant="secondary"
              className="mb-4 inline-flex gap-2"
            >
              <Package className="h-3.5 w-3.5" />
              Catalogo
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              {categoryName}
            </h1>

            <p className="mt-2 text-xl text-muted-foreground">
              {componentCount} componente{componentCount !== 1 ? "i" : ""} disponibile{componentCount !== 1 ? "i" : ""}
            </p>
          </div>

          {/* Filters indicator */}
          {hasActiveFilters && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary animate-[fadeIn_0.5s_ease-out]"
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtri attivi</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

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
  index: number;
}

function ProductCard({ component, index }: ProductCardProps) {
  const { ref, inView } = useInView(0.05);
  const price = component.prices?.[0];

  // Get key specs
  const keySpecs = Object.entries(component.specs)
    .filter(([key]) =>
      ["socket", "formFactor", "memoryType", "capacityGb", "cores", "tdp"].includes(key)
    )
    .slice(0, 3);

  return (
    <div
      ref={ref}
      className="group"
    >
      <Card className="h-full overflow-hidden border-border/60 bg-card transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(30px)",
          transitionDelay: `${index * 50}ms`,
        }}
      >
        {/* Top gradient line on hover */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary via-blue-400 to-cyan-400 opacity-0 transition-opacity group-hover:opacity-100" />

        <CardContent className="flex h-full flex-col p-5">
          {/* Image placeholder */}
          <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-xl mb-4 flex items-center justify-center group-hover:from-primary/10 group-hover:to-muted/50 transition-colors">
            <Package className="h-10 w-10 text-muted-foreground/50 group-hover:text-primary/30 transition-colors" />
          </div>

          {/* Brand */}
          <div className="mb-3">
            <Badge variant="outline" className="text-xs">
              {component.brand}
            </Badge>
          </div>

          {/* Name */}
          <h3 className="font-semibold mb-3 line-clamp-2 flex-1 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {component.name}
          </h3>

          {/* Specs preview */}
          {keySpecs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
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

          <div className="my-4" />

          {/* Price & Action */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex-1">
              {price ? (
                <>
                  <span className="text-2xl font-bold text-primary">
                    {price.currency === "EUR"
                      ? `€${(price.price).toFixed(2)}`
                      : price.price}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
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
        <Label className="mb-3 text-sm font-medium flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Brand
        </Label>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
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
        <Label className="mb-3 text-sm font-medium flex items-center gap-2">
          <Euro className="h-4 w-4" />
          Prezzo Massimo
        </Label>
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
    <div className="flex flex-col items-center justify-center py-32">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
      </div>
      <p className="text-lg text-muted-foreground">Caricamento prodotti...</p>
    </div>
  );
}

interface EmptyStateProps {
  hasFilters: boolean;
  category: string;
}

function EmptyState({ hasFilters, category }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Package className="h-12 w-12 text-primary" />
      </div>

      {hasFilters ? (
        <>
          <h2 className="text-2xl font-bold mb-3">
            Nessun prodotto trovato
          </h2>
          <p className="text-muted-foreground mb-8">
            Prova a modificare i filtri applicati
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-3">
            Nessun prodotto in {category}
          </h2>
          <p className="text-muted-foreground mb-8">
            Prova con un'altra categoria o torna più tardi
          </p>
        </>
      )}
    </div>
  );
}
