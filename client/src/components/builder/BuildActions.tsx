import { useBuildStore } from "@stores/useBuildStore";
import { Share2, Download, Trash2, Save } from "lucide-react";

export default function BuildActions() {
  const { clearBuild, getTotalPrice } = useBuildStore();
  const totalPrice = getTotalPrice();

  const handleSave = () => {
    // TODO: Implement save to backend
    console.log("Saving build...");
  };

  const handleShare = () => {
    // TODO: Implement share dialog
    const shareUrl = window.location.href + "/share/" + crypto.randomUUID();
    navigator.clipboard.writeText(shareUrl);
    alert("Link copiato negli appunti!");
  };

  const handleExport = () => {
    // Export as markdown/text
    const { slots, name } = useBuildStore.getState();
    let text = `# ${name}\n\n`;
    text += `**Totale:** $${totalPrice.toFixed(2)}\n\n`;

    for (const slot of slots) {
      if (slot.component) {
        text += `- **${slot.category}**: ${slot.component.name}`;
        if (slot.customPrice) {
          text += ` ($${slot.customPrice})`;
        }
        text += "\n";
      }
    }

    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm("Sei sicuro di voler cancellare la build?")) {
      clearBuild();
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        <Save className="h-4 w-4" />
        Salva Build
      </button>

      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
      >
        <Share2 className="h-4 w-4" />
        Condividi
      </button>

      <button
        onClick={handleExport}
        className="w-full flex items-center justify-center gap-2 py-2 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
      >
        <Download className="h-4 w-4" />
        Esporta
      </button>

      <button
        onClick={handleClear}
        className="w-full flex items-center justify-center gap-2 py-2 text-destructive hover:bg-destructive/10 rounded-lg font-medium transition-colors"
      >
        <Trash2 className="h-4 w-4" />
        Cancella Build
      </button>
    </div>
  );
}
