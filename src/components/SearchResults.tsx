import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, TrendingUp, X } from "lucide-react";
import { searchOffers } from "@/lib/offers";
import { categories } from "@/data/offers";
import { Offer } from "@/types/offer";
import { Link } from "react-router-dom";

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export function SearchResults({ query, onClose }: SearchResultsProps) {
  const [results, setResults] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        const searchResults = searchOffers(query);
        setResults(searchResults.slice(0, 5)); // Show top 5 results
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  const recentSearches = [
    "iPhone 15 Pro",
    "Winter coats",
    "Gaming setup",
    "Smart watch",
  ];

  const trendingSearches = [
    "Black Friday deals",
    "Gaming chairs",
    "Skincare routine",
    "Home security",
  ];

  if (!query.trim()) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Searches
              </h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                  >
                    <span className="text-sm text-gray-700">{search}</span>
                    <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200"
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-3">
              Browse Categories
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/?category=${category.id}`}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md"
                  onClick={onClose}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm text-gray-700">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-gray-900">
                Search Results for "{query}"
              </h3>
              <Link
                to={`/?search=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                View all results
              </Link>
            </div>

            <div className="space-y-2">
              {results.map((offer) => (
                <Link
                  key={offer.id}
                  to={`/offer/${offer.id}`}
                  onClick={onClose}
                  className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={offer.images[0]}
                      alt={offer.title}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {offer.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {offer.shortDescription}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-sm text-gray-900">
                          ${offer.price}
                        </span>
                        {offer.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            ${offer.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-2">No results found for "{query}"</p>
            <p className="text-sm text-gray-500">
              Try different keywords or browse our categories
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
