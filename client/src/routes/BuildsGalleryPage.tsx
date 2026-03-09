import { useBuilds } from "@hooks/useComponents";
import { formatPrice } from "@lib/utils";
import { Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function BuildsGalleryPage() {
  const query = useBuilds();
  const buildsData = query.data;
  const loading = query.isPending;

  const builds = buildsData?.items || [];

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Build della Community</h1>
        <p className="text-muted-foreground">
          Esplora le configurazioni PC condivise dalla community
        </p>
      </div>

      {/* Use Case Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["Tutti", "Gaming", "Workstation", "Streaming", "Office", "Budget"].map((useCase) => (
          <button
            key={useCase}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            {useCase}
          </button>
        ))}
      </div>

      {/* Builds Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : builds.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Nessuna build disponibile
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builds.map((build: any) => (
            <BuildCard key={build.id} build={build} />
          ))}
        </div>
      )}
    </div>
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
}

function BuildCard({ build }: BuildCardProps) {
  return (
    <Link
      to={`/build/${build.shareId}`}
      className="block border border-border rounded-lg bg-card hover:shadow-lg transition-shadow overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold truncate">{build.name}</h3>
        {build.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {build.description}
          </p>
        )}
      </div>

      {/* Components Preview */}
      <div className="p-4">
        <div className="space-y-1">
          {build.items.slice(0, 5).map((item, idx) => (
            <div key={idx} className="text-sm flex items-center gap-2">
              <span className="text-muted-foreground w-20 truncate">
                {item.component.category.replace("_", " ")}
              </span>
              <span className="truncate flex-1">{item.component.name}</span>
            </div>
          ))}
          {build.items.length > 5 && (
            <p className="text-sm text-muted-foreground">
              +{build.items.length - 5} altri componenti...
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {build.totalPrice && (
            <span className="font-semibold text-primary">
              {formatPrice(build.totalPrice)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {build.viewsCount}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {build.likesCount}
          </span>
        </div>

        {build.useCase && (
          <span className="text-xs px-2 py-1 bg-muted rounded">
            {build.useCase}
          </span>
        )}
      </div>
    </Link>
  );
}
