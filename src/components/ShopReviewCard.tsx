import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Verified,
  Calendar,
  User,
  MessageSquare,
  MoreVertical,
  Flag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShopReview } from "@/types/shopReview";
import { useShopReviews } from "@/contexts/ShopReviewContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Helper function to format date
function formatReviewDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
}

interface ShopReviewCardProps {
  review: ShopReview;
  isCompact?: boolean;
}

export function ShopReviewCard({
  review,
  isCompact = false,
}: ShopReviewCardProps) {
  const [showFullComment, setShowFullComment] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { markReviewHelpful } = useShopReviews();

  const handleHelpful = () => {
    markReviewHelpful(review.id);
  };

  const handleReport = () => {
    toast.success("Review reported. We'll investigate this review.");
  };

  const truncateComment = (text: string, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getAspectLabel = (aspect: string) => {
    switch (aspect) {
      case "service":
        return "Service";
      case "quality":
        return "Quality";
      case "shipping":
        return "Shipping";
      case "communication":
        return "Communication";
      case "value":
        return "Value";
      default:
        return aspect;
    }
  };

  const StarDisplay = ({
    rating,
    size = "sm",
  }: {
    rating: number;
    size?: "sm" | "md";
  }) => {
    const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClass,
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300",
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Card
        className={cn(
          "transition-shadow hover:shadow-md",
          isCompact && "border-l-4 border-l-blue-500",
        )}
      >
        <CardContent className={cn("p-4", isCompact && "p-3")}>
          {/* Review Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {review.userAvatar ? (
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className={cn(
                      "rounded-full object-cover",
                      isCompact ? "w-8 h-8" : "w-10 h-10",
                    )}
                  />
                ) : (
                  <div
                    className={cn(
                      "bg-gray-200 rounded-full flex items-center justify-center",
                      isCompact ? "w-8 h-8" : "w-10 h-10",
                    )}
                  >
                    <User
                      className={cn(
                        isCompact ? "w-4 h-4" : "w-5 h-5",
                        "text-gray-500",
                      )}
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-medium",
                        isCompact ? "text-sm" : "text-base",
                      )}
                    >
                      {review.userName}
                    </span>
                    {review.verified && (
                      <Verified className="w-4 h-4 text-blue-500" />
                    )}
                    {review.orderVerified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatReviewDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="mr-2 h-4 w-4" />
                  Report Review
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-3">
            <StarDisplay
              rating={review.rating}
              size={isCompact ? "sm" : "md"}
            />
            <span
              className={cn("font-medium", isCompact ? "text-sm" : "text-base")}
            >
              {review.rating}/5
            </span>
            {review.recommendation !== undefined && (
              <div className="flex items-center gap-1">
                {review.recommendation ? (
                  <>
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600">Recommends</span>
                  </>
                ) : (
                  <>
                    <ThumbsDown className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-600">
                      Doesn't recommend
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Review Title */}
          <h4
            className={cn(
              "font-semibold mb-2",
              isCompact ? "text-sm" : "text-base",
            )}
          >
            {review.title}
          </h4>

          {/* Review Comment */}
          <div className={cn("mb-3", isCompact ? "text-sm" : "text-base")}>
            <p className="text-gray-700 leading-relaxed">
              {showFullComment || review.comment.length <= 200
                ? review.comment
                : truncateComment(review.comment)}
            </p>
            {review.comment.length > 200 && (
              <button
                onClick={() => setShowFullComment(!showFullComment)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
              >
                {showFullComment ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Aspect Ratings */}
          {!isCompact &&
            review.aspects &&
            Object.keys(review.aspects).some(
              (key) => review.aspects[key as keyof typeof review.aspects]! > 0,
            ) && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Detailed Ratings</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(review.aspects).map(([aspect, rating]) => {
                    if (!rating || rating === 0) return null;
                    return (
                      <div
                        key={aspect}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {getAspectLabel(aspect)}
                        </span>
                        <div className="flex items-center gap-1">
                          <StarDisplay rating={rating} size="sm" />
                          <span className="text-xs">{rating}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Photos */}
          {review.photos && review.photos.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-medium mb-2">Photos</h5>
              <div className="flex gap-2 overflow-x-auto">
                {review.photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo.url)}
                    className="flex-shrink-0 relative overflow-hidden rounded-lg hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={photo.url}
                      alt={`Review photo ${index + 1}`}
                      className="w-16 h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Review Actions */}
          <div className="flex items-center justify-between pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpful}
              className="text-gray-600 hover:text-gray-800"
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              Helpful ({review.helpful})
            </Button>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MessageSquare className="w-3 h-3" />
              <span>Shop Review</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPhoto}
              alt="Review photo"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
