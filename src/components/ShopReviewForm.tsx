import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Star,
  Camera,
  X,
  Upload,
  Loader2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ShopReviewFormData } from "@/types/shopReview";
import { useShopReviews } from "@/contexts/ShopReviewContext";
import { toast } from "sonner";

interface ShopReviewFormProps {
  shopId: string;
  onSuccess?: () => void;
}

export function ShopReviewForm({ shopId, onSuccess }: ShopReviewFormProps) {
  const [formData, setFormData] = useState<ShopReviewFormData>({
    rating: 0,
    title: "",
    comment: "",
    photos: [],
    aspects: {
      service: 0,
      quality: 0,
      shipping: 0,
      communication: 0,
      value: 0,
    },
    recommendation: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);

  const { addShopReview, loading } = useShopReviews();

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleAspectRatingChange = (
    aspect: keyof typeof formData.aspects,
    rating: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      aspects: { ...prev.aspects, [aspect]: rating },
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 6 - formData.photos.length;
    const newFiles = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.error(`You can only upload ${remainingSlots} more photos`);
    }

    // Validate file sizes (5MB limit per file)
    const validFiles = newFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...validFiles],
    }));

    // Create preview URLs
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPhotoPreview((prev) => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    // Revoke preview URL to prevent memory leaks
    URL.revokeObjectURL(photoPreview[index]);

    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    setPhotoPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error("Please provide an overall rating");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please provide a review title");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    // Check if at least one aspect is rated
    const aspectRatings = Object.values(formData.aspects);
    if (aspectRatings.every((rating) => rating === 0)) {
      toast.error("Please rate at least one aspect of the shop");
      return;
    }

    setIsSubmitting(true);

    try {
      await addShopReview(shopId, formData);

      // Reset form
      setFormData({
        rating: 0,
        title: "",
        comment: "",
        photos: [],
        aspects: {
          service: 0,
          quality: 0,
          shipping: 0,
          communication: 0,
          value: 0,
        },
        recommendation: true,
      });

      // Clean up photo previews
      photoPreview.forEach((url) => URL.revokeObjectURL(url));
      setPhotoPreview([]);

      onSuccess?.();
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({
    rating,
    onRatingChange,
    size = "md",
    label,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
    size?: "sm" | "md" | "lg";
    label?: string;
  }) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={cn(
              "transition-colors hover:scale-110 transform transition-transform",
              star <= rating ? "text-yellow-400" : "text-gray-300",
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                star <= rating && "fill-current",
              )}
            />
          </button>
        ))}
        {label && (
          <span className="ml-2 text-sm text-gray-600">
            {rating === 0
              ? "Not rated"
              : rating === 1
                ? "Poor"
                : rating === 2
                  ? "Fair"
                  : rating === 3
                    ? "Good"
                    : rating === 4
                      ? "Very Good"
                      : "Excellent"}
          </span>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Overall Rating *</Label>
            <StarRating
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              size="lg"
              label
            />
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Review Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Summarize your experience"
              maxLength={100}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.title.length}/100
            </div>
          </div>

          {/* Detailed Review */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium">
              Your Review *
            </Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              placeholder="Share your experience with this shop. What did you like or dislike?"
              className="min-h-[100px]"
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.comment.length}/1000
            </div>
          </div>

          {/* Aspect Ratings */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              Rate Different Aspects
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Customer Service</span>
                  <StarRating
                    rating={formData.aspects.service}
                    onRatingChange={(rating) =>
                      handleAspectRatingChange("service", rating)
                    }
                    size="sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Product Quality</span>
                  <StarRating
                    rating={formData.aspects.quality}
                    onRatingChange={(rating) =>
                      handleAspectRatingChange("quality", rating)
                    }
                    size="sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Shipping Speed</span>
                  <StarRating
                    rating={formData.aspects.shipping}
                    onRatingChange={(rating) =>
                      handleAspectRatingChange("shipping", rating)
                    }
                    size="sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Communication</span>
                  <StarRating
                    rating={formData.aspects.communication}
                    onRatingChange={(rating) =>
                      handleAspectRatingChange("communication", rating)
                    }
                    size="sm"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Value for Money</span>
                  <StarRating
                    rating={formData.aspects.value}
                    onRatingChange={(rating) =>
                      handleAspectRatingChange("value", rating)
                    }
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Would you recommend this shop?
            </Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, recommendation: true }))
                }
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                  formData.recommendation
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100",
                )}
              >
                <ThumbsUp className="w-4 h-4" />
                Yes, I recommend
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, recommendation: false }))
                }
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                  !formData.recommendation
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100",
                )}
              >
                <ThumbsDown className="w-4 h-4" />
                No, I don't recommend
              </button>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Add Photos (Optional)</Label>
            <p className="text-xs text-gray-500">
              Upload up to 6 photos. Maximum 5MB per photo.
            </p>

            {formData.photos.length < 6 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload photos
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {photoPreview.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photoPreview.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting Review...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
