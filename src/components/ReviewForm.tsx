import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Camera, X, Upload } from "lucide-react";
import { ReviewFormData } from "@/types/review";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  offerId: string;
  onSubmit: (data: ReviewFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ReviewForm({
  offerId,
  onSubmit,
  onCancel,
  isSubmitting,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert(
        "Some files were skipped. Please ensure all files are images under 5MB.",
      );
    }

    // Limit to 6 photos total
    const remainingSlots = 6 - photos.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));

    setPhotos((prev) => [...prev, ...filesToAdd]);
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(photoPreviews[index]);

    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a comment");
      return;
    }

    const formData: ReviewFormData = {
      rating,
      title: title.trim(),
      comment: comment.trim(),
      photos,
    };

    onSubmit(formData);
  };

  const resetForm = () => {
    setRating(0);
    setTitle("");
    setComment("");
    setPhotos([]);
    // Clean up object URLs
    photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    setPhotoPreviews([]);
  };

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-[#1890ff]" />
          Write a Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Rate this product *</Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="focus:outline-none focus:ring-2 focus:ring-[#1890ff] rounded"
                    onClick={() => handleStarClick(i + 1)}
                    onMouseEnter={() => setHoveredRating(i + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors cursor-pointer",
                        (hoveredRating || rating) > i
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-300",
                      )}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  {ratingLabels[rating as keyof typeof ratingLabels]}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="review-title" className="text-sm font-medium">
              Review Title (Optional)
            </Label>
            <Input
              id="review-title"
              placeholder="Summarize your experience..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 text-right">
              {title.length}/100
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="review-comment" className="text-sm font-medium">
              Your Review *
            </Label>
            <Textarea
              id="review-comment"
              placeholder="Tell others about your experience with this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={1000}
              disabled={isSubmitting}
              className="resize-none"
            />
            <div className="text-xs text-gray-500 text-right">
              {comment.length}/1000
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Photos (Optional)</Label>
            <p className="text-xs text-gray-500">
              Add up to 6 photos to help others see your experience. Max 5MB per
              photo.
            </p>

            {/* Photo Grid */}
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                      onClick={() => removePhoto(index)}
                      disabled={isSubmitting}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {photos.length < 6 && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="w-full h-24 border-dashed border-2 hover:border-[#1890ff] hover:bg-blue-50"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="w-6 h-6 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload photos ({photos.length}/6)
                    </span>
                  </div>
                </Button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || !comment.trim()}
              className="flex-1 bg-gradient-to-r from-[#1890ff] to-[#722ed1] hover:from-[#1890ff]/90 hover:to-[#722ed1]/90"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  onCancel();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
