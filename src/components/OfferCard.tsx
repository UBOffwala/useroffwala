import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Star,
  MapPin,
  Verified,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { Offer } from "@/types/offer";
import { formatPrice, getDiscountPercentage } from "@/lib/offers";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { useShop } from "@/contexts/ShopContext";
import { shops } from "@/data/shops";
import { toast } from "sonner";

interface OfferCardProps {
  offer: Offer;
  className?: string;
}

export function OfferCard({ offer, className }: OfferCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { followShop, unfollowShop, isFollowing } = useShop();
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

  const handleToggleFollowShop = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to offer details
    e.stopPropagation();

    if (!shop) return;

    if (isFollowingShop) {
      unfollowShop(shop.id);
      toast.success(`Unfollowed ${shop.name}`);
    } else {
      followShop(shop);
      toast.success(`Now following ${shop.name}!`);
    }
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border-gray-200",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <Link to={`/offer/${offer.id}`}>
          <img
            src={offer.images[0]}
            alt={offer.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
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

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3">
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/90 hover:bg-white shadow-sm"
            onClick={handleToggleWishlist}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600",
              )}
            />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <Link to={`/offer/${offer.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {offer.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {offer.shortDescription}
        </p>

        {/* Vendor info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            {shop ? (
              <Link
                to={`/shop/${shop.id}`}
                className="text-sm text-gray-600 hover:text-[#1890ff] transition-colors truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {offer.vendor.name}
              </Link>
            ) : (
              <span className="text-sm text-gray-600 truncate">
                {offer.vendor.name}
              </span>
            )}
            {offer.vendor.verified && (
              <Verified className="h-4 w-4 text-blue-500 flex-shrink-0" />
            )}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">
                {offer.vendor.rating}
              </span>
            </div>
          </div>

          {shop && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFollowShop}
              className={cn(
                "h-6 px-2 text-xs",
                isFollowingShop
                  ? "text-green-600 hover:text-green-700"
                  : "text-gray-500 hover:text-[#1890ff]",
              )}
            >
              {isFollowingShop ? (
                <UserCheck className="h-3 w-3" />
              ) : (
                <UserPlus className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
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

        {/* Location */}
        {offer.location && (
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin className="h-4 w-4" />
            <span>{offer.location}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(offer.price)}
          </span>
          {offer.originalPrice && (
            <span className="text-lg text-gray-500 line-through">
              {formatPrice(offer.originalPrice)}
            </span>
          )}
          {offer.discount && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
              Save {formatPrice(offer.originalPrice! - offer.price)}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Link to={`/offer/${offer.id}`} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
