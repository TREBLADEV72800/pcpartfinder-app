import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import { Slider } from "@components/ui/slider"
import { Checkbox } from "@components/ui/checkbox"
import { Search, SlidersHorizontal } from "lucide-react"
import { cn } from "@lib/utils"

export interface ComponentPickerFiltersState {
  search: string
  minPrice?: number
  maxPrice?: number
  brands: string[]
  inStockOnly: boolean
  sortBy?: "price" | "name" | "rating"
  sortOrder?: "asc" | "desc"
}

interface ComponentPickerFiltersProps {
  filters: ComponentPickerFiltersState
  onChange: (filters: ComponentPickerFiltersState) => void
  availableBrands?: string[]
  minPriceRange?: number
  maxPriceRange?: number
  className?: string
}

export function ComponentPickerFilters({
  filters,
  onChange,
  availableBrands = [],
  minPriceRange = 0,
  maxPriceRange = 5000,
  className,
}: ComponentPickerFiltersProps) {
  const updateFilter = <K extends keyof ComponentPickerFiltersState>(
    key: K,
    value: ComponentPickerFiltersState[K]
  ) => {
    onChange({ ...filters, [key]: value })
  }

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    updateFilter("brands", newBrands)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search components..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sort */}
      <div>
        <Label>Sort by</Label>
        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split("-") as [any, any]
            updateFilter("sortBy", sortBy)
            updateFilter("sortOrder", sortOrder)
          }}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
            <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
          </SelectContent>
        </Select>
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
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
            {availableBrands.slice(0, 10).map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`picker-brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                />
                <Label
                  htmlFor={`picker-brand-${brand}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In Stock Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="picker-inStock"
          checked={filters.inStockOnly}
          onCheckedChange={(checked) => updateFilter("inStockOnly", checked as boolean)}
        />
        <Label htmlFor="picker-inStock" className="text-sm font-normal cursor-pointer">
          In stock only
        </Label>
      </div>
    </div>
  )
}
