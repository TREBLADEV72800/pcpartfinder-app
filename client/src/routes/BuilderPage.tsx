import { useState, useCallback } from "react";
import { useBuildStore } from "@stores/useBuildStore";
import BuilderTable from "@components/builder/BuilderTable";
import CompatibilityBanner from "@components/builder/CompatibilityBanner";
import BuildActions from "@components/builder/BuildActions";
import ComponentPicker from "@components/builder/ComponentPicker";
import { Component, ComponentCategory } from "@interfaces/component";
import { useComponents } from "@hooks/useComponents";

export default function BuilderPage() {
  const { setSlot, slots } = useBuildStore();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | null>(null);

  const query = useComponents(selectedCategory || undefined);
  const components = query.data;
  const loading = query.isPending;

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
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Builder</h1>
        <p className="text-muted-foreground">
          Configura il tuo PC componente per componente con verifica compatibilità in tempo reale.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Builder Table */}
        <div className="lg:col-span-2 space-y-6">
          <BuilderTable onOpenPicker={handleOpenPicker} />

          {/* Compatibility Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Compatibilità</h2>
            <CompatibilityBanner />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24 p-6 border border-border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Azioni Build</h2>
            <BuildActions />

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-medium mb-3">Statistiche</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Componenti:</span>
                  <span>{slots.filter((s) => s.component).length}/12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wattaggio:</span>
                  <span>~{calculateWattage()}W</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prezzo:</span>
                  <span>€{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Picker */}
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

function calculateWattage(): number {
  const { slots } = useBuildStore.getState();
  let total = 50; // Base system

  for (const slot of slots) {
    if (slot.component) {
      total += slot.component.tdp || slot.component.wattage || 0;
    }
  }

  return total;
}

function getTotalPrice(): number {
  return useBuildStore.getState().getTotalPrice();
}
