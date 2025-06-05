import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  MessageSquare,
  Award,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { useReviews } from "@/contexts/ReviewContext";
import { Review, ReviewFormData, ReviewFilters } from "@/types/review";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ReviewsSectionProps {
  offerId: string;
}

// Simple filter function to avoid import issues
const filterReviews = (reviews: Review[], filters: ReviewFilters): Review[] => {
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

  // Sort reviews
  switch (filters.sortBy) {
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
    case "newest":
    default:
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
  }

  return filtered;
};

export function ReviewsSection({ offerId }: ReviewsSectionProps) {
  const {
    getOfferReviews,
    getOfferStats,
    submitReview,
    markReviewHelpful,
    refreshReviews,
    isLoading,
    error,
  } = useReviews();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<ReviewFilters>({ sortBy: "newest" });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  const stats = getOfferStats(offerId);

  useEffect(() => {
    try {
      const offerReviews = getOfferReviews(offerId);
      const filteredReviews = filterReviews(offerReviews, filters);
      setReviews(filteredReviews);
      setLocalError(null);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setLocalError("Failed to load reviews");
    }
  }, [offerId, filters, getOfferReviews]);

  const handleSubmitReview = async (formData: ReviewFormData) => {
    setIsSubmitting(true);
    setLocalError(null);

    try {
      await submitReview(offerId, formData);
      setShowReviewForm(false);
      toast.success("Review submitted successfully!");

      // Refresh reviews after submission
      setTimeout(() => {
        const updatedReviews = getOfferReviews(offerId);
        const filteredReviews = filterReviews(updatedReviews, filters);
        setReviews(filteredReviews);
      }, 100);
    } catch (error) {
      console.error("Failed to submit review:", error);
      setLocalError("Failed to submit review. Please try again.");
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = (reviewId: string) => {
    try {
      markReviewHelpful(reviewId);
      toast.success("Thank you for your feedback!");

      // Refresh reviews to show updated helpful count
      setTimeout(() => {
        const updatedReviews = getOfferReviews(offerId);
        const filteredReviews = filterReviews(updatedReviews, filters);
        setReviews(filteredReviews);
      }, 100);
    } catch (error) {
      console.error("Failed to mark review as helpful:", error);
      toast.error("Failed to update review");
    }
  };

  const handleFilterChange = (key: keyof ReviewFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRefresh = () => {
    refreshReviews();
    const offerReviews = getOfferReviews(offerId);
    const filteredReviews = filterReviews(offerReviews, filters);
    setReviews(filteredReviews);
    toast.success("Reviews refreshed");
  };

  const reviewsWithPhotos = reviews.filter((r) => r.photos.length > 0).length;
  const verifiedReviews = reviews.filter((r) => r.verified).length;

  // Show error state
  if (error || localError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || localError}</AlertDescription>
        </Alert>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="text-4xl font-bold text-gray-900">
              {stats.averageRating}
            </div>
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 ml-2" />
          </div>
          <div className="text-sm text-gray-600 mb-3">Average Rating</div>
          <div className="flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(stats.averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300",
                )}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <MessageSquare className="w-6 h-6 text-[#1890ff] mr-2" />
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalReviews}
            </div>
          </div>
          <div className="text-sm text-gray-600">Total Reviews</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Camera className="w-6 h-6 text-purple-600 mr-2" />
            <div className="text-2xl font-bold text-gray-900">
              {reviewsWithPhotos}
            </div>
          </div>
          <div className="text-sm text-gray-600">With Photos</div>
        </div>
      </div>

      {/* Rating Breakdown */}
      {stats.totalReviews > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Rating Breakdown</h4>
          {Object.entries(stats.ratingDistribution)
            .reverse()
            .map(([rating, count]) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#1890ff] to-[#722ed1] h-2 rounded-full transition-all"
                    style={{
                      width:
                        stats.totalReviews > 0
                          ? `${(count / stats.totalReviews) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
        </div>
      )}

      <Separator />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="flex-1 bg-gradient-to-r from-[#1890ff] to-[#722ed1] hover:from-[#1890ff]/90 hover:to-[#722ed1]/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Star className="w-4 h-4 mr-2" />
          )}
          Write a Review
        </Button>

        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          offerId={offerId}
          onSubmit={handleSubmitReview}
          onCancel={() => setShowReviewForm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Filters */}
      {reviews.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>

          <Select
            value={filters.sortBy || "newest"}
            onValueChange={(value) =>
              handleFilterChange("sortBy", value as ReviewFilters["sortBy"])
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="rating-high">Highest Rating</SelectItem>
              <SelectItem value="rating-low">Lowest Rating</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.rating?.toString() || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "rating",
                value === "all" ? undefined : parseInt(value),
              )
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ratings</SelectItem>
              <SelectItem value="5">5 stars</SelectItem>
              <SelectItem value="4">4 stars</SelectItem>
              <SelectItem value="3">3 stars</SelectItem>
              <SelectItem value="2">2 stars</SelectItem>
              <SelectItem value="1">1 star</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={filters.withPhotos ? "default" : "outline"}
              size="sm"
              onClick={() =>
                handleFilterChange("withPhotos", !filters.withPhotos)
              }
            >
              <Camera className="w-3 h-3 mr-1" />
              With Photos
            </Button>
            <Button
              variant={filters.verified ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("verified", !filters.verified)}
            >
              <Award className="w-3 h-3 mr-1" />
              Verified
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                Reviews ({reviews.length})
              </h4>
              {verifiedReviews > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  <Award className="w-3 h-3 mr-1" />
                  {verifiedReviews} Verified Purchase
                  {verifiedReviews > 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpful={handleHelpful}
              />
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600 mb-4">
              Be the first to share your experience with this product
            </p>
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-gradient-to-r from-[#1890ff] to-[#722ed1] hover:from-[#1890ff]/90 hover:to-[#722ed1]/90"
            >
              <Star className="w-4 h-4 mr-2" />
              Write the First Review
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
