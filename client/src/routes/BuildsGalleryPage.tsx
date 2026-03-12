import { useRef, useEffect, useState } from "react";
import { useBuilds } from "@hooks/useComponents";
import { formatPrice } from "@lib/utils";
import { Eye, Heart, Users, Sparkles, Gamepad2, Briefcase, Video, Home, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
   BUILDS GALLERY PAGE
   ═════════════════════════════════════════════════════════════ */
export default function BuildsGalleryPage() {
  const query = useBuilds();
  const buildsData = query.data;
  const loading = query.isPending;

  const builds = buildsData?.items || [];

  return (
    <div className="w-full overflow-x-hidden">
      {/* ── Hero ──────────────────────────────────────────── */}
      <GalleryHero />

      {/* ── Builds Grid ─────────────────────────────────────── */}
      <section className="py-12">
        <div className="container px-4">
          {loading ? (
            <LoadingState />
          ) : builds.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {builds.map((build: any, index: number) => (
                <BuildCard key={build.id} build={build} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Sub-components                                                 */
/* ───────────────────────────────────────────────────────────── */

const USE_CASES = [
  { label: "Tutti", value: "all", icon: Sparkles },
  { label: "Gaming", value: "GAMING", icon: Gamepad2 },
  { label: "Workstation", value: "WORKSTATION", icon: Briefcase },
  { label: "Streaming", value: "STREAMING", icon: Video },
  { label: "Office", value: "OFFICE", icon: Home },
  { label: "Budget", value: "BUDGET", icon: Zap },
];

function GalleryHero() {
  const [selectedUseCase, setSelectedUseCase] = useState("all");
  const { ref } = useInView(0.1);

  return (
    <section ref={ref} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-border">
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
        className="pointer-events-none absolute top-20 left-[8%] h-64 w-64 rounded-full bg-violet-500/8 blur-[100px] animate-[float_9s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-20 right-[8%] h-80 w-80 rounded-full bg-blue-500/8 blur-[120px] animate-[float_11s_ease-in-out_infinite_reverse]"
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
              <Users className="mr-1.5 h-3.5 w-3.5" />
              Community
            </Badge>
          </div>

          {/* Heading */}
          <h1 className="animate-[fadeInUp_0.8s_ease-out] text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Build della{" "}
            <span
              className="bg-gradient-to-r from-primary via-violet-400 to-pink-400 bg-clip-text text-transparent animate-[gradientShift_6s_ease-in-out_infinite]"
              style={{ backgroundSize: "200% auto" }}
            >
              Community
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
            Esplora le configurazioni PC condivise dalla community,
            trova ispirazione e clona le build che ti piacciono.
          </p>

          {/* Use Case Filter */}
          <div className="mx-auto mt-10 flex flex-wrap justify-center gap-3 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
            {USE_CASES.map((useCase) => {
              const Icon = useCase.icon;
              const isActive = selectedUseCase === useCase.value;
              return (
                <Button
                  key={useCase.value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedUseCase(useCase.value)}
                  className="rounded-full gap-2"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {useCase.label}
                </Button>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
            <Button asChild size="lg" className="h-14 px-8 text-base">
              <Link to="/builder">
                <Sparkles className="h-5 w-5 mr-2" />
                Crea la tua Build
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface BuildCardProps {
  build: {
    id: string;
    shareId: string;
    name: string;
    description?: string;
    totalPrice?: number;
    totalWattage?: number;
    useCase?: string;
    viewsCount: number;
    likesCount: number;
    user?: {
      username: string;
      avatarUrl?: string;
    };
    items: Array<{
      component: {
        name: string;
        category: string;
        brand: string;
      };
    }>;
  };
  index: number;
}

function BuildCard({ build, index }: BuildCardProps) {
  const { ref, inView } = useInView(0.05);

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.5s ease-out",
        transitionDelay: `${index * 75}ms`,
      }}
    >
      <Link
        to={`/build/${build.shareId}`}
        className="group block"
      >
        <Card className="h-full overflow-hidden border-border/60 bg-card transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
        {/* Top gradient line on hover */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary via-violet-400 to-pink-400 opacity-0 transition-opacity group-hover:opacity-100 z-10" />

        {/* Header */}
        <div className="p-5 border-b border-border bg-muted/30">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate group-hover:text-primary transition-colors text-lg">
                {build.name}
              </h3>
              {build.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {build.description}
                </p>
              )}
            </div>
            {build.useCase && (
              <Badge variant="secondary" className="shrink-0">
                {build.useCase}
              </Badge>
            )}
          </div>
        </div>

        {/* Components Preview */}
        <CardContent className="p-5">
          <div className="space-y-2">
            {build.items.slice(0, 5).map((item, idx) => (
              <div
                key={idx}
                className="text-sm flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/20 group-hover:bg-muted/30 transition-colors"
              >
                <span className="text-muted-foreground w-24 shrink-0 text-xs uppercase font-medium">
                  {item.component.category.replace(/_/g, " ")}
                </span>
                <span className="truncate flex-1 font-medium">{item.component.name}</span>
              </div>
            ))}
            {build.items.length > 5 && (
              <p className="text-sm text-muted-foreground pt-2 flex items-center gap-1">
                +{build.items.length - 5} altri componenti...
              </p>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            {/* Stats */}
            <div className="flex flex-col gap-2">
              {build.totalPrice && (
                <span className="text-xl font-bold text-primary">
                  {formatPrice(build.totalPrice)}
                </span>
              )}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {build.viewsCount}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {build.likesCount}
                </span>
              </div>
            </div>

            {/* Author */}
            {build.user && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-primary/10">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {build.user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-primary">
                  {build.user.username}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
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
      <p className="text-lg text-muted-foreground">Caricamento build...</p>
    </div>
  );
}

function EmptyState() {
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
      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/10 flex items-center justify-center mb-6 animate-[float_6s_ease-in-out_infinite]">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-3">
        Nessuna build disponibile
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md text-center">
        Sii il primo a condividere la tua configurazione con la community!
      </p>
      <Button asChild size="lg" className="h-12 px-6">
        <Link to="/builder">
          <Sparkles className="h-5 w-5 mr-2" />
          Crea la tua Build
        </Link>
      </Button>
    </div>
  );
}
