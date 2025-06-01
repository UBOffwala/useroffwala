import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Grid3X3,
  List,
  Search,
  Filter,
  TrendingUp,
  Star,
  Clock,
  ArrowLeft,
  SlidersHorizontal,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OfferCard } from "@/components/OfferCard";
import { CategoryGrid } from "@/components/CategoryGrid";
import { filterOffers } from "@/lib/offers";
import { categories, offers } from "@/data/offers";
import { FilterOptions } from "@/types/offer";
import { cn } from "@/lib/utils";

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("selected") || "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [minRating, setMinRating] = useState<string>("all");

  const [filters, setFilters] = useState<FilterOptions>({});

  useEffect(() => {
    const category = searchParams.get("selected");
    if (category) {
      setSelectedCategory(category);
      setFilters((prev) => ({ ...prev, category }));
    }
  }, [searchParams]);

  // Apply filters
  const filteredOffers = filterOffers({
    ...filters,
    search: searchQuery || undefined,
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchParams({ selected: categoryId });
    setFilters((prev) => ({ ...prev, category: categoryId }));
  };

  const handleClearSelection = () => {
    setSelectedCategory("");
    setSearchParams({});
    setFilters({});
  };

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory,
  );
  const categoryOffers = selectedCategory ? filteredOffers : [];

  const handleSortChange = (value: string) => {
    setSortBy(value);
    let sortOption: FilterOptions["sortBy"];
    switch (value) {
      case "price-low":
        sortOption = "price";
        break;
      case "price-high":
        sortOption = "price";
        break;
      case "rating":
        sortOption = "rating";
        break;
      case "newest":
        sortOption = "newest";
        break;
      case "discount":
        sortOption = "discount";
        break;
      default:
        sortOption = undefined;
    }
    setFilters((prev) => ({ ...prev, sortBy: sortOption }));
  };

  const handlePriceRangeChange = (value: string) => {
    setPriceRange(value);
    let range: [number, number] | undefined;
    switch (value) {
      case "under-100":
        range = [0, 100];
        break;
      case "100-500":
        range = [100, 500];
        break;
      case "500-1000":
        range = [500, 1000];
        break;
      case "over-1000":
        range = [1000, 10000];
        break;
      default:
        range = undefined;
    }
    setFilters((prev) => ({ ...prev, priceRange: range }));
  };

  const handleRatingChange = (value: string) => {
    setMinRating(value);
    const rating = value === "all" ? undefined : parseInt(value);
    setFilters((prev) => ({ ...prev, rating }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {selectedCategory ? (
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                onClick={handleClearSelection}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                All Categories
              </Button>
              <div className="text-sm text-gray-500">/</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedCategoryData?.icon}</span>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedCategoryData?.name}
                </h1>
              </div>
            </div>
          ) : (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                All Categories
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore thousands of products across all categories. Find
                exactly what you're looking for.
              </p>
            </div>
          )}
        </div>

        {selectedCategory ? (
          /* Category Products View */
          <div className="space-y-6">
            {/* Category Header */}
            <Card className="bg-gradient-to-r from-[#1890ff] to-[#722ed1] text-white border-0">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{selectedCategoryData?.icon}</div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">
                        {selectedCategoryData?.name}
                      </h2>
                      <p className="text-white/90">
                        {categoryOffers.length} products available
                      </p>
                      <Badge className="bg-white/20 text-white mt-2">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Popular Category
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters & Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder={`Search in ${selectedCategoryData?.name}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-3">
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="discount">Best Discounts</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="under-100">Under $100</SelectItem>
                        <SelectItem value="100-500">$100 - $500</SelectItem>
                        <SelectItem value="500-1000">$500 - $1000</SelectItem>
                        <SelectItem value="over-1000">Over $1000</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={minRating}
                      onValueChange={handleRatingChange}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="2">2+ Stars</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {categoryOffers.length} Products Found
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Updated 2 hours ago
                </div>
              </div>

              {categoryOffers.length > 0 ? (
                <div
                  className={cn(
                    "gap-6",
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "flex flex-col",
                  )}
                >
                  {categoryOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setFilters({ category: selectedCategory });
                      setSortBy("popular");
                      setPriceRange("all");
                      setMinRating("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* All Categories View */
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-[#1890ff] mb-2">
                  {categories.length}
                </div>
                <div className="text-gray-600">Total Categories</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {offers.length}
                </div>
                <div className="text-gray-600">Active Products</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  500+
                </div>
                <div className="text-gray-600">Verified Sellers</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  4.8★
                </div>
                <div className="text-gray-600">Average Rating</div>
              </Card>
            </div>

            {/* Category Tabs */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Categories</TabsTrigger>
                <TabsTrigger value="popular">Most Popular</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="new">Newest</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <CategoryGrid showAll={true} title="All Categories" />
              </TabsContent>

              <TabsContent value="popular">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      🔥 Most Popular Categories
                    </h3>
                    <p className="text-gray-600">
                      Categories with the most activity and highest ratings
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 8)
                      .map((category) => (
                        <Card
                          key={category.id}
                          className="group hover:shadow-xl transition-all duration-300 cursor-pointer"
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          <CardContent className="p-6 text-center">
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                              {category.icon}
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {category.count} offers
                            </p>
                            <Badge className="bg-orange-100 text-orange-700">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trending">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      📈 Trending Categories
                    </h3>
                    <p className="text-gray-600">
                      Categories gaining popularity this week
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories
                      .filter((cat) => cat.count > 120)
                      .map((category) => (
                        <Card
                          key={category.id}
                          className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-purple-50"
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          <CardContent className="p-6 text-center">
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                              {category.icon}
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {category.count} offers
                            </p>
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="new">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      ✨ Newest Categories
                    </h3>
                    <p className="text-gray-600">
                      Recently added categories with fresh products
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.slice(-6).map((category) => (
                      <Card
                        key={category.id}
                        className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-green-50 to-blue-50"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                            {category.icon}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {category.count} offers
                          </p>
                          <Badge className="bg-green-500 text-white">
                            <Clock className="h-3 w-3 mr-1" />
                            New
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
