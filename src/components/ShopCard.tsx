import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Verified,
  Store,
  Users,
  Package,
  UserPlus,
  UserCheck,
  Clock,
} from "lucide-react";
import { Shop } from "@/types/shop";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useShop } from "@/contexts/ShopContext";
import { toast } from "sonner";

interface ShopCardProps {
  shop: Shop;
  className?: string;
  isListView?: boolean;
}

export function ShopCard({
  shop,
  className,
  isListView = false,
}: ShopCardProps) {
  const { followShop, unfollowShop, isFollowing } = useShop();
  const isFollowingShop = isFollowing(shop.id);

  const handleToggleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFollowingShop) {
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

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border-gray-200",
        isListView && "flex",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          isListView ? "w-48 flex-shrink-0" : "",
        )}
      >
        <Link to={`/shop/${shop.id}`}>
          <img
            src={
              shop.coverImage ||
              shop.avatar ||
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop"
            }
            alt={shop.name}
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-105",
              isListView ? "w-full h-32" : "w-full h-40",
            )}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {shop.verified && (
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
              <Verified className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          <Badge
            variant="secondary"
            className={getBusinessTypeColor(shop.businessType)}
          >
            {shop.businessType}
          </Badge>
        </div>

        {/* Follow Button */}
        <div className="absolute top-3 right-3">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white shadow-sm"
            onClick={handleToggleFollow}
          >
            {isFollowingShop ? (
              <UserCheck className="h-4 w-4 text-green-600" />
            ) : (
              <UserPlus className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </div>
      </div>

      <CardContent className={cn("p-4", isListView && "flex-1")}>
        <Link to={`/shop/${shop.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {shop.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {shop.description}
        </p>

        {/* Rating and Stats */}
        <div className="flex items-center gap-4 mb-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{shop.rating}</span>
            <span className="text-gray-500">({shop.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="h-4 w-4 text-blue-500" />
            <span>{shop.stats?.followerCount || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Package className="h-4 w-4 text-green-500" />
            <span>{shop.totalOffers}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{shop.location}</span>
        </div>

        {/* Response Time */}
        {shop.stats?.responseTime && (
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <Clock className="h-4 w-4" />
            <span>Responds in {shop.stats.responseTime}</span>
          </div>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {shop.categories.slice(0, 3).map((category) => (
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

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/shop/${shop.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Store className="h-4 w-4 mr-2" />
              Visit Shop
            </Button>
          </Link>
          <Button
            variant={isFollowingShop ? "default" : "outline"}
            onClick={handleToggleFollow}
            className={cn(
              "flex-shrink-0",
              isFollowingShop && "bg-green-600 hover:bg-green-700",
            )}
          >
            {isFollowingShop ? (
              <UserCheck className="h-4 w-4" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
