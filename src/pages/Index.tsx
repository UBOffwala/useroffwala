import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  Zap,
  Gift,
  Star,
  ArrowRight,
  Filter,
  Grid3X3,
  List,
  Store,
  Package,
  MapPin,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OfferCard } from "@/components/OfferCard";
import { ShopCard } from "@/components/ShopCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { PromoBannerSection } from "@/components/PromoBanner";
import { HorizontalBanners } from "@/components/HorizontalBanners";
import { CategoryGrid } from "@/components/CategoryGrid";
import { TopDealsSection } from "@/components/TopDealsSection";
import { filterOffers, getFeaturedOffers } from "@/lib/offers";
import {
  performSearch,
  getLocationSuggestions,
  ShopFilters,
} from "@/lib/search";
import { categories, offers } from "@/data/offers";
import { FilterOptions } from "@/types/offer";
import { Shop } from "@/types/shop";
import { cn } from "@/lib/utils";

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [shopFilters, setShopFilters] = useState<ShopFilters>({});
  const [displayedOffers, setDisplayedOffers] = useState(offers);
  const [displayedShops, setDisplayedShops] = useState<Shop[]>([]);
  const [showingShops, setShowingShops] = useState(false);
  const [searchType, setSearchType] = useState<"offers" | "shops" | "mixed">(
    "offers",
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const searchQuery = searchParams.get("search");
  const categoryParam = searchParams.get("category");
  const featuredParam = searchParams.get("featured");
  const newParam = searchParams.get("new");
  const discountParam = searchParams.get("discount");
  const vendorParam = searchParams.get("vendor");

  const { cities, states } = getLocationSuggestions();

  useEffect(() => {
    let filteredOffers = offers;
    let filteredShops: Shop[] = [];
    let currentSearchType: "offers" | "shops" | "mixed" = "offers";
    let currentShowingShops = false;

    // Handle URL parameters
    if (searchQuery) {
      const searchResults = performSearch(searchQuery, shopFilters);
      filteredOffers = searchResults.offers;
      filteredShops = searchResults.shops;
      currentSearchType = searchResults.searchType;
      currentShowingShops =
        searchResults.isShopSearch || searchResults.searchType === "mixed";
    } else if (categoryParam) {
      filteredOffers = filterOffers({ category: categoryParam });
    } else if (featuredParam) {
      filteredOffers = getFeaturedOffers();
    } else if (newParam) {
      filteredOffers = offers.filter((offer) => offer.isNew);
    } else if (discountParam) {
      filteredOffers = offers.filter(
        (offer) => offer.discount && offer.discount > 0,
      );
    } else if (vendorParam) {
      filteredOffers = offers.filter(
        (offer) =>
          offer.vendor.name.toLowerCase() ===
          decodeURIComponent(vendorParam).toLowerCase(),
      );
    } else {
      // Apply current filters
      filteredOffers = filterOffers(filters);
    }

    setDisplayedOffers(filteredOffers);
    setDisplayedShops(filteredShops);
    setShowingShops(currentShowingShops);
    setSearchType(currentSearchType);
  }, [
    searchQuery,
    categoryParam,
    featuredParam,
    newParam,
    discountParam,
    vendorParam,
    filters,
    shopFilters,
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

  const isHomePage =
    !searchQuery &&
    !categoryParam &&
    !featuredParam &&
    !newParam &&
    !discountParam &&
    !vendorParam;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      {isHomePage && (
        <section className="bg-gradient-to-r from-[#1890ff] via-[#722ed1] to-[#eb2f96] text-white">
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
                  className="bg-white text-[#1890ff] hover:bg-gray-100 text-lg px-8"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Browse Featured
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#1890ff] text-lg px-8"
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
      {isHomePage && (
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-[#1890ff]/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-[#1890ff]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">1000+</div>
                  <div className="text-sm text-gray-600">Active Offers</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">4.8/5</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Gift className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Verified Sellers</div>
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

      {/* Homepage Sections */}
      {isHomePage && <HorizontalBanners />}
      {isHomePage && (
        <div className="container mx-auto px-4">
          <PromoBannerSection />
        </div>
      )}
      {isHomePage && <TopDealsSection />}

      {/* Featured Offers - Only show on homepage */}
      {isHomePage && (
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
      {isHomePage && (
        <div className="bg-white">
          <CategoryGrid />
        </div>
      )}

      {/* Main Content Area - Search Results */}
      {!isHomePage && (
        <section className="py-8">
          <div className="container mx-auto px-4">
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
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Filters</h3>

                  {showingShops && (
                    <>
                      {/* Shop Location Filters */}
                      <div className="space-y-4 mb-6">
                        <h4 className="font-medium text-sm">Location</h4>
                        <div className="space-y-3">
                      <Select
                        value={shopFilters.rating?.toString() || "any"}
                        onValueChange={(value) =>
                          setShopFilters(prev => ({ ...prev, rating: value === "any" ? undefined : Number(value) }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any Rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Rating</SelectItem>
                          <SelectItem value="4">4+ Stars</SelectItem>
                          <SelectItem value="4.5">4.5+ Stars</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                        </SelectContent>
                      </Select>
                      </div>

                      {/* Shop Rating Filter */}
                      <div className="space-y-4 mb-6">
                        <h4 className="font-medium text-sm">Minimum Rating</h4>
                        <Select
                          value={shopFilters.rating?.toString() || ""}
                          onValueChange={(value) =>
                            setShopFilters((prev) => ({
                              ...prev,
                              rating: value ? Number(value) : undefined,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Any Rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Any Rating</SelectItem>
                            <SelectItem value="4">4+ Stars</SelectItem>
                            <SelectItem value="4.5">4.5+ Stars</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Verified Shops Only */}
                      <div className="space-y-4 mb-6">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={shopFilters.verified || false}
                            onChange={(e) =>
                              setShopFilters((prev) => ({
                                ...prev,
                                verified: e.target.checked ? true : undefined,
                              }))
                            }
                            className="rounded"
                          />
                          <span className="text-sm">Verified shops only</span>
                        </label>
                      </div>

                      {/* Clear Shop Filters */}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShopFilters({})}
                      >
                        Clear Shop Filters
                      </Button>
                    </>
                  )}

                  {!showingShops && (
                    <CategoryFilter
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onClearFilters={clearFilters}
                    />
                  )}
                </Card>
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
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {searchType === "mixed" || searchType === "offers" ? (
                        <span>
                          {displayedOffers.length}{" "}
                          {displayedOffers.length === 1 ? "offer" : "offers"}
                        </span>
                      ) : null}
                      {searchType === "mixed" || searchType === "shops" ? (
                        <span>
                          {displayedShops.length}{" "}
                          {displayedShops.length === 1 ? "shop" : "shops"}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Sort Options for Shops */}
                    {showingShops && (
                      <Select
                        value={shopFilters.sortBy || "relevance"}
                        onValueChange={(value) =>
                          setShopFilters((prev) => ({
                            ...prev,
                            sortBy: value as any,
                          }))
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                          <SelectItem value="followers">Followers</SelectItem>
                          <SelectItem value="offers">Most Offers</SelectItem>
                          <SelectItem value="alphabetical">A-Z</SelectItem>
                          <SelectItem value="newest">Newest</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

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

                {/* Search Results Tabs for Mixed Results */}
                {searchType === "mixed" && (
                  <div className="flex gap-2 mb-6">
                    <Button
                      variant={!showingShops ? "default" : "outline"}
                      className="gap-2"
                      onClick={() => setShowingShops(false)}
                    >
                      <Package className="h-4 w-4" />
                      Offers ({displayedOffers.length})
                    </Button>
                    <Button
                      variant={showingShops ? "default" : "outline"}
                      className="gap-2"
                      onClick={() => setShowingShops(true)}
                    >
                      <Store className="h-4 w-4" />
                      Shops ({displayedShops.length})
                    </Button>
                  </div>
                )}

                {/* Shops Results */}
                {showingShops && displayedShops.length > 0 && (
                  <div
                    className={cn(
                      "gap-6",
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "flex flex-col",
                    )}
                  >
                    {displayedShops.map((shop) => (
                      <ShopCard
                        key={shop.id}
                        shop={shop}
                        isListView={viewMode === "list"}
                      />
                    ))}
                  </div>
                )}

                {/* Offers Results */}
                {!showingShops && displayedOffers.length > 0 && (
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
                )}

                {/* No Results */}
                {(!showingShops && displayedOffers.length === 0) ||
                (showingShops && displayedShops.length === 0) ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      {showingShops ? (
                        <Store className="h-16 w-16 mx-auto" />
                      ) : (
                        <Gift className="h-16 w-16 mx-auto" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No {showingShops ? "shops" : "offers"} found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <Button
                      onClick={() => {
                        if (showingShops) {
                          setShopFilters({});
                        } else {
                          clearFilters();
                        }
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section - Only show on homepage */}
      {isHomePage && (
        <section className="py-16 bg-gradient-to-r from-[#1890ff] to-[#722ed1] text-white">
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
                className="flex-1 px-4 py-2 rounded-lg text-gray-900"
              />
              <Button className="bg-white text-[#1890ff] hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}