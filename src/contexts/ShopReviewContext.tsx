import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  ShopReview,
  ShopReviewFormData,
  ShopReviewStats,
} from "@/types/shopReview";
import { toast } from "sonner";

interface ShopReviewContextType {
  reviews: ShopReview[];
  getShopReviews: (shopId: string) => ShopReview[];
  addShopReview: (
    shopId: string,
    reviewData: ShopReviewFormData,
  ) => Promise<void>;
  markReviewHelpful: (reviewId: string) => void;
  getShopReviewStats: (shopId: string) => ShopReviewStats;
  loading: boolean;
  error: string | null;
}

const ShopReviewContext = createContext<ShopReviewContextType | undefined>(
  undefined,
);

const SHOP_REVIEWS_KEY = "offerhub_shop_reviews";

// Sample shop reviews data
const initialShopReviews: ShopReview[] = [
  {
    id: "sr1",
    shopId: "shop_1", // TechWorld Electronics
    userId: "user1",
    userName: "John Smith",
    userAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop",
    rating: 5,
    title: "Outstanding service and quality products!",
    comment:
      "I've been shopping with TechWorld Electronics for over a year now, and they consistently deliver excellent products with fast shipping. Their customer service is top-notch, and they really know their tech. Highly recommended for anyone looking for reliable electronics.",
    photos: [
      {
        id: "p1",
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
        filename: "unboxing.jpg",
      },
      {
        id: "p2",
        url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
        filename: "product_quality.jpg",
      },
    ],
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    helpful: 24,
    verified: true,
    aspects: {
      service: 5,
      quality: 5,
      shipping: 4,
      communication: 5,
      value: 4,
    },
    orderVerified: true,
    recommendation: true,
  },
  {
    id: "sr2",
    shopId: "shop_1",
    userId: "user2",
    userName: "Sarah Johnson",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b352?w=40&h=40&fit=crop",
    rating: 4,
    title: "Great selection, minor shipping delay",
    comment:
      "TechWorld has an amazing selection of electronics and their prices are competitive. My order took a day longer than expected to arrive, but the packaging was excellent and everything was in perfect condition. Will definitely shop here again.",
    photos: [],
    createdAt: "2024-01-08T09:15:00Z",
    updatedAt: "2024-01-08T09:15:00Z",
    helpful: 12,
    verified: true,
    aspects: {
      service: 4,
      quality: 5,
      shipping: 3,
      communication: 4,
      value: 4,
    },
    orderVerified: true,
    recommendation: true,
  },
  {
    id: "sr3",
    shopId: "shop_2", // Fashion Forward
    userId: "user3",
    userName: "Emily Davis",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop",
    rating: 5,
    title: "Fashion Forward lives up to its name!",
    comment:
      "Absolutely love this boutique! They have the latest trends and the quality is fantastic. The owner Sarah really knows fashion and helped me put together some amazing outfits. The personal styling service is worth every penny.",
    photos: [
      {
        id: "p3",
        url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop",
        filename: "fashion_haul.jpg",
      },
    ],
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
    helpful: 18,
    verified: true,
    aspects: {
      service: 5,
      quality: 5,
      shipping: 4,
      communication: 5,
      value: 4,
    },
    orderVerified: true,
    recommendation: true,
  },
  {
    id: "sr4",
    shopId: "shop_2",
    userId: "user4",
    userName: "Lisa Wang",
    userAvatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop",
    rating: 4,
    title: "Trendy clothes with good customer service",
    comment:
      "Fashion Forward has some really unique pieces that you won't find elsewhere. The prices are reasonable for the quality. Had a small issue with sizing but their return process was smooth and hassle-free.",
    photos: [],
    createdAt: "2024-01-05T11:20:00Z",
    updatedAt: "2024-01-05T11:20:00Z",
    helpful: 8,
    verified: true,
    aspects: {
      service: 4,
      quality: 4,
      shipping: 4,
      communication: 4,
      value: 4,
    },
    orderVerified: true,
    recommendation: true,
  },
  {
    id: "sr5",
    shopId: "shop_3", // Home & Garden Paradise
    userId: "user5",
    userName: "Michael Brown",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    rating: 5,
    title: "Best place for home and garden supplies!",
    comment:
      "Robert and Maria really know their stuff! They helped me design my entire backyard setup and the results are amazing. Great quality products, fair prices, and they even delivered everything on time. Couldn't be happier!",
    photos: [
      {
        id: "p4",
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "garden_setup.jpg",
      },
    ],
    createdAt: "2024-01-09T13:30:00Z",
    updatedAt: "2024-01-09T13:30:00Z",
    helpful: 15,
    verified: true,
    aspects: {
      service: 5,
      quality: 5,
      shipping: 5,
      communication: 5,
      value: 5,
    },
    orderVerified: true,
    recommendation: true,
  },
];

export function ShopReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<ShopReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load shop reviews from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SHOP_REVIEWS_KEY);
      if (stored) {
        setReviews(JSON.parse(stored));
      } else {
        // Initialize with sample data
        setReviews(initialShopReviews);
        localStorage.setItem(
          SHOP_REVIEWS_KEY,
          JSON.stringify(initialShopReviews),
        );
      }
    } catch (error) {
      console.error("Failed to load shop reviews:", error);
      setReviews(initialShopReviews);
    }
  }, []);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    if (reviews.length > 0) {
      try {
        localStorage.setItem(SHOP_REVIEWS_KEY, JSON.stringify(reviews));
      } catch (error) {
        console.error("Failed to save shop reviews:", error);
      }
    }
  }, [reviews]);

  const getShopReviews = (shopId: string): ShopReview[] => {
    return reviews.filter((review) => review.shopId === shopId);
  };

  const addShopReview = async (
    shopId: string,
    reviewData: ShopReviewFormData,
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newReview: ShopReview = {
        id: `sr_${Date.now()}`,
        shopId,
        userId: "current_user",
        userName: "Current User", // In real app, get from user context
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop",
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        photos: reviewData.photos.map((file, index) => ({
          id: `photo_${Date.now()}_${index}`,
          url: URL.createObjectURL(file),
          filename: file.name,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        helpful: 0,
        verified: true,
        aspects: reviewData.aspects,
        orderVerified: true,
        recommendation: reviewData.recommendation,
      };

      setReviews((prev) => [newReview, ...prev]);
      toast.success("Review submitted successfully!");
    } catch (err) {
      setError("Failed to submit review");
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const markReviewHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review,
      ),
    );
    toast.success("Thanks for your feedback!");
  };

  const getShopReviewStats = (shopId: string): ShopReviewStats => {
    const shopReviews = getShopReviews(shopId);

    if (shopReviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        aspectRatings: {
          service: 0,
          quality: 0,
          shipping: 0,
          communication: 0,
          value: 0,
        },
        recommendationPercentage: 0,
      };
    }

    const totalReviews = shopReviews.length;
    const averageRating =
      shopReviews.reduce((sum, review) => sum + review.rating, 0) /
      totalReviews;

    const ratingDistribution = shopReviews.reduce(
      (dist, review) => {
        dist[review.rating as keyof typeof dist]++;
        return dist;
      },
      { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    );

    const aspectRatings = shopReviews.reduce(
      (aspects, review) => {
        if (review.aspects.service) aspects.service += review.aspects.service;
        if (review.aspects.quality) aspects.quality += review.aspects.quality;
        if (review.aspects.shipping)
          aspects.shipping += review.aspects.shipping;
        if (review.aspects.communication)
          aspects.communication += review.aspects.communication;
        if (review.aspects.value) aspects.value += review.aspects.value;
        return aspects;
      },
      { service: 0, quality: 0, shipping: 0, communication: 0, value: 0 },
    );

    // Calculate averages for aspects
    Object.keys(aspectRatings).forEach((key) => {
      aspectRatings[key as keyof typeof aspectRatings] =
        aspectRatings[key as keyof typeof aspectRatings] / totalReviews;
    });

    const recommendationCount = shopReviews.filter(
      (review) => review.recommendation,
    ).length;
    const recommendationPercentage = (recommendationCount / totalReviews) * 100;

    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      aspectRatings,
      recommendationPercentage,
    };
  };

  return (
    <ShopReviewContext.Provider
      value={{
        reviews,
        getShopReviews,
        addShopReview,
        markReviewHelpful,
        getShopReviewStats,
        loading,
        error,
      }}
    >
      {children}
    </ShopReviewContext.Provider>
  );
}

export function useShopReviews() {
  const context = useContext(ShopReviewContext);
  if (context === undefined) {
    throw new Error("useShopReviews must be used within a ShopReviewProvider");
  }
  return context;
}
