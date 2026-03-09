import { useParams } from "react-router-dom";
import { useBuild } from "@hooks/useComponents";
import { formatPrice } from "@lib/utils";
import { Eye, Heart, Copy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function BuildDetailPage() {
  const { shareId } = useParams<{ shareId: string }>();
  const query = useBuild(shareId || "");
  const build = query.data;
  const loading = query.isPending;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link copiato!");
  };

  if (loading) {
    return (
      <div className="container px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!build) {
    return (
      <div className="container px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Build non trovata</h1>
        <Link to="/builds" className="text-primary hover:underline">
          Torna alle build
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 max-w-5xl mx-auto">
      {/* Back */}
      <Link
        to="/builds"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Torna alle build
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{build.name}</h1>
            {build.description && (
              <p className="text-muted-foreground">{build.description}</p>
            )}
            {build.useCase && (
              <span className="inline-block mt-2 text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                {build.useCase}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 border border-border rounded-lg hover:bg-accent transition-colors"
              title="Copia link"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button className="p-2 border border-border rounded-lg hover:bg-accent transition-colors">
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {build.viewsCount} visualizzazioni
          </span>
          {build.user && (
            <span>di {build.user.username}</span>
          )}
        </div>
      </div>

      {/* Build Summary */}
      <div className="mb-8 p-6 border border-border rounded-lg bg-muted/30">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Totale Build</p>
            <p className="text-2xl font-bold text-primary">
              {build.totalPrice ? formatPrice(build.totalPrice) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Wattaggio</p>
            <p className="text-2xl font-bold">{build.totalWattage || 0}W</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Componenti</p>
            <p className="text-2xl font-bold">{build.items?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Components List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Componenti</h2>
        <div className="space-y-2">
          {build.items?.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card hover:bg-accent transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                {item.component.category?.substring(0, 2)}
              </div>

              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{item.component.category?.replace("_", " ")}</p>
                <h3 className="font-medium">{item.component.name}</h3>
              </div>

              <div className="text-right">
                {item.customPrice ? (
                  <span className="font-semibold">{formatPrice(item.customPrice)}</span>
                ) : item.component.prices?.[0] ? (
                  <div>
                    <span className="font-semibold">{formatPrice(item.component.prices[0].price)}</span>
                    <p className="text-xs text-muted-foreground">{item.component.prices[0].retailer}</p>
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
