"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"
import { useState } from "react"

interface ProductFiltersProps {
  availableSizes: string[]
  availableColors: string[]
}

export function ProductFilters({ availableSizes, availableColors }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([
    Number.parseInt(searchParams.get("minPrice") || "0"),
    Number.parseInt(searchParams.get("maxPrice") || "20000"),
  ])

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(window.location.pathname)
  }

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())
    router.push(`?${params.toString()}`)
  }

  const hasActiveFilters =
    searchParams.has("minPrice") ||
    searchParams.has("maxPrice") ||
    searchParams.has("size") ||
    searchParams.has("color") ||
    searchParams.has("sort")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select value={searchParams.get("sort") || "default"} onValueChange={(value) => updateFilter("sort", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label>Price Range</Label>
        <div className="px-2">
          <Slider value={priceRange} onValueChange={setPriceRange} max={20000} min={0} step={500} className="mb-4" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">₹{priceRange[0].toLocaleString()}</span>
          <span className="text-muted-foreground">-</span>
          <span className="text-muted-foreground">₹{priceRange[1].toLocaleString()}</span>
        </div>
        <Button size="sm" onClick={applyPriceFilter} className="w-full">
          Apply Price
        </Button>
      </div>

      {/* Size */}
      {availableSizes.length > 0 && (
        <div className="space-y-2">
          <Label>Size</Label>
          <Select value={searchParams.get("size") || "all"} onValueChange={(value) => updateFilter("size", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Sizes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              {availableSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Color */}
      {availableColors.length > 0 && (
        <div className="space-y-2">
          <Label>Color</Label>
          <Select value={searchParams.get("color") || "all"} onValueChange={(value) => updateFilter("color", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Colors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              {availableColors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
