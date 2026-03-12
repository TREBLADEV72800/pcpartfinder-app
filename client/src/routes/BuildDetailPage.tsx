import { useParams, Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useBuild } from "@hooks/useComponents";
import { formatPrice } from "@lib/utils";
import { Eye, Heart, Copy, ArrowLeft, Zap, Euro, Cpu, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
   BUILD DETAIL PAGE
   ═════════════════════════════════════════════════════════════ */
export default function BuildDetailPage() {
  const { shareId } = useParams<{ shareId: string }>();
  const query = useBuild(shareId || "");
  const build = query.data;
  const loading = query.isPending;
  const [liked, setLiked] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copiato negli appunti!");
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? "Rimosso dai preferiti" : "Aggiunto ai preferiti");
  };

  if (loading) {
    return (
      <div className="w-full overflow-x-hidden">
        <section className="min-h-[70vh] flex items-center justify-center">
          <div className="container px-4">
            <LoadingState />
          </div>
        </section>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="w-full overflow-x-hidden">
        <section className="min-h-[70vh] flex items-center justify-center">
          <div className="container px-4">
            <NotFoundState />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-[55vh] flex items-center border-b border-border bg-muted/20">
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
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          }}
        />

        {/* ── Content ── */}
        <div className="container relative z-10 px-4 py-12">
          {/* Back Button */}
          <Link
            to="/builds"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Torna alle build
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <Badge
                variant="outline"
                className="mb-4 inline-flex gap-2 border-primary/30 bg-primary/5"
              >
                <Wrench className="mr-1.5 h-3.5 w-3.5" />
                Build Dettaglio
              </Badge>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 animate-[fadeInUp_0.6s_ease-out]">
                {build.name}
              </h1>

              {build.description && (
                <p className="text-xl text-muted-foreground mb-6 animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
                  {build.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
                {build.useCase && (
                  <Badge variant="secondary" className="text-sm">
                    {build.useCase}
                  </Badge>
                )}
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {build.viewsCount} visualizzazioni
                </span>
                {build.user && (
                  <span className="text-sm text-muted-foreground">
                    di <span className="font-medium text-foreground">{build.user.username}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 lg:shrink-0 animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                title="Copia link"
                className="h-12 w-12"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleLike}
                title="Mi piace"
                className={`h-12 w-12 ${liked ? "bg-red-500/10 text-red-500 border-red-500/20" : ""}`}
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              </Button>
              <Button asChild size="lg" className="h-12 px-6">
                <Link to={`/builder?shareId=${shareId}`}>
                  Clona Build
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Build Summary ───────────────────────────────────── */}
      <section className="py-8 bg-muted/10 border-b border-border">
        <div className="container px-4">
          <Card className="border-border/60 overflow-hidden">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <StatCard
                  icon={<Euro className="h-5 w-5" />}
                  label="Totale Build"
                  value={build.totalPrice ? formatPrice(build.totalPrice) : "N/A"}
                  gradient="from-emerald-500 to-green-400"
                />
                <StatCard
                  icon={<Zap className="h-5 w-5" />}
                  label="Wattaggio"
                  value={`${build.totalWattage || 0}W`}
                  gradient="from-amber-500 to-orange-400"
                />
                <StatCard
                  icon={<Cpu className="h-5 w-5" />}
                  label="Componenti"
                  value={String(build.items?.length || 0)}
                  gradient="from-blue-500 to-cyan-400"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Components List ─────────────────────────────────── */}
      <section className="py-12">
        <div className="container px-4">
          <Card className="border-border/60 overflow-hidden">
            <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Cpu className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Componenti</h2>
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                {build.items?.map((item: any, index: number) => (
                  <ComponentItem key={item.id} item={item} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Sub-components                                                 */
/* ───────────────────────────────────────────────────────────── */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient: string;
}

function StatCard({ icon, label, value, gradient }: StatCardProps) {
  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform group-hover:scale-110`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-extrabold tracking-tight">{value}</p>
      </div>
    </div>
  );
}

interface ComponentItemProps {
  item: {
    id: string;
    component: {
      name: string;
      category: string;
      brand: string;
      prices?: Array<{ price: number; retailer: string; url: string }>;
    };
    customPrice?: number;
  };
  index: number;
}

function ComponentItem({ item, index }: ComponentItemProps) {
  const { ref, inView } = useInView(0.01);
  const categoryLabel = item.component.category?.replace(/_/g, " ");
  const price = item.customPrice || item.component.prices?.[0]?.price;
  const retailer = item.component.prices?.[0]?.retailer;

  return (
    <div
      ref={ref}
      className="group flex items-center gap-4 p-5 rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:bg-accent/50"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-20px)",
        transition: "all 0.4s ease-out",
        transitionDelay: `${index * 50}ms`,
      }}
    >
      {/* Category Icon */}
      <div className="h-14 w-14 bg-gradient-to-br from-primary/20 to-blue-500/10 rounded-xl flex items-center justify-center text-primary font-bold text-lg shrink-0 group-hover:scale-110 transition-transform">
        {categoryLabel?.substring(0, 2).toUpperCase()}
      </div>

      {/* Component Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
          {categoryLabel}
        </p>
        <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{item.component.name}</h3>
        <p className="text-sm text-muted-foreground">{item.component.brand}</p>
      </div>

      {/* Price */}
      <div className="text-right shrink-0">
        {price ? (
          <>
            <span className="text-xl font-bold text-primary">
              {formatPrice(price)}
            </span>
            {retailer && (
              <p className="text-xs text-muted-foreground mt-1">{retailer}</p>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
      </div>
      <p className="text-lg text-muted-foreground">Caricamento build...</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-destructive/20 to-red-500/10 flex items-center justify-center mb-6">
        <Wrench className="h-12 w-12 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold mb-3">
        Build non trovata
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md text-center">
        La build che stai cercando non esiste o è stata rimossa
      </p>
      <Button asChild size="lg">
        <Link to="/builds">
          Torna alle build
        </Link>
      </Button>
    </div>
  );
}
