import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { Review, ReviewFormData, ReviewStats } from "@/types/review";

interface ReviewContextType {
  getOfferReviews: (offerId: string) => Review[];
  getOfferStats: (offerId: string) => ReviewStats;
  submitReview: (offerId: string, formData: ReviewFormData) => Promise<void>;
  markReviewHelpful: (reviewId: string) => void;
  refreshReviews: () => void;
  isLoading: boolean;
  error: string | null;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const REVIEWS_STORAGE_KEY = "offerhub_reviews";

// Simple storage functions
const getReviews = (): Review[] => {
  try {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveReviews = (reviews: Review[]): void => {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (error) {
    console.error("Failed to save reviews:", error);
  }
};

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewsCache, setReviewsCache] = useState<{
    [offerId: string]: Review[];
  }>({});

  const refreshReviews = useCallback(() => {
    setReviewsCache({});
    setError(null);
  }, []);

  const getOfferReviews = useCallback(
    (offerId: string): Review[] => {
      try {
        if (reviewsCache[offerId]) {
          return reviewsCache[offerId];
        }

        const allReviews = getReviews();
        const reviews = allReviews.filter(
          (review) => review.offerId === offerId,
        );

        setReviewsCache((prev) => ({
          ...prev,
          [offerId]: reviews,
        }));

        return reviews;
      } catch (err) {
        console.error("Failed to get offer reviews:", err);
        setError("Failed to load reviews");
        return [];
      }
    },
    [reviewsCache],
  );

  const getOfferStats = useCallback(
    (offerId: string): ReviewStats => {
      try {
        const reviews = getOfferReviews(offerId);

        if (reviews.length === 0) {
          return {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          };
        }

        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0,
        );
        const averageRating = totalRating / reviews.length;

        const ratingDistribution = reviews.reduce(
          (dist, review) => {
            dist[review.rating as keyof typeof dist]++;
            return dist;
          },
          { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        );

        return {
          totalReviews: reviews.length,
          averageRating: Math.round(averageRating * 10) / 10,
          ratingDistribution,
        };
      } catch (err) {
        console.error("Failed to get offer stats:", err);
        setError("Failed to load review statistics");
        return {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        };
      }
    },
    [getOfferReviews],
  );

  const submitReview = async (
    offerId: string,
    formData: ReviewFormData,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const photoUrls = await Promise.all(
        formData.photos.map(async (file, index) => ({
          id: `photo_${Date.now()}_${index}`,
          url: URL.createObjectURL(file),
          filename: file.name,
        })),
      );

      const review: Review = {
        id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        offerId,
        userId: "current_user",
        userName: "Current User",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=current",
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        photos: photoUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        helpful: 0,
        verified: false,
      };

      const allReviews = getReviews();
      allReviews.unshift(review);
      saveReviews(allReviews);

      setReviewsCache((prev) => ({
        ...prev,
        [offerId]: [review, ...(prev[offerId] || [])],
      }));
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError("Failed to submit review. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const markReviewHelpful = useCallback((reviewId: string): void => {
    try {
      const allReviews = getReviews();
      const reviewIndex = allReviews.findIndex((r) => r.id === reviewId);

      if (reviewIndex !== -1) {
        allReviews[reviewIndex] = {
          ...allReviews[reviewIndex],
          helpful: allReviews[reviewIndex].helpful + 1,
          updatedAt: new Date().toISOString(),
        };
        saveReviews(allReviews);

        setReviewsCache((prev) => {
          const updatedCache = { ...prev };
          Object.keys(updatedCache).forEach((offerId) => {
            updatedCache[offerId] = updatedCache[offerId].map((r) =>
              r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r,
            );
          });
          return updatedCache;
        });
      }
    } catch (err) {
      console.error("Failed to mark review as helpful:", err);
      setError("Failed to update review");
    }
  }, []);

  return (
    <ReviewContext.Provider
      value={{
        getOfferReviews,
        getOfferStats,
        submitReview,
        markReviewHelpful,
        refreshReviews,
        isLoading,
        error,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewProvider");
  }
  return context;
}
