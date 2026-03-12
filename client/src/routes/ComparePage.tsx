import { useState, useRef, useEffect } from "react";
import { formatPrice } from "@lib/utils";
import { useComponents } from "@hooks/useComponents";
import { X, Plus, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
   COMPARE PAGE
   ═════════════════════════════════════════════════════════════ */
export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allComponents } = useComponents(undefined);
  const components = allComponents?.filter((c) => selectedIds.includes(c.id)) || [];

  const availableComponents = allComponents?.filter(
    (c) => !selectedIds.includes(c.id) && (!searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const handleAdd = (id: string) => {
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
      setDialogOpen(false);
      setSearchQuery("");
    }
  };

  const handleRemove = (id: string) => {
    setSelectedIds(selectedIds.filter((i) => i !== id));
  };

  const canAddMore = selectedIds.length < 4;

  return (
    <div className="w-full overflow-x-hidden">
      {/* ── Hero ──────────────────────────────────────────── */}
      <CompareHero canAddMore={canAddMore} onOpenDialog={() => setDialogOpen(true)} selectedCount={selectedIds.length} />

      {/* ── Comparison Grid ─────────────────────────────────── */}
      <section className="py-12">
        <div className="container px-4">
          {components.length === 0 ? (
            <EmptyState onOpenDialog={() => setDialogOpen(true)} />
          ) : (
            <>
              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {components.map((component, index) => (
                  <ComparisonCard
                    key={component.id}
                    component={component}
                    onRemove={() => handleRemove(component.id)}
                    index={index}
                  />
                ))}
              </div>

              {/* Specs Comparison Table */}
              {components.length >= 2 && (
                <Card className="overflow-hidden border-border/60 bg-card">
                  <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Scale className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-semibold">Confronto Specifiche</h2>
                  </div>
                  <CardContent className="p-6">
                    <SpecsTable components={components} />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Add Component Dialog ──────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Aggiungi Componente</DialogTitle>
            <DialogDescription>
              Seleziona un componente da confrontare (massimo 4)
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <Input
              placeholder="Cerca componente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            <div className="space-y-2">
              {availableComponents.slice(0, 20).map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleAdd(c.id)}
                  className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-accent/50 transition-all flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground">{c.brand}</p>
                    <p className="font-medium truncate">{c.name}</p>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                </button>
              ))}
              {availableComponents.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nessun componente trovato
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Sub-components                                                 */
/* ───────────────────────────────────────────────────────────── */

function CompareHero({
  canAddMore,
  onOpenDialog,
  selectedCount,
}: {
  canAddMore: boolean;
  onOpenDialog: () => void;
  selectedCount: number;
}) {
  const { ref } = useInView(0.1);

  return (
    <section ref={ref} className="relative min-h-[65vh] flex items-center justify-center overflow-hidden border-b border-border">
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

      {/* ── Floating orbs ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-16 left-[10%] h-56 w-56 rounded-full bg-blue-500/8 blur-[80px] animate-[float_8s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-16 right-[10%] h-72 w-72 rounded-full bg-violet-500/8 blur-[100px] animate-[float_10s_ease-in-out_infinite_reverse]"
      />

      {/* ── Content ── */}
      <div className="container relative z-10 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-[fadeInDown_0.6s_ease-out]">
            <Badge
              variant="outline"
              className="gap-2 px-4 py-2 text-sm font-medium border-primary/30 bg-primary/5 backdrop-blur-sm"
            >
              <Scale className="mr-1.5 h-3.5 w-3.5" />
              Confronto
            </Badge>
          </div>

          {/* Heading */}
          <h1 className="animate-[fadeInUp_0.8s_ease-out] text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Confronta{" "}
            <span
              className="bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-[gradientShift_6s_ease-in-out_infinite]"
              style={{ backgroundSize: "200% auto" }}
            >
              Componenti
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
            Confronta fino a 4 componenti affiancati per trovare quello perfetto.
            Analizza specifiche, prezzi e molto altro.
          </p>

          {/* Counter */}
          <div className="mx-auto mt-10 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-primary">{selectedCount}</p>
                <p className="text-xs text-muted-foreground">Selezionati</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-extrabold text-muted-foreground">4</p>
                <p className="text-xs text-muted-foreground">Massimo</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-10 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
            <Button
              onClick={onOpenDialog}
              disabled={!canAddMore}
              size="lg"
              className="h-14 px-8 text-base"
            >
              <Plus className="h-5 w-5 mr-2" />
              {canAddMore ? "Aggiungi Componente" : "Massimo 4 componenti"}
            </Button>
          </div>
        </div>
      </div>
    </section>
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
  index: number;
}

function ComparisonCard({ component, onRemove, index }: ComparisonCardProps) {
  const { ref, inView } = useInView(0.05);
  const specs = component.specs;
  const price = component.prices?.[0];

  return (
    <div
      ref={ref}
      className="group"
    >
      <Card className="h-full overflow-hidden border-border/60 bg-card transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(30px)",
          transitionDelay: `${index * 100}ms`,
        }}
      >
        {/* Top gradient line on hover */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary via-blue-400 to-cyan-400 opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Header */}
        <div className="p-5 border-b border-border bg-muted/30 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Badge variant="outline" className="text-xs mb-2">
              {component.brand}
            </Badge>
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {component.name}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Specs */}
        <CardContent className="p-5 flex-1">
          <div className="space-y-3 text-sm">
            {Object.entries(specs)
              .slice(0, 6)
              .map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-muted-foreground capitalize text-xs">
                    {key.replace(/_/g, " ")}:
                  </span>
                  <span className="font-medium truncate ml-2">{String(value)}</span>
                </div>
              ))}
          </div>
        </CardContent>

        {/* Price */}
        <div className="p-5 border-t border-border bg-muted/30">
          {price ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(price.price)}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{price.retailer}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">€</span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">Prezzo N/A</span>
          )}
        </div>
      </Card>
    </div>
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

function EmptyState({ onOpenDialog }: { onOpenDialog: () => void }) {
  const { ref, inView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center py-32"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.6s ease-out",
      }}
    >
      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/10 flex items-center justify-center mb-6 animate-[float_6s_ease-in-out_infinite]">
        <Scale className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-3">
        Nessun componente selezionato
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md text-center">
        Aggiungi componenti per confrontarli affiancati e trova quello perfetto per le tue esigenze
      </p>
      <Button size="lg" onClick={onOpenDialog} className="h-12 px-6">
        <Plus className="h-5 w-5 mr-2" />
        Aggiungi Componente
      </Button>
    </div>
  );
}
