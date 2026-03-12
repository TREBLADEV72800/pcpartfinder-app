import { useState, useCallback, useEffect, useRef } from "react";
import { Cpu, Wrench, Zap, Euro, Save, Share2, Download, Trash2, Layers, Shield } from "lucide-react";
import { useBuildStore } from "@stores/useBuildStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BuilderTable from "@components/builder/BuilderTable";
import CompatibilityBanner from "@components/builder/CompatibilityBanner";
import BuildActions from "@components/builder/BuildActions";
import ComponentPicker from "@components/builder/ComponentPicker";
import type { Component, ComponentCategory } from "@interfaces/component";
import { useComponents } from "@hooks/useComponents";

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

/* ═══════════════════════════════════════════════════════════════
   BUILDER PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function BuilderPage() {
  const { setSlot, slots, clearBuild, getTotalPrice, getTotalWattage } = useBuildStore();
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
    <div className="w-full overflow-x-hidden">
      {/* ── Hero ───────────────────────────────────────────── */}
      <BuilderHero
        componentCount={componentCount}
        totalWattage={totalWattage}
        totalPrice={totalPrice}
      />

      {/* ── Main Content ──────────────────────────────────── */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Builder Table */}
            <div className="lg:col-span-2">
              <SectionCard
                title="Componenti"
                icon={<Layers className="h-5 w-5" />}
              >
                <BuilderTable onOpenPicker={handleOpenPicker} />
              </SectionCard>

              {/* Compatibility Section */}
              <SectionCard
                title="Compatibilità"
                icon={<Shield className="h-5 w-5" />}
                className="mt-8"
              >
                <div className="p-6">
                  <CompatibilityBanner />
                </div>
              </SectionCard>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <StickyCard>
                <BuilderActions />
                <QuickActions
                  hasComponents={componentCount > 0}
                  onClear={clearBuild}
                />
              </StickyCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── Component Picker ───────────────────────────────── */}
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

/* ───────────────────────────────────────────────────────────── */
/* Sub-components                                                 */
/* ───────────────────────────────────────────────────────────── */

function BuilderHero({
  componentCount,
  totalWattage,
  totalPrice,
}: {
  componentCount: number;
  totalWattage: number;
  totalPrice: number;
}) {
  const { ref } = useInView(0.1);

  return (
    <section ref={ref} className="relative min-h-[75vh] flex items-center justify-center overflow-hidden border-b border-border">
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
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-30"
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
      <div className="container relative z-10 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-[fadeInDown_0.6s_ease-out]">
            <Badge
              variant="outline"
              className="gap-2 px-4 py-2 text-sm font-medium border-primary/30 bg-primary/5 backdrop-blur-sm"
            >
              <Wrench className="mr-1.5 h-3.5 w-3.5" />
              System Builder
            </Badge>
          </div>

          {/* Heading */}
          <h1 className="animate-[fadeInUp_0.8s_ease-out] text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Configura il tuo{" "}
            <span
              className="bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-[gradientShift_6s_ease-in-out_infinite]"
              style={{ backgroundSize: "200% auto" }}
            >
              PC Perfetto
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
            Configura il tuo PC componente per componente con verifica
            compatibilità in tempo reale.
          </p>

          {/* Quick stats */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 sm:grid-cols-3 gap-6 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
            <HeroStatCard
              icon={<Cpu className="h-6 w-6" />}
              label="Componenti"
              value={`${componentCount}/12`}
              gradient="from-blue-500 to-cyan-400"
            />
            <HeroStatCard
              icon={<Zap className="h-6 w-6" />}
              label="Wattaggio"
              value={`~${totalWattage}W`}
              gradient="from-amber-500 to-orange-400"
            />
            <HeroStatCard
              icon={<Euro className="h-6 w-6" />}
              label="Prezzo"
              value={`€${totalPrice.toFixed(2)}`}
              gradient="from-emerald-500 to-green-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStatCard({
  icon,
  label,
  value,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient: string;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
    >
      {/* Top gradient line */}
      <div
        className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${gradient} opacity-0 transition-opacity group-hover:opacity-100`}
      />

      <div className="relative z-10 flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform group-hover:scale-110`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-extrabold tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`overflow-hidden border-border/60 bg-card transition-all duration-300 hover:border-primary/20 ${className}`}
    >
      <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

function StickyCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-24 space-y-6">
      <Card className="border-border/60 bg-card overflow-hidden">
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            Azioni Build
          </h2>
        </div>
        <div className="p-6">{children}</div>
      </Card>
    </div>
  );
}

function BuilderActions() {
  return <BuildActions />;
}

interface QuickActionsProps {
  hasComponents: boolean;
  onClear: () => void;
}

function QuickActions({ hasComponents, onClear }: QuickActionsProps) {
  return (
    <div className="space-y-3 pt-6 border-t border-border">
      <Button
        asChild
        className="w-full justify-start text-base group"
        disabled={!hasComponents}
      >
        <button onClick={() => window.print()}>
          <Save className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          Salva Build
        </button>
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start text-base group"
        disabled={!hasComponents}
      >
        <Share2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
        Condividi
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start text-base group"
        disabled={!hasComponents}
      >
        <Download className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
        Esporta
      </Button>

      {hasComponents && (
        <Button
          variant="destructive"
          className="w-full justify-start text-base group"
          onClick={onClear}
        >
          <Trash2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          Cancella Build
        </Button>
      )}
    </div>
  );
}
