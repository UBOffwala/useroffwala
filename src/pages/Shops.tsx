import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Verified,
  Users,
  Package,
  Grid3X3,
  List,
  Search,
  Filter,
  TrendingUp,
  Award,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { shops } from "@/data/shops";
import { useShop } from "@/contexts/ShopContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Shops() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBusinessType, setSelectedBusinessType] =
    useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredShops, setFilteredShops] = useState(shops);
  const { followShop, unfollowShop, isFollowing } = useShop();

  // Get unique categories from all shops
  const allCategories = Array.from(
    new Set(shops.flatMap((shop) => shop.categories)),
  ).sort();

  // Filter and sort shops
  useEffect(() => {
    let filtered = [...shops];

    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (shop) =>
          shop.name.toLowerCase().includes(lowerSearchTerm) ||
          shop.description.toLowerCase().includes(lowerSearchTerm) ||
          shop.location.toLowerCase().includes(lowerSearchTerm) ||
          shop.categories.some((cat) =>
            cat.toLowerCase().includes(lowerSearchTerm),
          ),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((shop) =>
        shop.categories.some((cat) =>
          cat.toLowerCase().includes(selectedCategory.toLowerCase()),
        ),
      );
    }

    // Filter by business type
    if (selectedBusinessType !== "all") {
      filtered = filtered.filter(
        (shop) => shop.businessType === selectedBusinessType,
      );
    }

    // Sort shops
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "followers":
        filtered.sort((a, b) => b.stats.followerCount - a.stats.followerCount);
        break;
      case "offers":
        filtered.sort((a, b) => b.totalOffers - a.totalOffers);
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredShops(filtered);
  }, [searchTerm, selectedCategory, selectedBusinessType, sortBy]);

  const handleToggleFollow = (shop: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFollowing(shop.id)) {
      unfollowShop(shop.id);
      toast.success(`Unfollowed ${shop.name}`);
    } else {
      followShop(shop);
      toast.success(`Now following ${shop.name}!`);
    }
  };

  const getBusinessTypeColor = (type: string) => {
    switch (type) {
      case "enterprise":
        return "bg-purple-100 text-purple-700";
      case "business":
        return "bg-blue-100 text-blue-700";
      case "individual":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const ShopCard = ({
    shop,
    isListView = false,
  }: {
    shop: any;
    isListView?: boolean;
  }) => (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        isListView && "flex",
      )}
    >
      <div className={cn("relative", isListView ? "w-48 flex-shrink-0" : "")}>
        <Link to={`/shop/${shop.id}`}>
          <img
            src={shop.coverImage}
            alt={shop.name}
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-105",
              isListView ? "w-full h-32" : "w-full h-40",
            )}
          />
        </Link>

        {shop.verified && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
              <Verified className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>
        )}

        <Button
          variant="secondary"
          size="sm"
          className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-sm"
          onClick={(e) => handleToggleFollow(shop, e)}
        >
          {isFollowing(shop.id) ? (
            <UserCheck className="h-4 w-4 text-green-600" />
          ) : (
            <UserPlus className="h-4 w-4 text-gray-600" />
          )}
        </Button>
      </div>

      <CardContent className={cn("p-4", isListView && "flex-1")}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <Link to={`/shop/${shop.id}`}>
              <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                {shop.name}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="secondary"
                className={getBusinessTypeColor(shop.businessType)}
              >
                {shop.businessType}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{shop.rating}</span>
                <span className="text-xs text-gray-500">
                  ({shop.reviewCount})
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {shop.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4 text-blue-500" />
            <span>{shop.stats.followerCount} followers</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="h-4 w-4 text-green-500" />
            <span>{shop.totalOffers} offers</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{shop.location}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {shop.categories.slice(0, 3).map((category: string) => (
            <Badge key={category} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
          {shop.categories.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{shop.categories.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Link to={`/shop/${shop.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Store className="h-4 w-4 mr-2" />
              Visit Shop
            </Button>
          </Link>
          <Button
            variant={isFollowing(shop.id) ? "default" : "outline"}
            onClick={(e) => handleToggleFollow(shop, e)}
            className={cn(
              "flex-shrink-0",
              isFollowing(shop.id) && "bg-green-600 hover:bg-green-700",
            )}
          >
            {isFollowing(shop.id) ? (
              <UserCheck className="h-4 w-4" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Amazing Shops
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Find trusted sellers and premium brands offering quality products
              and services
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">{shops.length}+</div>
                <div className="text-purple-200">Active Shops</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {shops.reduce((sum, shop) => sum + shop.totalOffers, 0)}+
                </div>
                <div className="text-purple-200">Total Offers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {shops.filter((shop) => shop.verified).length}
                </div>
                <div className="text-purple-200">Verified Shops</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search shops by name, category, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedBusinessType}
                onValueChange={setSelectedBusinessType}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Business Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="followers">Most Followers</SelectItem>
                  <SelectItem value="offers">Most Offers</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredShops.length} of {shops.length} shops
              {searchTerm && ` for "${searchTerm}"`}
            </p>

            {(searchTerm ||
              selectedCategory !== "all" ||
              selectedBusinessType !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedBusinessType("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Shops Grid/List */}
        {filteredShops.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4",
            )}
          >
            {filteredShops.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                isListView={viewMode === "list"}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No shops found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedBusinessType("all");
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
