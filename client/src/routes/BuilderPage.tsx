export default function BuilderPage() {
  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">System Builder</h1>

      {/* Builder Container - TODO: Implement complete builder */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Component List */}
        <div className="lg:col-span-2 space-y-4">
          <BuilderSlot
            category="CPU"
            icon=""
            selected={null}
            onSelect={() => {}}
          />
          <BuilderSlot
            category="CPU Cooler"
            icon=""
            selected={null}
            onSelect={() => {}}
          />
          <BuilderSlot
            category="Motherboard"
            icon=""
            selected={null}
            onSelect={() => {}}
          />
          <BuilderSlot
            category="Memory"
            icon=""
            selected={null}
            onSelect={() => {}}
          />
          <BuilderSlot
            category="Storage"
            icon=""
            selected={null}
            onSelect={() => {}}
          />
          <BuilderSlot
            category="Video Card"
            icon=""
            selected={null}
            onSelect={() => {}}
          />
          <BuilderSlot
            category="Case"
            icon=""
            selected={null}
            onSelect={() => {}}
          />
          <BuilderSlot
            category="Power Supply"
            icon=""
            selected={null}
            onSelect={() => {}}
          />
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 p-6 border border-border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Riepilogo Build</h2>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Wattaggio stimato:</span>
                <span className="font-medium">0W</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Totale:</span>
                <span className="font-medium">$0.00</span>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Salva Build
              </button>
              <button className="w-full py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                Esporta
              </button>
              <button className="w-full py-2 border border-border rounded-lg font-medium hover:bg-accent transition-colors">
                Condividi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BuilderSlotProps {
  category: string;
  icon: string;
  selected: string | null;
  onSelect: () => void;
}

function BuilderSlot({ category, selected, onSelect }: BuilderSlotProps) {
  return (
    <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card hover:bg-accent transition-colors cursor-pointer" onClick={onSelect}>
      <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        {category[0]}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{category}</h3>
        <p className="text-sm text-muted-foreground">
          {selected || "Scegli un componente"}
        </p>
      </div>
      <div className="text-right">
        <p className="font-medium">{selected ? "$0.00" : "—"}</p>
      </div>
    </div>
  );
}
