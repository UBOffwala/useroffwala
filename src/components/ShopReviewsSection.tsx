import { useState, useEffect } from "react";
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
  Star,
  Filter,
  Camera,
  Verified,
  TrendingUp,
  BarChart3,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Users,
} from "lucide-react";
import { ShopReviewCard } from "./ShopReviewCard";
import { ShopReviewForm } from "./ShopReviewForm";
import { useShopReviews } from "@/contexts/ShopReviewContext";
import { ShopReview, ShopReviewFilters } from "@/types/shopReview";
import { cn } from "@/lib/utils";

// Filter function
const filterShopReviews = (
  reviews: ShopReview[],
  filters: ShopReviewFilters,
): ShopReview[] => {
  let filtered = [...reviews];

  if (filters.rating) {
    filtered = filtered.filter((review) => review.rating === filters.rating);
  }

  if (filters.withPhotos) {
    filtered = filtered.filter((review) => review.photos.length > 0);
  }

  if (filters.verified) {
    filtered = filtered.filter((review) => review.verified);
  }

  if (filters.orderVerified) {
    filtered = filtered.filter((review) => review.orderVerified);
  }

  if (filters.recommendation !== undefined) {
    filtered = filtered.filter(
      (review) => review.recommendation === filters.recommendation,
    );
  }

  if (filters.aspect) {
    filtered = filtered.filter((review) => {
      const aspectRating = review.aspects[filters.aspect!];
      return aspectRating && aspectRating > 0;
    });
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "rating-high":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "helpful":
        filtered.sort((a, b) => b.helpful - a.helpful);
        break;
    }
  }

  return filtered;
};

interface ShopReviewsSectionProps {
  shopId: string;
}

export function ShopReviewsSection({ shopId }: ShopReviewsSectionProps) {
  const [filters, setFilters] = useState<ShopReviewFilters>({
    sortBy: "newest",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filteredReviews, setFilteredReviews] = useState<ShopReview[]>([]);

  const { getShopReviews, getShopReviewStats, loading } = useShopReviews();

  const shopReviews = getShopReviews(shopId);
  const reviewStats = getShopReviewStats(shopId);

  useEffect(() => {
    const filtered = filterShopReviews(shopReviews, filters);
    setFilteredReviews(filtered);
  }, [shopReviews, filters]);

  const handleFilterChange = (key: keyof ShopReviewFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ sortBy: "newest" });
  };

  const StarDistributionBar = ({
    rating,
    count,
    total,
  }: {
    rating: number;
    count: number;
    total: number;
  }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1 w-12">
          <span>{rating}</span>
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
          <div
            className="bg-yellow-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-gray-600 w-8 text-right">{count}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Rating */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {reviewStats.averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-5 h-5",
                    star <= Math.round(reviewStats.averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300",
                  )}
                />
              ))}
            </div>
            <p className="text-gray-600">
              Based on {reviewStats.totalReviews} review
              {reviewStats.totalReviews !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rating Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <StarDistributionBar
                key={rating}
                rating={rating}
                count={
                  reviewStats.ratingDistribution[
                    rating as keyof typeof reviewStats.ratingDistribution
                  ]
                }
                total={reviewStats.totalReviews}
              />
            ))}
          </CardContent>
        </Card>

        {/* Aspect Ratings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aspect Ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(reviewStats.aspectRatings).map(
              ([aspect, rating]) => (
                <div key={aspect} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{aspect}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-3 h-3",
                            star <= Math.round(rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              ),
            )}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recommendation Rate</span>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {reviewStats.recommendationPercentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Write Review Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Customer Reviews</h3>
        <Button onClick={() => setShowReviewForm(!showReviewForm)}>
          <MessageSquare className="w-4 h-4 mr-2" />
          {showReviewForm ? "Cancel" : "Write Review"}
        </Button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <ShopReviewForm
          shopId={shopId}
          onSuccess={() => setShowReviewForm(false)}
        />
      )}

      {/* Filters and Sorting */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            {/* Sort By */}
            <Select
              value={filters.sortBy || "newest"}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rating-high">Highest Rating</SelectItem>
                <SelectItem value="rating-low">Lowest Rating</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>

            {/* Rating Filter */}
            <Select
              value={filters.rating?.toString() || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "rating",
                  value === "all" ? undefined : Number(value),
                )
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            {/* Aspect Filter */}
            <Select
              value={filters.aspect || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "aspect",
                  value === "all" ? undefined : value,
                )
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Aspects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Aspects</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="value">Value</SelectItem>
              </SelectContent>
            </Select>

            {/* Recommendation Filter */}
            <Select
              value={
                filters.recommendation === undefined
                  ? "all"
                  : filters.recommendation
                    ? "yes"
                    : "no"
              }
              onValueChange={(value) =>
                handleFilterChange(
                  "recommendation",
                  value === "all" ? undefined : value === "yes",
                )
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Recommendation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="yes">Recommends</SelectItem>
                <SelectItem value="no">Doesn't Recommend</SelectItem>
              </SelectContent>
            </Select>

            {/* Quick Filter Buttons */}
            <div className="flex gap-2">
              <Button
                variant={filters.withPhotos ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleFilterChange("withPhotos", !filters.withPhotos)
                }
              >
                <Camera className="w-4 h-4 mr-1" />
                With Photos
              </Button>

              <Button
                variant={filters.verified ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleFilterChange("verified", !filters.verified)
                }
              >
                <Verified className="w-4 h-4 mr-1" />
                Verified
              </Button>

              <Button
                variant={filters.orderVerified ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleFilterChange("orderVerified", !filters.orderVerified)
                }
              >
                <Users className="w-4 h-4 mr-1" />
                Verified Purchase
              </Button>
            </div>

            {/* Clear Filters */}
            {(filters.rating ||
              filters.withPhotos ||
              filters.verified ||
              filters.orderVerified ||
              filters.recommendation !== undefined ||
              filters.aspect) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Filters Summary */}
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <span>
              Showing {filteredReviews.length} of {shopReviews.length} reviews
            </span>
            {filteredReviews.length !== shopReviews.length && (
              <span className="text-blue-600">(filtered)</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ShopReviewCard key={review.id} review={review} />
          ))
        ) : shopReviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to review this shop and help other customers make
                informed decisions.
              </p>
              <Button onClick={() => setShowReviewForm(true)}>
                Write the First Review
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No reviews match your filters
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to see more reviews.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
