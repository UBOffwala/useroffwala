import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Share2,
  Star,
  MapPin,
  Verified,
  ShoppingBag,
  ArrowLeft,
  Clock,
  Shield,
  Truck,
  RotateCcw,
  MessageSquare,
  Store,
  UserPlus,
  UserCheck,
  Award,
  Users,
  Package,
} from "lucide-react";
import { getOfferById, formatPrice } from "@/lib/offers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OfferCard } from "@/components/OfferCard";
import { offers } from "@/data/offers";
import { shops } from "@/data/shops";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/contexts/WishlistContext";
import { useShop } from "@/contexts/ShopContext";
import { ReviewsSection } from "@/components/ReviewsSection";
import { toast } from "sonner";

export default function OfferDetails() {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { followShop, unfollowShop, isFollowing } = useShop();

  if (!id) {
    return <Navigate to="/404" replace />;
  }

  const offer = getOfferById(id);

  if (!offer) {
    return <Navigate to="/404" replace />;
  }

  const isLiked = isInWishlist(offer.id);

  // Find shop data for this offer
  const shop = shops.find((s) => s.name === offer.vendor.name);
  const isFollowingShop = shop ? isFollowing(shop.id) : false;

  const handleToggleWishlist = () => {
    if (isLiked) {
      removeFromWishlist(offer.id);
    } else {
      addToWishlist(offer);
    }
  };

  const handleToggleFollowShop = () => {
    if (!shop) return;

    if (isFollowingShop) {
      unfollowShop(shop.id);
      toast.success(`Unfollowed ${shop.name}`);
    } else {
      followShop(shop);
      toast.success(`Now following ${shop.name}!`);
    }
  };

  const relatedOffers = offers
    .filter((o) => o.id !== offer.id && o.category === offer.category)
    .slice(0, 4);

  const shopOffers = shop
    ? offers
        .filter((o) => o.vendor.name === shop.name && o.id !== offer.id)
        .slice(0, 3)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to={`/?category=${offer.category}`}
            className="hover:text-blue-600 transition-colors capitalize"
          >
            {offer.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{offer.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="relative mb-4">
                <img
                  src={offer.images[selectedImageIndex]}
                  alt={offer.title}
                  className="w-full h-96 object-cover rounded-lg"
                />

                {/* Image Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {offer.isNew && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white">
                      New
                    </Badge>
                  )}
                  {offer.isFeatured && (
                    <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
                      Featured
                    </Badge>
                  )}
                  {offer.discount && (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white">
                      -{offer.discount}% OFF
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white/90 hover:bg-white"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        isLiked ? "fill-red-500 text-red-500" : "text-gray-600",
                      )}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12"
                    onClick={handleToggleWishlist}
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 mr-2",
                        isLiked && "fill-current text-red-500",
                      )}
                    />
                    {isLiked ? "Remove from Wishlist" : "Save to Wishlist"}
                  </Button>

                  <Link
                    to={`/tickets/new?offer=${offer.id}`}
                    className="w-full"
                  >
                    <Button
                      variant="ghost"
                      className="w-full h-12 text-gray-600 hover:text-gray-700"
                    >
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Report Issue
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Image Thumbnails */}
              {offer.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {offer.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                        selectedImageIndex === index
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <img
                        src={image}
                        alt={`${offer.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Tabs */}
            <div className="bg-white rounded-lg p-6">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offer.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <ReviewsSection offerId={offer.id} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Purchase Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {offer.title}
                </h1>

                {/* Shop Information Section */}
                {shop ? (
                  <Card className="mb-6 border-blue-100 bg-blue-50/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={
                                shop.avatar ||
                                "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop"
                              }
                              alt={shop.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            {shop.verified && (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                <Verified className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Link
                              to={`/shop/${shop.id}`}
                              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {shop.name}
                            </Link>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-xs",
                                shop.businessType === "enterprise"
                                  ? "bg-purple-100 text-purple-700"
                                  : shop.businessType === "business"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700",
                              )}
                            >
                              {shop.businessType}
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {shop.description}
                          </p>

                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>
                                {shop.rating} ({shop.reviewCount} reviews)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="h-4 w-4 text-blue-500" />
                              <span>{shop.stats.followerCount} followers</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Package className="h-4 w-4 text-green-500" />
                              <span>{shop.totalOffers} offers</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4 text-orange-500" />
                              <span>Response: {shop.stats.responseTime}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <MapPin className="h-4 w-4" />
                            <span>{shop.location}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant={isFollowingShop ? "outline" : "default"}
                              size="sm"
                              onClick={handleToggleFollowShop}
                              className={cn(
                                "flex-1",
                                isFollowingShop &&
                                  "border-green-200 text-green-700 hover:bg-green-50",
                              )}
                            >
                              {isFollowingShop ? (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Following
                                </>
                              ) : (
                                <>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Follow Shop
                                </>
                              )}
                            </Button>
                            <Link to={`/shop/${shop.id}`}>
                              <Button variant="outline" size="sm">
                                <Store className="h-4 w-4 mr-2" />
                                Visit Shop
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {shopOffers.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            More from this shop:
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                            {shopOffers.map((shopOffer) => (
                              <Link
                                key={shopOffer.id}
                                to={`/offer/${shopOffer.id}`}
                                className="group"
                              >
                                <div className="relative overflow-hidden rounded-md">
                                  <img
                                    src={shopOffer.images[0]}
                                    alt={shopOffer.title}
                                    className="w-full h-20 object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                                </div>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-1 group-hover:text-blue-600">
                                  {shopOffer.title}
                                </p>
                                <p className="text-xs font-medium text-gray-900">
                                  {formatPrice(shopOffer.price)}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  // Fallback vendor info
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-700">{offer.vendor.name}</span>
                    {offer.vendor.verified && (
                      <Verified className="h-5 w-5 text-blue-500" />
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {offer.vendor.rating}
                      </span>
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(offer.price)}
                    </span>
                    {offer.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(offer.originalPrice)}
                      </span>
                    )}
                  </div>
                  {offer.originalPrice && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Save {formatPrice(offer.originalPrice - offer.price)}
                      </Badge>
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        {offer.discount}% OFF
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Location */}
                {offer.location && (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{offer.location}</span>
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(offer.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {offer.rating} ({offer.reviewCount} reviews)
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <Button className="w-full h-12 bg-gradient-to-r from-[#1890ff] to-[#722ed1] hover:from-[#1890ff]/90 hover:to-[#722ed1]/90 text-lg">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Contact Seller
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12"
                    onClick={handleToggleWishlist}
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 mr-2",
                        isLiked && "fill-current text-red-500",
                      )}
                    />
                    {isLiked ? "Remove from Wishlist" : "Save to Wishlist"}
                  </Button>
                </div>

                {/* Features */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Buyer Protection</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Truck className="h-4 w-4 text-blue-500" />
                    <span>Fast Delivery Available</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <RotateCcw className="h-4 w-4 text-purple-500" />
                    <span>Return Policy</span>
                  </div>
                  {offer.expiresAt && (
                    <div className="flex items-center gap-3 text-red-600">
                      <Clock className="h-4 w-4" />
                      <span>Offer expires soon</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Offers */}
        {relatedOffers.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Related Offers
              </h2>
              <Link
                to={`/?category=${offer.category}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View all in {offer.category}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedOffers.map((relatedOffer) => (
                <OfferCard key={relatedOffer.id} offer={relatedOffer} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
