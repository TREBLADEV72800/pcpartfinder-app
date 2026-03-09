import { useState } from "react";
import { formatPrice } from "@lib/utils";
import { useComponents } from "@hooks/useComponents";
import { X } from "lucide-react";

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

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Confronta Componenti</h1>
        <p className="text-muted-foreground">
          Confronta fino a 4 componenti affiancati
        </p>
      </div>

      {/* Add Component */}
      {selectedIds.length < 4 && (
        <button
          onClick={handleAdd}
          className="mb-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Aggiungi Componente
        </button>
      )}

      {/* Comparison Grid */}
      {components.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-lg">
          <p>Nessun componente selezionato</p>
          <p className="text-sm mt-2">Aggiungi componenti per confrontarli</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {components.map((component) => (
            <ComparisonCard
              key={component.id}
              component={component}
              onRemove={() => handleRemove(component.id)}
            />
          ))}
        </div>
      )}

      {/* Specs Comparison Table */}
      {components.length >= 2 && (
        <div className="mt-8 border border-border rounded-lg overflow-hidden">
          <SpecsTable components={components} />
        </div>
      )}
    </div>
  );
}

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
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30 flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{component.brand}</p>
          <h3 className="font-semibold line-clamp-2">{component.name}</h3>
        </div>
        <button
          onClick={onRemove}
          className="p-1 hover:bg-accent rounded-md transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Specs */}
      <div className="p-4 space-y-2 text-sm">
        {Object.entries(specs)
          .slice(0, 6)
          .map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-muted-foreground capitalize">
                {key.replace(/_/g, " ")}:
              </span>
              <span className="font-medium">{String(value)}</span>
            </div>
          ))}
      </div>

      {/* Price */}
      <div className="p-4 border-t border-border bg-muted/30">
        {price ? (
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {formatPrice(price.price)}
            </span>
            <span className="text-xs text-muted-foreground">{price.retailer}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">Prezzo N/A</span>
        )}
      </div>
    </div>
  );
}

interface SpecsTableProps {
  components: Array<{ id: string; specs: Record<string, unknown> }>;
}

function SpecsTable({ components }: SpecsTableProps) {
  // Get all unique spec keys across all components
  const allKeys = Array.from(
    new Set(
      components.flatMap((c) => Object.keys(c.specs))
    )
  ).slice(0, 10); // Limit to 10 specs

  return (
    <table className="w-full">
      <thead className="bg-muted">
        <tr>
          <th className="px-4 py-3 text-left font-semibold">Specifiche</th>
          {components.map((c, idx) => (
            <th key={c.id || idx} className="px-4 py-3 text-left font-semibold">
              {String(c.specs.brand || "")} {String(c.specs.model || "")}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {allKeys.map((key) => (
          <tr key={key} className="border-t border-border">
            <td className="px-4 py-3 text-muted-foreground capitalize">
              {key.replace(/_/g, " ")}
            </td>
            {components.map((c, idx) => (
              <td key={c.id || idx} className="px-4 py-3">
                {String(c.specs[key] || "—")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
