import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Store,
  Star,
  MapPin,
  Users,
  Package,
  Heart,
  Search,
  Filter,
  Verified,
  MessageSquare,
  ExternalLink,
  Grid3X3,
  List,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useShop } from "@/contexts/ShopContext";
import { Shop } from "@/types/shop";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function FollowedShops() {
  const { followedShops, unfollowShop } = useShop();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter and sort shops
  const filteredShops = followedShops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "verified" && shop.verified) ||
      (filterBy === "business" && shop.businessType === "business") ||
      (filterBy === "individual" && shop.businessType === "individual");

    return matchesSearch && matchesFilter;
  });

  const sortedShops = [...filteredShops].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.name.localeCompare(b.name);
      case "rating":
        return b.rating - a.rating;
      case "followers":
        return (b.stats?.followerCount || 0) - (a.stats?.followerCount || 0);
      case "offers":
        return b.totalOffers - a.totalOffers;
      case "newest":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  const handleUnfollow = (shop: Shop) => {
    unfollowShop(shop.id);
    toast.success(`Unfollowed ${shop.name}`);
  };

  const renderShopCard = (shop: Shop) => (
    <Card key={shop.id} className="hover:shadow-md transition-shadow">
      <CardContent
        className={cn("p-6", viewMode === "list" && "flex items-center gap-6")}
      >
        {/* Shop Avatar and Basic Info */}
        <div
          className={cn(
            "flex gap-4 mb-4",
            viewMode === "list" && "flex-1 mb-0",
          )}
        >
          <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-[#1890ff] to-[#722ed1] flex items-center justify-center text-white font-bold text-xl overflow-hidden flex-shrink-0">
            {shop.avatar ? (
              <img
                src={shop.avatar}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
            ) : (
              shop.name.charAt(0)
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link
                to={`/shop/${shop.id}`}
                className="font-semibold text-lg hover:text-[#1890ff] transition-colors truncate"
              >
                {shop.name}
              </Link>
              {shop.verified && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  <Verified className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            <p
              className={cn(
                "text-gray-600 text-sm mb-3 line-clamp-2",
                viewMode === "list" && "line-clamp-1",
              )}
            >
              {shop.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{shop.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>
                  {shop.city}, {shop.state}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                <span>{shop.totalOffers} offers</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{shop.stats?.followerCount || 0} followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories and Actions */}
        <div
          className={cn(
            "space-y-3",
            viewMode === "list" && "flex items-center gap-4 space-y-0",
          )}
        >
          {/* Categories */}
          <div className="flex flex-wrap gap-1">
            {shop.categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
            {shop.categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{shop.categories.length - 3} more
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link to={`/shop/${shop.id}`}>
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#1890ff] to-[#722ed1] hover:from-[#1890ff]/90 hover:to-[#722ed1]/90"
              >
                <Store className="w-3 h-3 mr-1" />
                Visit Shop
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUnfollow(shop)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Heart className="w-3 h-3 mr-1 fill-current" />
              Unfollow
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-[#1890ff]" />
            Followed Shops ({followedShops.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {followedShops.length > 0 ? (
            <>
              {/* Search and Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search followed shops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Recently Followed</SelectItem>
                      <SelectItem value="alphabetical">A-Z</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="followers">Most Followers</SelectItem>
                      <SelectItem value="offers">Most Offers</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Shops</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-1 border rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Shops Grid/List */}
              {sortedShops.length > 0 ? (
                <div
                  className={cn(
                    "gap-6",
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                      : "flex flex-col gap-4",
                  )}
                >
                  {sortedShops.map(renderShopCard)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-1">
                    No shops found
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No followed shops yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start following shops to see them here. You'll get updates on
                their new offers and deals.
              </p>
              <Link to="/">
                <Button className="bg-gradient-to-r from-[#1890ff] to-[#722ed1] hover:from-[#1890ff]/90 hover:to-[#722ed1]/90">
                  <Store className="w-4 h-4 mr-2" />
                  Discover Shops
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {followedShops.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Following Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {followedShops.length}
                </div>
                <div className="text-xs text-gray-600">Total Shops</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {followedShops.filter((s) => s.verified).length}
                </div>
                <div className="text-xs text-gray-600">Verified</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">
                  {followedShops.reduce((sum, s) => sum + s.totalOffers, 0)}
                </div>
                <div className="text-xs text-gray-600">Total Offers</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">
                  {followedShops.length > 0
                    ? (
                        followedShops.reduce((sum, s) => sum + s.rating, 0) /
                        followedShops.length
                      ).toFixed(1)
                    : "0"}
                  ★
                </div>
                <div className="text-xs text-gray-600">Avg Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
