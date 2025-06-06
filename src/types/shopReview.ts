export interface ShopReviewPhoto {
  id: string;
  url: string;
  filename: string;
}

export interface ShopReview {
  id: string;
  shopId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  photos: ShopReviewPhoto[];
  createdAt: string;
  updatedAt: string;
  helpful: number;
  verified: boolean;
  aspects: {
    service?: number; // Customer service rating (1-5)
    quality?: number; // Product quality rating (1-5)
    shipping?: number; // Shipping speed rating (1-5)
    communication?: number; // Communication rating (1-5)
    value?: number; // Value for money rating (1-5)
  };
  orderVerified?: boolean; // Whether this review is from a verified purchase
  recommendation?: boolean; // Would recommend this shop to others
}

export interface ShopReviewFormData {
  rating: number;
  title: string;
  comment: string;
  photos: File[];
  aspects: {
    service: number;
    quality: number;
    shipping: number;
    communication: number;
    value: number;
  };
  recommendation: boolean;
}

export interface ShopReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  aspectRatings: {
    service: number;
    quality: number;
    shipping: number;
    communication: number;
    value: number;
  };
  recommendationPercentage: number;
}

export interface ShopReviewFilters {
  rating?: number;
  withPhotos?: boolean;
  verified?: boolean;
  orderVerified?: boolean;
  recommendation?: boolean;
  sortBy?: "newest" | "oldest" | "rating-high" | "rating-low" | "helpful";
  aspect?: "service" | "quality" | "shipping" | "communication" | "value";
}
