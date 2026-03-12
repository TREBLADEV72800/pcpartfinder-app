import { useState } from "react";
import { formatPrice } from "@lib/utils";
import { useComponents } from "@hooks/useComponents";
import { X, Plus, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ═════════════════════════════════════════════════════════════
// ComparePage
// ═════════════════════════════════════════════════════════════
export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: allComponents } = useComponents(undefined);
  const components = allComponents?.filter((c) => selectedIds.includes(c.id)) || [];

  const handleAdd = () => {
    // Simple prompt for demo
    const id = prompt("Inserisci l'ID del componente da confrontare:");
    if (id && selectedIds.length < 4 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemove = (id: string) => {
    setSelectedIds(selectedIds.filter((i) => i !== id));
  };

  const canAddMore = selectedIds.length < 4;

  return (
    <div className="w-full min-h-screen">
      {/* ── Header ──────────────────────────────────────────── */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Badge
                variant="secondary"
                className="mb-2 inline-flex"
              >
                <Scale className="mr-1.5 h-3.5 w-3.5" />
                Confronto
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Confronta{" "}
                <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  Componenti
                </span>
              </h1>
              <p className="mt-2 text-muted-foreground">
                Confronta fino a 4 componenti affiancati per trovare quello perfetto
              </p>
            </div>

            <Button
              onClick={handleAdd}
              disabled={!canAddMore}
              size="lg"
              className="shrink-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              {canAddMore ? "Aggiungi Componente" : "Massimo 4 componenti"}
            </Button>
          </div>
        </div>
      </section>

      {/* ── Comparison Grid ─────────────────────────────────── */}
      <section className="py-12">
        <div className="container px-4">
          {components.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {components.map((component) => (
                  <ComparisonCard
                    key={component.id}
                    component={component}
                    onRemove={() => handleRemove(component.id)}
                  />
                ))}
              </div>

              {/* Specs Comparison Table */}
              {components.length >= 2 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6">
                      Confronto Specifiche
                    </h2>
                    <SpecsTable components={components} />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Sub-components
// ═════════════════════════════════════════════════════════════

interface ComparisonCardProps {
  component: {
    id: string;
    name: string;
    brand: string;
    specs: Record<string, unknown>;
    prices?: Array<{ price: number; retailer: string }>;
  };
  onRemove: () => void;
}

function ComparisonCard({ component, onRemove }: ComparisonCardProps) {
  const specs = component.specs;
  const price = component.prices?.[0];

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">{component.brand}</p>
          <h3 className="font-semibold line-clamp-2">{component.name}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Specs */}
      <CardContent className="p-4">
        <div className="space-y-2 text-sm">
          {Object.entries(specs)
            .slice(0, 6)
            .map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground capitalize">
                  {key.replace(/_/g, " ")}:
                </span>
                <span className="font-medium truncate ml-2">{String(value)}</span>
              </div>
            ))}
        </div>
      </CardContent>

      {/* Price */}
      <div className="p-4 border-t border-border bg-muted/30">
        {price ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-primary">
                {formatPrice(price.price)}
              </span>
              <p className="text-xs text-muted-foreground">{price.retailer}</p>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">Prezzo N/A</span>
        )}
      </div>
    </Card>
  );
}

interface SpecsTableProps {
  components: Array<{ id: string; specs: Record<string, unknown>; name: string; brand: string }>;
}

function SpecsTable({ components }: SpecsTableProps) {
  // Get all unique spec keys across all components
  const allKeys = Array.from(
    new Set(
      components.flatMap((c) => Object.keys(c.specs))
    )
  ).slice(0, 12); // Limit to 12 specs

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Specifiche</th>
            {components.map((c) => (
              <th key={c.id} className="px-4 py-3 text-left font-semibold min-w-[150px]">
                {c.brand}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allKeys.map((key, idx) => (
            <tr
              key={key}
              className={idx % 2 === 0 ? "bg-background" : "bg-muted/20"}
            >
              <td className="px-4 py-3 text-muted-foreground capitalize font-medium">
                {key.replace(/_/g, " ")}
              </td>
              {components.map((c) => (
                <td
                  key={c.id}
                  className="px-4 py-3"
                >
                  {String(c.specs[key] || "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Scale className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">
        Nessun componente selezionato
      </h2>
      <p className="text-muted-foreground mb-6">
        Aggiungi componenti per confrontarli affiancati
      </p>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Aggiungi Componente
      </Button>
    </div>
  );
}
