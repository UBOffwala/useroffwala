export interface Offer {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  images: string[];
  vendor: {
    name: string;
    rating: number;
    verified: boolean;
  };
  features: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  expiresAt?: Date;
  location?: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface FilterOptions {
  category?: string;
  priceRange?: [number, number];
  rating?: number;
  location?: string;
  sortBy?: "price" | "rating" | "newest" | "discount";
}
