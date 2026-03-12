import { ComponentCategory } from "@shared"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Label } from "@components/ui/label"
import { Input } from "@components/ui/input"
import { Slider } from "@components/ui/slider"
import { Button } from "@components/ui/button"
import { Checkbox } from "@components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import { RecentFilter } from "@components/common/RecentFilter"
import { X, Filter } from "lucide-react"

export interface ProductFiltersState {
  search: string
  category?: ComponentCategory
  minPrice?: number
  maxPrice?: number
  brands: string[]
  inStockOnly: boolean
  recentOnly: boolean
  socket?: string
  formFactor?: string
  memoryType?: string
}

interface ProductFiltersProps {
  filters: ProductFiltersState
  onChange: (filters: ProductFiltersState) => void
  availableBrands?: string[]
  availableSockets?: string[]
  availableFormFactors?: string[]
  availableMemoryTypes?: string[]
  minPriceRange?: number
  maxPriceRange?: number
  className?: string
}

export function ProductFilters({
  filters,
  onChange,
  availableBrands = [],
  availableSockets = [],
  availableFormFactors = [],
  availableMemoryTypes = [],
  minPriceRange = 0,
  maxPriceRange = 5000,
  className,
}: ProductFiltersProps) {
  const updateFilter = <K extends keyof ProductFiltersState>(
    key: K,
    value: ProductFiltersState[K]
  ) => {
    onChange({ ...filters, [key]: value })
  }

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    updateFilter("brands", newBrands)
  }

  const clearFilters = () => {
    onChange({
      search: "",
      brands: [],
      inStockOnly: false,
      recentOnly: false,
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.brands.length > 0 ||
    filters.inStockOnly ||
    filters.recentOnly ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.socket ||
    filters.formFactor ||
    filters.memoryType

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            type="search"
            placeholder="Component name..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div>
          <Label>Price Range</Label>
          <div className="mt-2 px-2">
            <Slider
              min={minPriceRange}
              max={maxPriceRange}
              step={10}
              value={[filters.minPrice || minPriceRange, filters.maxPrice || maxPriceRange]}
              onValueChange={([min, max]) => {
                updateFilter("minPrice", min === minPriceRange ? undefined : min)
                updateFilter("maxPrice", max === maxPriceRange ? undefined : max)
              }}
              className="mt-4"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
            <span>${filters.minPrice || minPriceRange}</span>
            <span>${filters.maxPrice || maxPriceRange}</span>
          </div>
        </div>

        {/* Brands */}
        {availableBrands.length > 0 && (
          <div>
            <Label>Brands</Label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {availableBrands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Socket */}
        {availableSockets.length > 0 && (
          <div>
            <Label>Socket</Label>
            <Select
              value={filters.socket}
              onValueChange={(value) => updateFilter("socket", value || undefined)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Any socket" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any socket</SelectItem>
                {availableSockets.map((socket) => (
                  <SelectItem key={socket} value={socket}>
                    {socket}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Form Factor */}
        {availableFormFactors.length > 0 && (
          <div>
            <Label>Form Factor</Label>
            <Select
              value={filters.formFactor}
              onValueChange={(value) => updateFilter("formFactor", value || undefined)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Any form factor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any form factor</SelectItem>
                {availableFormFactors.map((ff) => (
                  <SelectItem key={ff} value={ff}>
                    {ff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Memory Type */}
        {availableMemoryTypes.length > 0 && (
          <div>
            <Label>Memory Type</Label>
            <Select
              value={filters.memoryType}
              onValueChange={(value) => updateFilter("memoryType", value || undefined)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any type</SelectItem>
                {availableMemoryTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* In Stock Only */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={filters.inStockOnly}
            onCheckedChange={(checked) => updateFilter("inStockOnly", checked as boolean)}
          />
          <Label htmlFor="inStock" className="text-sm font-normal cursor-pointer">
            In stock only
          </Label>
        </div>

        {/* Recent Only */}
        <RecentFilter
          checked={filters.recentOnly}
          onChange={(checked) => updateFilter("recentOnly", checked)}
        />
      </CardContent>
    </Card>
  )
}
