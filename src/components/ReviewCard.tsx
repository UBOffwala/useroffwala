import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ThumbsUp, Verified, Calendar, Camera } from "lucide-react";
import { Review } from "@/types/review";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
}

// Simple date formatting function to avoid import issues
const formatReviewDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
};

export function ReviewCard({ review, onHelpful }: ReviewCardProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(
    new Set(),
  );

  const handleImageError = (photoId: string) => {
    setImageLoadErrors((prev) => new Set(prev).add(photoId));
  };

  const handlePhotoClick = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          {/* Header with user info and rating */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1890ff] to-[#722ed1] flex items-center justify-center text-white font-semibold">
                {review.userAvatar ? (
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  review.userName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">
                    {review.userName}
                  </h4>
                  {review.verified && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-700"
                    >
                      <Verified className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {formatReviewDate(review.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300",
                  )}
                />
              ))}
            </div>
          </div>

          {/* Review title */}
          {review.title && (
            <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
          )}

          {/* Review comment */}
          <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

          {/* Photos */}
          {review.photos.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Photos ({review.photos.length})
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {review.photos.slice(0, 6).map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group"
                    onClick={() => handlePhotoClick(photo.url)}
                  >
                    {!imageLoadErrors.has(photo.id) ? (
                      <img
                        src={photo.url}
                        alt={`Review photo by ${review.userName}`}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(photo.id)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
                  </div>
                ))}
              </div>
              {review.photos.length > 6 && (
                <p className="text-sm text-gray-500 mt-2">
                  +{review.photos.length - 6} more photos
                </p>
              )}
            </div>
          )}

          {/* Footer with helpful button */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {review.helpful > 0 &&
                `${review.helpful} people found this helpful`}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onHelpful?.(review.id)}
              className="text-gray-600 hover:text-gray-800"
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              Helpful
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closePhotoModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPhoto}
              alt="Review photo"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4"
              onClick={closePhotoModal}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
