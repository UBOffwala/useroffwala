import { Offer, Category } from "@/types/offer";

export const categories: Category[] = [
  { id: "electronics", name: "Electronics", icon: "📱", count: 245 },
  { id: "fashion", name: "Fashion", icon: "👕", count: 189 },
  { id: "home", name: "Home & Garden", icon: "🏠", count: 156 },
  { id: "automotive", name: "Automotive", icon: "🚗", count: 98 },
  { id: "sports", name: "Sports & Fitness", icon: "⚽", count: 134 },
  { id: "beauty", name: "Beauty & Health", icon: "💄", count: 167 },
  { id: "books", name: "Books & Media", icon: "📚", count: 89 },
  { id: "travel", name: "Travel & Leisure", icon: "✈️", count: 76 },
];

export const offers: Offer[] = [
  {
    id: "1",
    title: "iPhone 15 Pro Max - Latest Model",
    description:
      "Experience the pinnacle of smartphone technology with the iPhone 15 Pro Max. Featuring the powerful A17 Pro chip, advanced camera system with 5x optical zoom, and stunning titanium design. Perfect for professionals and tech enthusiasts.",
    shortDescription: "Latest iPhone with A17 Pro chip and titanium design",
    price: 999,
    originalPrice: 1199,
    discount: 17,
    category: "electronics",
    images: [
      "https://picsum.photos/600/400?random=1",
      "https://picsum.photos/600/400?random=2",
      "https://picsum.photos/600/400?random=3",
      "https://picsum.photos/600/400?random=4",
    ],
    vendor: {
      name: "TechWorld Electronics",
      rating: 4.8,
      verified: true,
    },
    features: [
      "A17 Pro Chip",
      "48MP Camera System",
      "5x Optical Zoom",
      "Titanium Build",
      "USB-C Connectivity",
      "Action Button",
    ],
    rating: 4.9,
    reviewCount: 1247,
    isNew: true,
    isFeatured: true,
    location: "New York, NY",
    tags: ["premium", "latest", "smartphone", "apple"],
  },
  {
    id: "2",
    title: "Designer Winter Coat - Premium Quality",
    description:
      "Stay warm and stylish with this premium winter coat. Made from high-quality materials with water-resistant coating and luxury fur trim. Perfect for cold weather and formal occasions.",
    shortDescription: "Premium winter coat with fur trim",
    price: 299,
    originalPrice: 499,
    discount: 40,
    category: "fashion",
    images: [
      "https://picsum.photos/600/400?random=5",
      "https://picsum.photos/600/400?random=6",
      "https://picsum.photos/600/400?random=7",
    ],
    vendor: {
      name: "Fashion Forward",
      rating: 4.6,
      verified: true,
    },
    features: [
      "Water Resistant",
      "Luxury Fur Trim",
      "Premium Materials",
      "Multiple Colors",
      "Size Guide Available",
    ],
    rating: 4.7,
    reviewCount: 523,
    isNew: false,
    isFeatured: true,
    location: "Los Angeles, CA",
    tags: ["winter", "coat", "premium", "fashion"],
  },
  {
    id: "3",
    title: "Smart Home Security System",
    description:
      "Complete smart home security solution with wireless cameras, motion sensors, and mobile app control. Easy installation and 24/7 monitoring capabilities.",
    shortDescription: "Complete smart security system with cameras",
    price: 449,
    originalPrice: 699,
    discount: 36,
    category: "home",
    images: [
      "https://picsum.photos/600/400?random=8",
      "https://picsum.photos/600/400?random=9",
      "https://picsum.photos/600/400?random=10",
    ],
    vendor: {
      name: "Home & Garden Paradise",
      rating: 4.5,
      verified: true,
    },
    features: [
      "Wireless Installation",
      "Mobile App Control",
      "Night Vision",
      "Motion Detection",
      "Cloud Storage",
      "24/7 Monitoring",
    ],
    rating: 4.6,
    reviewCount: 341,
    isNew: true,
    isFeatured: false,
    location: "Chicago, IL",
    tags: ["smart", "security", "home", "wireless"],
  },
  {
    id: "4",
    title: "Professional Gaming Setup - Complete Package",
    description:
      "Ultimate gaming experience with high-performance gaming chair, mechanical keyboard, precision mouse, and RGB lighting. Perfect for esports and streaming.",
    shortDescription: "Complete professional gaming setup",
    price: 799,
    originalPrice: 1199,
    discount: 33,
    category: "electronics",
    images: [
      "https://picsum.photos/600/400?random=11",
      "https://picsum.photos/600/400?random=12",
      "https://picsum.photos/600/400?random=13",
    ],
    vendor: {
      name: "TechWorld Electronics",
      rating: 4.9,
      verified: true,
    },
    features: [
      "Ergonomic Chair",
      "Mechanical Keyboard",
      "Precision Mouse",
      "RGB Lighting",
      "Cable Management",
      "Adjustable Height",
    ],
    rating: 4.8,
    reviewCount: 892,
    isNew: false,
    isFeatured: true,
    location: "Austin, TX",
    tags: ["gaming", "setup", "chair", "rgb", "esports"],
  },
  {
    id: "5",
    title: "Luxury Watch Collection - Swiss Made",
    description:
      "Exquisite Swiss-made luxury watch with automatic movement, sapphire crystal, and premium leather strap. A timeless piece for the discerning collector.",
    shortDescription: "Swiss-made luxury watch with automatic movement",
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    category: "fashion",
    images: [
      "https://picsum.photos/600/400?random=14",
      "https://picsum.photos/600/400?random=15",
      "https://picsum.photos/600/400?random=16",
    ],
    vendor: {
      name: "Timepiece Masters",
      rating: 4.9,
      verified: true,
    },
    features: [
      "Swiss Movement",
      "Sapphire Crystal",
      "Leather Strap",
      "Water Resistant",
      "Limited Edition",
      "Certificate of Authenticity",
    ],
    rating: 4.9,
    reviewCount: 178,
    isNew: true,
    isFeatured: true,
    location: "San Francisco, CA",
    tags: ["luxury", "watch", "swiss", "automatic", "premium"],
  },
  {
    id: "6",
    title: "Professional Fitness Equipment Set",
    description:
      "Complete home gym solution with adjustable dumbbells, resistance bands, yoga mat, and workout guide. Perfect for maintaining fitness at home.",
    shortDescription: "Complete home gym equipment set",
    price: 349,
    originalPrice: 599,
    discount: 42,
    category: "sports",
    images: [
      "https://picsum.photos/600/400?random=17",
      "https://picsum.photos/600/400?random=18",
      "https://picsum.photos/600/400?random=19",
    ],
    vendor: {
      name: "FitLife Pro",
      rating: 4.4,
      verified: true,
    },
    features: [
      "Adjustable Dumbbells",
      "Resistance Bands",
      "Yoga Mat",
      "Workout Guide",
      "Storage Rack",
      "Non-slip Base",
    ],
    rating: 4.5,
    reviewCount: 667,
    isNew: false,
    isFeatured: false,
    location: "Miami, FL",
    tags: ["fitness", "home gym", "dumbbells", "workout", "health"],
  },
  {
    id: "7",
    title: "Vintage Car Restoration Project - Classic Mustang",
    description:
      "1967 Ford Mustang restoration project. Solid frame, original engine block, and complete documentation. Perfect for classic car enthusiasts.",
    shortDescription: "1967 Ford Mustang restoration project",
    price: 15999,
    originalPrice: 25000,
    discount: 36,
    category: "automotive",
    images: [
      "https://picsum.photos/600/400?random=20",
      "https://picsum.photos/600/400?random=21",
      "https://picsum.photos/600/400?random=22",
    ],
    vendor: {
      name: "Classic Auto Restorations",
      rating: 4.7,
      verified: true,
    },
    features: [
      "Original Engine Block",
      "Solid Frame",
      "Complete Documentation",
      "Matching Numbers",
      "Title Included",
      "Restoration Guide",
    ],
    rating: 4.6,
    reviewCount: 43,
    isNew: false,
    isFeatured: true,
    location: "Detroit, MI",
    tags: ["vintage", "car", "mustang", "restoration", "classic"],
  },
  {
    id: "8",
    title: "Premium Skincare Bundle - Anti-Aging Collection",
    description:
      "Complete anti-aging skincare routine with vitamin C serum, retinol cream, hyaluronic acid, and SPF moisturizer. Dermatologist recommended.",
    shortDescription: "Complete anti-aging skincare collection",
    price: 199,
    originalPrice: 299,
    discount: 33,
    category: "beauty",
    images: [
      "https://picsum.photos/600/400?random=23",
      "https://picsum.photos/600/400?random=24",
      "https://picsum.photos/600/400?random=25",
    ],
    vendor: {
      name: "Beauty Luxe",
      rating: 4.8,
      verified: true,
    },
    features: [
      "Vitamin C Serum",
      "Retinol Cream",
      "Hyaluronic Acid",
      "SPF Moisturizer",
      "Dermatologist Tested",
      "Natural Ingredients",
    ],
    rating: 4.7,
    reviewCount: 1156,
    isNew: true,
    isFeatured: false,
    location: "Beverly Hills, CA",
    tags: ["skincare", "anti-aging", "serum", "beauty", "premium"],
  },
];
