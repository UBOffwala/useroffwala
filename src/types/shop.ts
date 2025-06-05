export interface Shop {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  location: string;
  city: string;
  state: string;
  zipCode: string;
  businessType: "individual" | "business" | "enterprise";
  categories: string[];
  totalOffers: number;
  establishedYear?: number;
  website?: string;
  phone?: string;
  email?: string;
  workingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
    timezone?: string;
    note?: string;
  };
  sellerInfo?: {
    ownerName?: string;
    businessLicense?: string;
    taxId?: string;
    bankingInfo?: string;
    experience?: string;
    specializations?: string[];
    languages?: string[];
    certifications?: string[];
  };
  socialLinks?: {
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  policies?: {
    returnPolicy?: string;
    shippingPolicy?: string;
    privacyPolicy?: string;
  };
  stats?: {
    totalSales: number;
    responseTime: string;
    followerCount: number;
    averageShippingTime: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ShopFollowing {
  shopId: string;
  userId: string;
  followedAt: string;
}

export interface ShopFilters {
  city?: string;
  state?: string;
  businessType?: "individual" | "business" | "enterprise";
  category?: string;
  rating?: number;
  verified?: boolean;
  sortBy?: "newest" | "rating" | "followers" | "offers" | "alphabetical";
}
