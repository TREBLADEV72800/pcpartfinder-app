import { useBuilds } from "@hooks/useComponents";
import { formatPrice } from "@lib/utils";
import { Eye, Heart, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ═════════════════════════════════════════════════════════════
// BuildsGalleryPage
// ═════════════════════════════════════════════════════════════
export default function BuildsGalleryPage() {
  const query = useBuilds();
  const buildsData = query.data;
  const loading = query.isPending;

  const builds = buildsData?.items || [];

  return (
    <div className="w-full min-h-screen">
      {/* ── Header ──────────────────────────────────────────── */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-4 inline-flex"
            >
              <Users className="mr-1.5 h-3.5 w-3.5" />
              Community
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
              Build della{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Community
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Esplora le configurazioni PC condivise dalla community,
              trova ispirazione e clona le build che ti piacciono.
            </p>

            {/* Use Case Filter */}
            <div className="mx-auto mt-8 flex flex-wrap justify-center gap-2">
              {["Tutti", "Gaming", "Workstation", "Streaming", "Office", "Budget"].map((useCase) => (
                <Button
                  key={useCase}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  {useCase}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Builds Grid ─────────────────────────────────────── */}
      <section className="py-12">
        <div className="container px-4">
          {loading ? (
            <LoadingState />
          ) : builds.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {builds.map((build: any) => (
                <BuildCard key={build.id} build={build} />
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
}

function BuildCard({ build }: BuildCardProps) {
  return (
    <Link
      to={`/build/${build.shareId}`}
      className="group block"
    >
      <Card className="h-full transition-all duration-200 hover:border-primary/40 hover:shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border bg-muted/30">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                {build.name}
              </h3>
              {build.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
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
                className="text-sm flex items-center gap-3 py-1"
              >
                <span className="text-muted-foreground w-24 shrink-0 text-xs uppercase">
                  {item.component.category.replace("_", " ")}
                </span>
                <span className="truncate flex-1">{item.component.name}</span>
              </div>
            ))}
            {build.items.length > 5 && (
              <p className="text-sm text-muted-foreground pt-1">
                +{build.items.length - 5} altri componenti...
              </p>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            {/* Stats */}
            <div className="flex items-center gap-4">
              {build.totalPrice && (
                <span className="font-bold text-primary">
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
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {build.user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-muted-foreground">
                  {build.user.username}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Sparkles className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">
        Nessuna build disponibile
      </h2>
      <p className="text-muted-foreground mb-6">
        Sii il primo a condividere la tua configurazione con la community!
      </p>
      <Button asChild>
        <Link to="/builder">
          Crea la tua Build
        </Link>
      </Button>
    </div>
  );
}
