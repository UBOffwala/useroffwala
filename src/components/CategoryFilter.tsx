import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, X } from "lucide-react";
import { categories } from "@/data/offers";
import { FilterOptions } from "@/types/offer";
import { formatPrice } from "@/lib/offers";

interface CategoryFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export function CategoryFilter({
  filters,
  onFiltersChange,
  onClearFilters,
}: CategoryFilterProps) {
  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value !== undefined &&
      value !== null &&
      (Array.isArray(value) ? value.length > 0 : true),
  );

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === categoryId ? undefined : categoryId,
    });
  };

  const handlePriceRangeChange = (range: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [range[0], range[1]],
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as FilterOptions["sortBy"],
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating: filters.rating === rating ? undefined : rating,
    });
  };

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Sort By */}
        <div>
          <h3 className="font-medium mb-3">Sort By</h3>
          <Select value={filters.sortBy || ""} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="discount">Best Discounts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filters.category === category.id ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start h-auto p-3"
                onClick={() => handleCategoryChange(category.id)}
              >
                <span className="mr-3 text-lg">{category.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{category.name}</div>
                  <div className="text-xs text-gray-500">
                    {category.count} offers
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="px-2">
            <Slider
              value={filters.priceRange || [0, 2000]}
              onValueChange={handlePriceRangeChange}
              max={2000}
              min={0}
              step={50}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatPrice(filters.priceRange?.[0] || 0)}</span>
              <span>{formatPrice(filters.priceRange?.[1] || 2000)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Rating Filter */}
        <div>
          <h3 className="font-medium mb-3">Minimum Rating</h3>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={filters.rating === rating ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => handleRatingChange(rating)}
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2">& Up</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Active Filters */}
        {hasActiveFilters && (
          <div>
            <h3 className="font-medium mb-3">Active Filters</h3>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <Badge variant="secondary" className="gap-1">
                  {categories.find((c) => c.id === filters.category)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      onFiltersChange({ ...filters, category: undefined })
                    }
                  />
                </Badge>
              )}
              {filters.priceRange && (
                <Badge variant="secondary" className="gap-1">
                  {formatPrice(filters.priceRange[0])} -{" "}
                  {formatPrice(filters.priceRange[1])}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      onFiltersChange({ ...filters, priceRange: undefined })
                    }
                  />
                </Badge>
              )}
              {filters.rating && (
                <Badge variant="secondary" className="gap-1">
                  {filters.rating}+ Stars
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      onFiltersChange({ ...filters, rating: undefined })
                    }
                  />
                </Badge>
              )}
              {filters.sortBy && (
                <Badge variant="secondary" className="gap-1">
                  Sorted by {filters.sortBy}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      onFiltersChange({ ...filters, sortBy: undefined })
                    }
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
