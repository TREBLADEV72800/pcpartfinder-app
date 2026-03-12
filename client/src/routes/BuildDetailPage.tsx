import { useParams, Link } from "react-router-dom";
import { useBuild } from "@hooks/useComponents";
import { formatPrice } from "@lib/utils";
import { Eye, Heart, Copy, ArrowLeft, Zap, Euro, Cpu, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ═════════════════════════════════════════════════════════════
// BuildDetailPage
// ═════════════════════════════════════════════════════════════
export default function BuildDetailPage() {
  const { shareId } = useParams<{ shareId: string }>();
  const query = useBuild(shareId || "");
  const build = query.data;
  const loading = query.isPending;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // In production, use toast notification
    alert("Link copiato!");
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen">
        <section className="py-20">
          <div className="container px-4">
            <LoadingState />
          </div>
        </section>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="w-full min-h-screen">
        <section className="py-20">
          <div className="container px-4">
            <NotFoundState />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {/* ── Header ──────────────────────────────────────────── */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container px-4">
          {/* Back Button */}
          <Link
            to="/builds"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna alle build
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <Badge
                variant="secondary"
                className="mb-4 inline-flex"
              >
                <Wrench className="mr-1.5 h-3.5 w-3.5" />
                Build Dettaglio
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                {build.name}
              </h1>

              {build.description && (
                <p className="text-xl text-muted-foreground mb-4">
                  {build.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4">
                {build.useCase && (
                  <Badge variant="outline" className="text-sm">
                    {build.useCase}
                  </Badge>
                )}
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {build.viewsCount} visualizzazioni
                </span>
                {build.user && (
                  <span className="text-sm text-muted-foreground">
                    di <span className="font-medium">{build.user.username}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 lg:shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                title="Copia link"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button asChild>
                <Link to={`/builder?shareId=${shareId}`}>
                  Clona Build
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Build Summary ───────────────────────────────────── */}
      <section className="py-8">
        <div className="container px-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <StatCard
                  icon={<Euro className="h-5 w-5" />}
                  label="Totale Build"
                  value={build.totalPrice ? formatPrice(build.totalPrice) : "N/A"}
                />
                <StatCard
                  icon={<Zap className="h-5 w-5" />}
                  label="Wattaggio"
                  value={`${build.totalWattage || 0}W`}
                />
                <StatCard
                  icon={<Cpu className="h-5 w-5" />}
                  label="Componenti"
                  value={String(build.items?.length || 0)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Components List ─────────────────────────────────── */}
      <section className="pb-12">
        <div className="container px-4">
          <Card>
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-xl font-semibold">Componenti</h2>
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                {build.items?.map((item: any) => (
                  <ComponentItem key={item.id} item={item} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
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
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
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
}

function ComponentItem({ item }: ComponentItemProps) {
  const categoryLabel = item.component.category?.replace(/_/g, " ");
  const price = item.customPrice || item.component.prices?.[0]?.price;
  const retailer = item.component.prices?.[0]?.retailer;

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-accent/50 transition-all">
      {/* Category Icon */}
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold shrink-0">
        {categoryLabel?.substring(0, 2).toUpperCase()}
      </div>

      {/* Component Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground uppercase tracking-wide">
          {categoryLabel}
        </p>
        <h3 className="font-medium truncate">{item.component.name}</h3>
        <p className="text-sm text-muted-foreground">{item.component.brand}</p>
      </div>

      {/* Price */}
      <div className="text-right shrink-0">
        {price ? (
          <>
            <span className="text-lg font-semibold text-primary">
              {formatPrice(price)}
            </span>
            {retailer && (
              <p className="text-xs text-muted-foreground">{retailer}</p>
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
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
      </div>
      <p className="mt-4 text-muted-foreground">Caricamento build...</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Wrench className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">
        Build non trovata
      </h2>
      <p className="text-muted-foreground mb-6">
        La build che stai cercando non esiste o è stata rimossa
      </p>
      <Button asChild>
        <Link to="/builds">
          Torna alle build
        </Link>
      </Button>
    </div>
  );
}
