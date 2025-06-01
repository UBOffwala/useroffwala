import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  Zap,
  Gift,
  Star,
  ArrowRight,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";
import { Header } from "@/components/Header";
import { OfferCard } from "@/components/OfferCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { filterOffers, searchOffers, getFeaturedOffers } from "@/lib/offers";
import { categories, offers } from "@/data/offers";
import { FilterOptions } from "@/types/offer";
import { cn } from "@/lib/utils";

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [displayedOffers, setDisplayedOffers] = useState(offers);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const searchQuery = searchParams.get("search");
  const categoryParam = searchParams.get("category");
  const featuredParam = searchParams.get("featured");
  const newParam = searchParams.get("new");
  const discountParam = searchParams.get("discount");

  useEffect(() => {
    let filtered = offers;

    // Handle URL parameters
    if (searchQuery) {
      filtered = searchOffers(searchQuery);
    } else if (categoryParam) {
      filtered = filterOffers({ category: categoryParam });
    } else if (featuredParam) {
      filtered = getFeaturedOffers();
    } else if (newParam) {
      filtered = offers.filter((offer) => offer.isNew);
    } else if (discountParam) {
      filtered = offers.filter((offer) => offer.discount && offer.discount > 0);
    } else {
      // Apply current filters
      filtered = filterOffers(filters);
    }

    setDisplayedOffers(filtered);
  }, [
    searchQuery,
    categoryParam,
    featuredParam,
    newParam,
    discountParam,
    filters,
  ]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // Clear URL params when using filters
    setSearchParams({});
  };

  const clearFilters = () => {
    setFilters({});
    setSearchParams({});
  };

  const featuredOffers = getFeaturedOffers().slice(0, 3);
  const trendingCategories = categories.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      {!searchQuery &&
        !categoryParam &&
        !featuredParam &&
        !newParam &&
        !discountParam && (
          <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
            <div className="container mx-auto px-4 py-16">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Discover Amazing
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Offers & Deals
                  </span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-blue-100">
                  Find the best products, services, and deals from verified
                  sellers worldwide
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Browse Featured
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8"
                  >
                    <Gift className="h-5 w-5 mr-2" />
                    Best Deals
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

      {/* Quick Stats */}
      {!searchQuery &&
        !categoryParam &&
        !featuredParam &&
        !newParam &&
        !discountParam && (
          <section className="py-8 bg-white border-b">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      1,200+
                    </div>
                    <div className="text-sm text-gray-600">Active Offers</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      4.8/5
                    </div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Gift className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-600">
                      Verified Sellers
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      {/* Featured Offers - Only show on homepage */}
      {!searchQuery &&
        !categoryParam &&
        !featuredParam &&
        !newParam &&
        !discountParam && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Featured Offers
                  </h2>
                  <p className="text-gray-600">
                    Handpicked deals you don't want to miss
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Categories Section - Only show on homepage */}
      {!searchQuery &&
        !categoryParam &&
        !featuredParam &&
        !newParam &&
        !discountParam && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Browse by Category
                </h2>
                <p className="text-gray-600">
                  Find exactly what you're looking for
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {trendingCategories.map((category) => (
                  <Card
                    key={category.id}
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                        {category.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.count} offers
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Main Content Area */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Results Header */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Sidebar Filters */}
            <div
              className={cn(
                "lg:w-80 lg:block",
                showFilters ? "block" : "hidden",
              )}
            >
              <CategoryFilter
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearFilters}
              />
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {searchQuery
                      ? `Search results for "${searchQuery}"`
                      : categoryParam
                        ? `${categories.find((c) => c.id === categoryParam)?.name} Offers`
                        : featuredParam
                          ? "Featured Offers"
                          : newParam
                            ? "New Arrivals"
                            : discountParam
                              ? "Best Deals"
                              : "All Offers"}
                  </h2>
                  <p className="text-gray-600">
                    {displayedOffers.length}{" "}
                    {displayedOffers.length === 1 ? "offer" : "offers"} found
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Offers Grid/List */}
              {displayedOffers.length > 0 ? (
                <div
                  className={cn(
                    "gap-6",
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                      : "flex flex-col",
                  )}
                >
                  {displayedOffers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      className={viewMode === "list" ? "flex flex-row" : ""}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Gift className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No offers found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button onClick={clearFilters}>Clear all filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Only show on homepage */}
      {!searchQuery &&
        !categoryParam &&
        !featuredParam &&
        !newParam &&
        !discountParam && (
          <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Stay Updated with Latest Offers
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Get notified about new deals, exclusive offers, and trending
                products
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                />
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6">
                  Subscribe
                </Button>
              </div>
            </div>
          </section>
        )}
    </div>
  );
}
