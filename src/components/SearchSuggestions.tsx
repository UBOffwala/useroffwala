import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Package,
  Tag,
  Store,
  Award,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  Verified,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { offers } from "@/data/offers";
import { categories } from "@/data/offers";
import { shops } from "@/data/shops";
import { formatPrice } from "@/lib/offers";
import { searchShops, searchOffers, detectSearchIntent } from "@/lib/search";

interface SearchSuggestion {
  id: string;
  title: string;
  subtitle?: string;
  type: "offer" | "category" | "shop" | "brand" | "recent";
  icon: React.ReactNode;
  link: string;
  price?: number;
  rating?: number;
  verified?: boolean;
  location?: string;
}

interface SearchSuggestionsProps {
  query: string;
  onSelectSuggestion: (suggestion: SearchSuggestion) => void;
  onClose: () => void;
  isVisible: boolean;
}

export function SearchSuggestions({
  query,
  onSelectSuggestion,
  onClose,
  isVisible,
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Generate suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      // Show popular suggestions when no query
      const popularSuggestions: SearchSuggestion[] = [
        {
          id: "featured",
          title: "Featured Offers",
          subtitle: "Editor's picks",
          type: "recent",
          icon: <Award className="w-4 h-4 text-orange-500" />,
          link: "/?featured=true",
        },
        {
          id: "new",
          title: "New Arrivals",
          subtitle: "Latest products",
          type: "recent",
          icon: <Clock className="w-4 h-4 text-green-500" />,
          link: "/?new=true",
        },
        {
          id: "deals",
          title: "Hot Deals",
          subtitle: "Limited time offers",
          type: "recent",
          icon: <TrendingUp className="w-4 h-4 text-red-500" />,
          link: "/?discount=true",
        },
        ...categories.slice(0, 3).map((category) => ({
          id: category.id,
          title: category.name,
          subtitle: `${category.count} offers`,
          type: "category" as const,
          icon: <Tag className="w-4 h-4 text-blue-500" />,
          link: `/?category=${category.id}`,
        })),
      ];
      setSuggestions(popularSuggestions);
      setHighlightedIndex(0);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const newSuggestions: SearchSuggestion[] = [];

    const searchIntent = detectSearchIntent(query);

    // Search offers (limit based on intent)
    const offerLimit = searchIntent === "shops" ? 2 : 4;
    const matchingOffers = searchOffers(query).slice(0, offerLimit);

    matchingOffers.forEach((offer) => {
      newSuggestions.push({
        id: offer.id,
        title: offer.title,
        subtitle: `${formatPrice(offer.price)} • ${offer.vendor.name}`,
        type: "offer",
        icon: <Package className="w-4 h-4 text-blue-500" />,
        link: `/offer/${offer.id}`,
        price: offer.price,
        rating: offer.rating,
        verified: offer.vendor.verified,
        location: offer.location,
      });
    });

    // Search shops (show more if it's a shop-focused search)
    const shopLimit = searchIntent === "shops" ? 5 : 3;
    const matchingShops = searchShops(query).slice(0, shopLimit);

    matchingShops.forEach((shop) => {
      newSuggestions.push({
        id: shop.id,
        title: shop.name,
        subtitle: `${shop.stats?.followerCount || 0} followers • ${shop.totalOffers} offers • ${shop.city}, ${shop.state}`,
        type: "shop",
        icon: <Store className="w-4 h-4 text-purple-500" />,
        link: `/shop/${shop.id}`,
        rating: shop.rating,
        verified: shop.verified,
        location: shop.location,
      });
    });

    // Search categories
    const matchingCategories = categories
      .filter((category) => category.name.toLowerCase().includes(lowerQuery))
      .slice(0, 3);

    matchingCategories.forEach((category) => {
      newSuggestions.push({
        id: category.id,
        title: category.name,
        subtitle: `${category.count} offers`,
        type: "category",
        icon: <Tag className="w-4 h-4 text-green-500" />,
        link: `/?category=${category.id}`,
      });
    });

    // Search vendors/brands
    const uniqueVendors = Array.from(
      new Set(offers.map((offer) => offer.vendor.name)),
    )
      .filter((vendor) => vendor.toLowerCase().includes(lowerQuery))
      .slice(0, 2);

    uniqueVendors.forEach((vendor) => {
      const vendorOffers = offers.filter(
        (offer) => offer.vendor.name === vendor,
      );
      const vendorRating =
        vendorOffers.reduce((sum, offer) => sum + offer.rating, 0) /
        vendorOffers.length;

      newSuggestions.push({
        id: `vendor_${vendor}`,
        title: vendor,
        subtitle: `${vendorOffers.length} offers • ${vendorRating.toFixed(1)} rating`,
        type: "brand",
        icon: <Award className="w-4 h-4 text-orange-500" />,
        link: `/?vendor=${encodeURIComponent(vendor)}`,
        rating: vendorRating,
      });
    });

    setSuggestions(newSuggestions);
    setHighlightedIndex(0);
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isVisible) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (suggestions[highlightedIndex]) {
          onSelectSuggestion(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        break;
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isVisible, suggestions, highlightedIndex]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  const getTypeLabel = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "offer":
        return "Product";
      case "category":
        return "Category";
      case "shop":
        return "Shop";
      case "brand":
        return "Brand";
      case "recent":
        return "Popular";
      default:
        return "";
    }
  };

  const getTypeColor = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "offer":
        return "bg-blue-100 text-blue-700";
      case "category":
        return "bg-green-100 text-green-700";
      case "shop":
        return "bg-purple-100 text-purple-700";
      case "brand":
        return "bg-orange-100 text-orange-700";
      case "recent":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Group suggestions by type
  const groupedSuggestions = suggestions.reduce(
    (acc, suggestion, index) => {
      const type = suggestion.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({ ...suggestion, originalIndex: index });
      return acc;
    },
    {} as Record<string, (SearchSuggestion & { originalIndex: number })[]>,
  );

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 shadow-lg border-gray-200">
      <CardContent className="p-0">
        {query.trim() && (
          <div className="p-4 bg-gray-50 border-b text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search results for "{query}"
            </div>
          </div>
        )}

        {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
          <div key={type}>
            {query.trim() && (
              <div className="px-4 py-2 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={getTypeColor(type as SearchSuggestion["type"])}
                  >
                    {getTypeLabel(type as SearchSuggestion["type"])}s
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {typeSuggestions.length} result
                    {typeSuggestions.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )}

            {typeSuggestions.map((suggestion) => (
              <Link
                key={suggestion.id}
                to={suggestion.link}
                onClick={() => onSelectSuggestion(suggestion)}
                className={cn(
                  "block p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0",
                  highlightedIndex === suggestion.originalIndex && "bg-blue-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">{suggestion.icon}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {suggestion.title}
                      </h4>

                      {suggestion.verified && (
                        <Verified className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      )}

                      {suggestion.rating && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">
                            {suggestion.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {suggestion.subtitle && (
                      <p className="text-sm text-gray-600 truncate">
                        {suggestion.subtitle}
                      </p>
                    )}

                    {suggestion.location && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 truncate">
                          {suggestion.location}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", getTypeColor(suggestion.type))}
                    >
                      {getTypeLabel(suggestion.type)}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}

            {Object.keys(groupedSuggestions).length > 1 &&
              type !==
                Object.keys(groupedSuggestions)[
                  Object.keys(groupedSuggestions).length - 1
                ] && <Separator />}
          </div>
        ))}

        {query.trim() && suggestions.length > 0 && (
          <div className="p-4 bg-gray-50 border-t text-center">
            <Link
              to={`/?search=${encodeURIComponent(query.trim())}`}
              onClick={onClose}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all results for "{query}"
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
