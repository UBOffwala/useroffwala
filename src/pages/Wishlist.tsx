import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Grid3X3,
  List,
  Trash2,
  ShoppingBag,
  Share2,
  Filter,
  SortAsc,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OfferCard } from "@/components/OfferCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { categories } from "@/data/offers";
import { formatPrice } from "@/lib/offers";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist, wishlistCount } =
    useWishlist();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "newest" | "price-low" | "price-high" | "name"
  >("newest");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Filter and sort wishlist items
  const filteredAndSortedWishlist = wishlist
    .filter(
      (item) => filterCategory === "all" || item.category === filterCategory,
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.title.localeCompare(b.title);
        case "newest":
        default:
          return b.isNew ? 1 : -1;
      }
    });

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to remove all items from your wishlist?",
      )
    ) {
      clearWishlist();
    }
  };

  const totalValue = wishlist.reduce((sum, item) => sum + item.price, 0);
  const uniqueCategories = [...new Set(wishlist.map((item) => item.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Wishlist Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500 fill-current" />
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {wishlistCount === 0
                  ? "You haven't saved any offers yet"
                  : `${wishlistCount} ${wishlistCount === 1 ? "item" : "items"} saved`}
              </p>
            </div>

            {wishlistCount > 0 && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Wishlist
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearAll}
                  className="gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {/* Wishlist Stats */}
          {wishlistCount > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {wishlistCount}
                  </div>
                  <div className="text-sm text-gray-600">Total Items</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(totalValue)}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {uniqueCategories.length}
                  </div>
                  <div className="text-sm text-gray-600">Categories</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatPrice(
                      wishlist.reduce(
                        (sum, item) =>
                          sum +
                          (item.originalPrice
                            ? item.originalPrice - item.price
                            : 0),
                        0,
                      ),
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Total Savings</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {wishlistCount === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Your wishlist is empty
                </h2>
                <p className="text-gray-600">
                  Start browsing and save your favorite offers to see them here.
                </p>
              </div>

              <div className="space-y-4">
                <Link to="/">
                  <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <ShoppingBag className="h-4 w-4" />
                    Browse Offers
                  </Button>
                </Link>

                <div className="grid grid-cols-2 gap-2 mt-6">
                  <Link to="/?featured=true">
                    <Button variant="outline" className="w-full">
                      Featured Deals
                    </Button>
                  </Link>
                  <Link to="/?discount=true">
                    <Button variant="outline" className="w-full">
                      Best Discounts
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Wishlist Content */
          <div className="space-y-6">
            {/* Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Category Filter */}
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <Select
                        value={filterCategory}
                        onValueChange={setFilterCategory}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.icon} {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                      <SortAsc className="h-4 w-4 text-gray-500" />
                      <Select
                        value={sortBy}
                        onValueChange={(value: any) => setSortBy(value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="price-low">
                            Price: Low to High
                          </SelectItem>
                          <SelectItem value="price-high">
                            Price: High to Low
                          </SelectItem>
                          <SelectItem value="name">Name A-Z</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* View Mode Toggle */}
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
              </CardContent>
            </Card>

            {/* Results Info */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredAndSortedWishlist.length} of {wishlistCount}{" "}
                items
                {filterCategory !== "all" && (
                  <span className="ml-1">
                    in {categories.find((c) => c.id === filterCategory)?.name}
                  </span>
                )}
              </p>

              {filterCategory !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterCategory("all")}
                  className="text-blue-600"
                >
                  Clear filter
                </Button>
              )}
            </div>

            {/* Wishlist Items */}
            <div
              className={cn(
                "gap-6",
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "flex flex-col",
              )}
            >
              {filteredAndSortedWishlist.map((offer) => (
                <div key={offer.id} className="relative group">
                  <OfferCard
                    offer={offer}
                    className={cn(
                      "transition-all duration-200",
                      viewMode === "list" && "flex flex-row",
                    )}
                  />

                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={() => removeFromWishlist(offer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {filteredAndSortedWishlist.length === 0 &&
              filterCategory !== "all" && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Filter className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No items in this category
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any saved items in the{" "}
                    {categories.find((c) => c.id === filterCategory)?.name}{" "}
                    category.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setFilterCategory("all")}
                  >
                    Show all items
                  </Button>
                </div>
              )}

            {/* Continue Shopping */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Discover More Amazing Offers
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse our latest deals and add more items to your wishlist
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/?featured=true">
                    <Button variant="outline" className="gap-2">
                      <Heart className="h-4 w-4" />
                      Featured Offers
                    </Button>
                  </Link>
                  <Link to="/?new=true">
                    <Button variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Arrivals
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Browse All <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
