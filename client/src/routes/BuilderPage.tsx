import { useState, useCallback } from "react";
import { Cpu, Wrench, Zap, Euro, Save, Share2, Download, Trash2 } from "lucide-react";
import { useBuildStore } from "@stores/useBuildStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BuilderTable from "@components/builder/BuilderTable";
import CompatibilityBanner from "@components/builder/CompatibilityBanner";
import BuildActions from "@components/builder/BuildActions";
import ComponentPicker from "@components/builder/ComponentPicker";
import { Component, ComponentCategory } from "@interfaces/component";
import { useComponents } from "@hooks/useComponents";

// ═════════════════════════════════════════════════════════════
// BuilderPage
// ═════════════════════════════════════════════════════════════
export default function BuilderPage() {
  const { setSlot, slots, clearBuild, getTotalPrice, getTotalWattage, name } = useBuildStore();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | null>(null);

  const query = useComponents(selectedCategory || undefined);
  const components = query.data;
  const loading = query.isPending;

  const componentCount = slots.filter((s) => s.component).length;
  const totalWattage = getTotalWattage();
  const totalPrice = getTotalPrice();

  const handleOpenPicker = useCallback((category: ComponentCategory) => {
    setSelectedCategory(category);
    setPickerOpen(true);
  }, []);

  const handleClosePicker = useCallback(() => {
    setPickerOpen(false);
    setSelectedCategory(null);
  }, []);

  const handleSelectComponent = useCallback((component: Component) => {
    if (selectedCategory) {
      setSlot(selectedCategory, component);
      handleClosePicker();
    }
  }, [selectedCategory, setSlot, handleClosePicker]);

  return (
    <div className="w-full min-h-screen">
      {/* ── Header ──────────────────────────────────────────── */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium">
              <Wrench className="mr-1.5 h-3.5 w-3.5" />
              System Builder
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Configura il tuo{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                PC Perfetto
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Configura il tuo PC componente per componente con verifica
              compatibilità in tempo reale.
            </p>

            {/* Quick stats */}
            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-4">
              <StatCard
                icon={<Cpu className="h-5 w-5" />}
                label="Componenti"
                value={`${componentCount}/12`}
              />
              <StatCard
                icon={<Zap className="h-5 w-5" />}
                label="Wattaggio"
                value={`~${totalWattage}W`}
              />
              <StatCard
                icon={<Euro className="h-5 w-5" />}
                label="Prezzo"
                value={`€${totalPrice.toFixed(2)}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ───────────────────────────────────── */}
      <section className="py-12">
        <div className="container px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Builder Table */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border border-border bg-card">
                <div className="border-b border-border px-6 py-4">
                  <h2 className="text-xl font-semibold">Componenti</h2>
                </div>
                <BuilderTable onOpenPicker={handleOpenPicker} />
              </div>

              {/* Compatibility Section */}
              <div className="mt-8 rounded-lg border border-border bg-card">
                <div className="border-b border-border px-6 py-4">
                  <h2 className="text-xl font-semibold">Compatibilità</h2>
                </div>
                <div className="p-6">
                  <CompatibilityBanner />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="sticky top-24 rounded-lg border border-border bg-card">
                <div className="border-b border-border px-6 py-4">
                  <h2 className="text-xl font-semibold">Azioni Build</h2>
                </div>
                <div className="p-6">
                  <BuildActions />
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-border">
                  <ActionButtons
                    hasComponents={componentCount > 0}
                    onClear={clearBuild}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Component Picker ─────────────────────────────────── */}
      <ComponentPicker
        isOpen={pickerOpen}
        category={selectedCategory}
        components={components || []}
        loading={loading}
        onClose={handleClosePicker}
        onSelectComponent={handleSelectComponent}
      />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Sub-components
// ═════════════════════════════════════════════════════════════

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

interface ActionButtonsProps {
  hasComponents: boolean;
  onClear: () => void;
}

function ActionButtons({ hasComponents, onClear }: ActionButtonsProps) {
  return (
    <div className="space-y-3">
      <Button
        asChild
        className="w-full justify-start text-base"
        disabled={!hasComponents}
      >
        <button onClick={() => window.print()}>
          <Save className="mr-2 h-4 w-4" />
          Salva Build
        </button>
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start text-base"
        disabled={!hasComponents}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Condividi
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start text-base"
        disabled={!hasComponents}
      >
        <Download className="mr-2 h-4 w-4" />
        Esporta
      </Button>

      {hasComponents && (
        <Button
          variant="destructive"
          className="w-full justify-start text-base"
          onClick={onClear}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Cancella Build
        </Button>
      )}
    </div>
  );
}
