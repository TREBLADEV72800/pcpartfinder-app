import { useBuildStore } from "@stores/useBuildStore";
import { Share2, Download, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

export default function BuildActions() {
  const { clearBuild, getTotalPrice, slots, name } = useBuildStore();
  const totalPrice = getTotalPrice();
  const hasComponents = slots.some((s) => s.component);

  const handleSave = () => {
    if (!hasComponents) {
      toast.error("Aggiungi almeno un componente alla build");
      return;
    }
    // TODO: Implement save to backend
    console.log("Saving build...");
    toast.success("Build salvata con successo!");
  };

  const handleShare = async () => {
    if (!hasComponents) {
      toast.error("Aggiungi almeno un componente alla build");
      return;
    }

    // Generate share URL (in real app, this would come from the backend)
    const shareUrl = `${window.location.origin}/builder/${crypto.randomUUID()}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copiato negli appunti!", {
        description: shareUrl,
        action: {
          label: "Apri",
          onClick: () => window.open(shareUrl, "_blank"),
        },
      });
    } catch (err) {
      toast.error("Impossibile copiare il link");
    }
  };

  const handleExport = () => {
    if (!hasComponents) {
      toast.error("Aggiungi almeno un componente alla build");
      return;
    }

    // Export as markdown/text
    let text = `# ${name}\n\n`;
    text += `**Totale:** €${totalPrice.toFixed(2)}\n`;
    text += `**Data:** ${new Date().toLocaleDateString("it-IT")}\n\n`;
    text += `## Componenti\n\n`;

    for (const slot of slots) {
      if (slot.component) {
        const price = slot.customPrice || slot.component.prices?.[0]?.price || 0;
        text += `- **${slot.category.replace("_", " ")}**: ${slot.component.name}`;
        if (price > 0) {
          text += ` - €${price.toFixed(2)}`;
        }
        if (slot.notes) {
          text += ` (${slot.notes})`;
        }
        text += "\n";
      }
    }

    text += `\n---\n_Generato con PCBuilderAI_`;

    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_")}_build.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Build esportata in Markdown");
  };

  const handleClear = () => {
    if (!hasComponents) {
      toast.error("La build è già vuota");
      return;
    }

    toast("Sei sicuro di voler cancellare la build?", {
      action: {
        label: "Sì, cancella",
        onClick: () => {
          clearBuild();
          toast.success("Build cancellata");
        },
      },
      cancel: {
        label: "Annulla",
        onClick: () => {},
      },
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hasComponents}
      >
        <Save className="h-4 w-4" />
        Salva Build
      </button>

      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hasComponents}
      >
        <Share2 className="h-4 w-4" />
        Condividi
      </button>

      <button
        onClick={handleExport}
        className="w-full flex items-center justify-center gap-2 py-2 border border-border rounded-lg font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hasComponents}
      >
        <Download className="h-4 w-4" />
        Esporta
      </button>

      <button
        onClick={handleClear}
        className="w-full flex items-center justify-center gap-2 py-2 text-destructive hover:bg-destructive/10 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hasComponents}
      >
        <Trash2 className="h-4 w-4" />
        Cancella Build
      </button>

      {/* Quick Actions */}
      <div className="pt-3 border-t border-border space-y-2">
        <button
          onClick={() => {
            const text = slots
              .filter((s) => s.component)
              .map((s) => `${s.component?.name} - €${(s.component?.prices?.[0]?.price || 0)}`)
              .join("\n");

            navigator.clipboard.writeText(text);
            toast.success("Lista componenti copiata");
          }}
          className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!hasComponents}
        >
          Copia lista componenti
        </button>
      </div>
    </div>
  );
}
