import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
  Calendar,
  Users,
  Package,
  Clock,
  Verified,
  Phone,
  Mail,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Heart,
  MessageSquare,
  Share2,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Award,
  Shield,
  Truck,
  RotateCcw,
  ExternalLink,
  User,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OfferCard } from "@/components/OfferCard";
import { getShopById } from "@/data/shops";
import { useShop } from "@/contexts/ShopContext";
import { offers } from "@/data/offers";
import { Offer } from "@/types/offer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ShopPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("offers");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [shopOffers, setShopOffers] = useState<Offer[]>([]);

  const { followShop, unfollowShop, isFollowing } = useShop();

  if (!id) {
    return <Navigate to="/404" replace />;
  }

  const shop = getShopById(id);

  if (!shop) {
    return <Navigate to="/404" replace />;
  }

  const isFollowingShop = isFollowing(shop.id);

  // Get offers from this shop
  useEffect(() => {
    const shopOffersData = offers.filter(
      (offer) => offer.vendor.name === shop.name,
    );
    setShopOffers(shopOffersData);
  }, [shop.name]);

  const handleFollowToggle = () => {
    if (isFollowingShop) {
      unfollowShop(shop.id);
      toast.success(`Unfollowed ${shop.name}`);
    } else {
      followShop(shop);
      toast.success(`Now following ${shop.name}!`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shop.name,
        text: shop.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Shop link copied to clipboard!");
    }
  };

  const sortedOffers = [...shopOffers].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "discount":
        return (b.discount || 0) - (a.discount || 0);
      case "newest":
      default:
        // Sort by featured first, then new, then by ID (as a proxy for newest)
        if (b.isFeatured !== a.isFeatured) return b.isFeatured ? 1 : -1;
        if (b.isNew !== a.isNew) return b.isNew ? 1 : -1;
        return parseInt(b.id) - parseInt(a.id);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Shop Header */}
        <div className="mb-8">
          <Card className="overflow-hidden border-0 shadow-xl">
            {/* Cover Image */}
            {shop.coverImage && (
              <div className="h-48 md:h-64 bg-gradient-to-r from-[#1890ff] to-[#722ed1] relative overflow-hidden">
                <img
                  src={shop.coverImage}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            )}

            <CardContent className="p-8 -mt-16 relative">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                {/* Shop Avatar and Basic Info */}
                <div className="flex items-start gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 rounded-2xl bg-white shadow-xl overflow-hidden border-4 border-white">
                      {shop.avatar ? (
                        <img
                          src={shop.avatar}
                          alt={shop.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-[#1890ff] to-[#722ed1] flex items-center justify-center text-white text-2xl font-bold">
                          {shop.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    {shop.verified && (
                      <div className="absolute -bottom-2 -right-2">
                        <div className="bg-green-500 rounded-full p-2 border-4 border-white">
                          <Verified className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {shop.name}
                      </h1>
                      <div className="flex gap-2">
                        {shop.verified && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            <Verified className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge variant="outline" className="capitalize">
                          {shop.businessType}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 max-w-2xl leading-relaxed">
                      {shop.description}
                    </p>

                    <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{shop.rating}</span>
                        <span>({shop.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{shop.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        <span>{shop.totalOffers} offers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{shop.stats?.followerCount || 0} followers</span>
                      </div>
                      {shop.establishedYear && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Est. {shop.establishedYear}</span>
                        </div>
                      )}
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {shop.categories.map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="text-xs"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 lg:ml-auto">
                  <Button
                    onClick={handleFollowToggle}
                    className={cn(
                      "gap-2 min-w-32",
                      isFollowingShop
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gradient-to-r from-[#1890ff] to-[#722ed1] hover:from-[#1890ff]/90 hover:to-[#722ed1]/90",
                    )}
                    variant={isFollowingShop ? "outline" : "default"}
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4",
                        isFollowingShop && "fill-current",
                      )}
                    />
                    {isFollowingShop ? "Following" : "Follow"}
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shop Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="offers" className="gap-2">
              <Package className="w-4 h-4" />
              Offers ({shopOffers.length})
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2">
              <Store className="w-4 h-4" />
              About
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="w-4 h-4" />
              Reviews ({shop.reviewCount})
            </TabsTrigger>
            <TabsTrigger value="policies" className="gap-2">
              <Shield className="w-4 h-4" />
              Policies
            </TabsTrigger>
          </TabsList>

          {/* Offers Tab */}
          <TabsContent value="offers" className="space-y-6">
            {/* Sort and View Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="discount">Best Deals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

            {/* Offers Grid */}
            {sortedOffers.length > 0 ? (
              <div
                className={cn(
                  "gap-6",
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "flex flex-col",
                )}
              >
                {sortedOffers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    className={viewMode === "list" ? "flex flex-row" : ""}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No offers available
                </h3>
                <p className="text-gray-600">
                  This shop hasn't posted any offers yet.
                </p>
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Shop Stats and Business Info */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Shop Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {shop.stats?.totalSales || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Sales</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {shop.stats?.followerCount || 0}
                      </div>
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {shopOffers.length}
                      </div>
                      <div className="text-sm text-gray-600">Active Offers</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {shop.rating}★
                      </div>
                      <div className="text-sm text-gray-600">
                        Average Rating
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Business Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>
                          Response time: {shop.stats?.responseTime || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-500" />
                        <span>
                          Shipping: {shop.stats?.averageShippingTime || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-gray-500" />
                        <span>Business type: {shop.businessType}</span>
                      </div>
                      {shop.establishedYear && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>Established: {shop.establishedYear}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Seller Information */}
                  {shop.sellerInfo && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h4 className="font-semibold">Seller Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {shop.sellerInfo.ownerName && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span>Owner: {shop.sellerInfo.ownerName}</span>
                            </div>
                          )}
                          {shop.sellerInfo.experience && (
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-gray-500" />
                              <span>
                                Experience: {shop.sellerInfo.experience}
                              </span>
                            </div>
                          )}
                          {shop.sellerInfo.businessLicense && (
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-gray-500" />
                              <span>
                                License: {shop.sellerInfo.businessLicense}
                              </span>
                            </div>
                          )}
                          {shop.sellerInfo.languages && (
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-500" />
                              <span>
                                Languages:{" "}
                                {shop.sellerInfo.languages.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>

                        {shop.sellerInfo.specializations && (
                          <div>
                            <h5 className="font-medium mb-2">
                              Specializations
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {shop.sellerInfo.specializations.map((spec) => (
                                <Badge
                                  key={spec}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {shop.sellerInfo.certifications && (
                          <div>
                            <h5 className="font-medium mb-2">Certifications</h5>
                            <div className="flex flex-wrap gap-2">
                              {shop.sellerInfo.certifications.map((cert) => (
                                <Badge
                                  key={cert}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  <Award className="w-3 h-3 mr-1" />
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information and Working Hours */}
              <div className="space-y-6">
                {/* Working Hours */}
                {shop.workingHours && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Working Hours
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(shop.workingHours).map(([day, hours]) => {
                        if (day === "timezone" || day === "note" || !hours)
                          return null;
                        const isToday = new Date()
                          .toLocaleLowerCase()
                          .includes(day.toLowerCase());
                        return (
                          <div
                            key={day}
                            className={cn(
                              "flex justify-between text-sm",
                              isToday && "font-medium text-blue-600",
                            )}
                          >
                            <span className="capitalize">{day}</span>
                            <span>{hours}</span>
                          </div>
                        );
                      })}
                      {shop.workingHours.timezone && (
                        <div className="pt-2 border-t text-xs text-gray-500">
                          Timezone: {shop.workingHours.timezone}
                        </div>
                      )}
                      {shop.workingHours.note && (
                        <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
                          {shop.workingHours.note}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {shop.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <a
                          href={`tel:${shop.phone}`}
                          className="text-sm hover:text-[#1890ff]"
                        >
                          {shop.phone}
                        </a>
                      </div>
                    )}

                    {shop.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <a
                          href={`mailto:${shop.email}`}
                          className="text-sm hover:text-[#1890ff]"
                        >
                          {shop.email}
                        </a>
                      </div>
                    )}

                    {shop.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <a
                          href={shop.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:text-[#1890ff] flex items-center gap-1"
                        >
                          Visit Website
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <Separator />

                    {/* Social Links */}
                    <div>
                      <h5 className="font-medium mb-3">Follow Us</h5>
                      <div className="flex gap-2">
                        {shop.socialLinks?.facebook && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={shop.socialLinks.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Facebook className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {shop.socialLinks?.twitter && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={shop.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Twitter className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {shop.socialLinks?.instagram && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={shop.socialLinks.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Instagram className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Shop Reviews Coming Soon
              </h3>
              <p className="text-gray-600">
                Customer reviews for this shop will be displayed here.
              </p>
            </div>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shop.policies?.returnPolicy && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RotateCcw className="w-5 h-5 text-blue-600" />
                      Return Policy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {shop.policies.returnPolicy}
                    </p>
                  </CardContent>
                </Card>
              )}

              {shop.policies?.shippingPolicy && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-green-600" />
                      Shipping Policy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {shop.policies.shippingPolicy}
                    </p>
                  </CardContent>
                </Card>
              )}

              {shop.policies?.privacyPolicy && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      Privacy Policy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {shop.policies.privacyPolicy}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
