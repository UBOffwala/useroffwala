import { Shop } from "@/types/shop";

export const shops: Shop[] = [
  {
    id: "shop_1",
    name: "TechWorld Electronics",
    description:
      "Leading electronics retailer with premium gadgets and accessories. We specialize in the latest smartphones, laptops, gaming gear, and smart home devices. Our mission is to bring cutting-edge technology to everyone at affordable prices.",
    avatar:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 1250,
    verified: true,
    location: "San Francisco, CA 94105",
    city: "San Francisco",
    state: "California",
    zipCode: "94105",
    businessType: "business",
    categories: ["Electronics", "Gadgets", "Mobile", "Computers"],
    totalOffers: 156,
    establishedYear: 2015,
    website: "https://techworld-electronics.com",
    phone: "+1 (555) 123-4567",
    email: "contact@techworld-electronics.com",
    workingHours: {
      monday: "9:00 AM - 8:00 PM",
      tuesday: "9:00 AM - 8:00 PM",
      wednesday: "9:00 AM - 8:00 PM",
      thursday: "9:00 AM - 8:00 PM",
      friday: "9:00 AM - 9:00 PM",
      saturday: "10:00 AM - 7:00 PM",
      sunday: "11:00 AM - 6:00 PM",
      timezone: "PST",
      note: "Extended hours during holiday seasons",
    },
    sellerInfo: {
      ownerName: "Michael Chen",
      businessLicense: "BL-SF-2015-001234",
      experience: "8+ years in electronics retail",
      specializations: [
        "Smartphones",
        "Laptops",
        "Gaming Equipment",
        "Smart Home",
      ],
      languages: ["English", "Mandarin", "Spanish"],
      certifications: [
        "Apple Certified Reseller",
        "Samsung Partner",
        "Google Partner",
      ],
    },
    socialLinks: {
      website: "https://techworld-electronics.com",
      facebook: "https://facebook.com/techworld",
      twitter: "https://twitter.com/techworld",
      instagram: "https://instagram.com/techworld",
    },
    policies: {
      returnPolicy: "30-day return policy for all items",
      shippingPolicy: "Free shipping on orders over $50",
      privacyPolicy: "We respect your privacy and protect your data",
    },
    stats: {
      totalSales: 12500,
      responseTime: "< 2 hours",
      followerCount: 4200,
      averageShippingTime: "2-3 days",
    },
    createdAt: "2015-03-15T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "shop_2",
    name: "Fashion Forward",
    description:
      "Trendy fashion boutique with latest styles and accessories for men and women. From casual wear to formal attire, we have everything you need to stay fashionable and confident.",
    avatar:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 890,
    verified: true,
    location: "New York, NY 10001",
    city: "New York",
    state: "New York",
    zipCode: "10001",
    businessType: "business",
    categories: ["Fashion", "Clothing", "Accessories", "Shoes"],
    totalOffers: 234,
    establishedYear: 2018,
    website: "https://fashionforward.com",
    phone: "+1 (555) 987-6543",
    email: "hello@fashionforward.com",
    workingHours: {
      monday: "10:00 AM - 7:00 PM",
      tuesday: "10:00 AM - 7:00 PM",
      wednesday: "10:00 AM - 7:00 PM",
      thursday: "10:00 AM - 8:00 PM",
      friday: "10:00 AM - 8:00 PM",
      saturday: "9:00 AM - 9:00 PM",
      sunday: "12:00 PM - 6:00 PM",
      timezone: "EST",
      note: "Online orders processed 24/7",
    },
    sellerInfo: {
      ownerName: "Sarah Johnson",
      businessLicense: "BL-NY-2018-005678",
      experience: "6+ years in fashion retail",
      specializations: [
        "Women's Fashion",
        "Accessories",
        "Seasonal Collections",
        "Custom Styling",
      ],
      languages: ["English", "French", "Italian"],
      certifications: [
        "Fashion Merchandising Certificate",
        "Personal Stylist Certification",
      ],
    },
    socialLinks: {
      website: "https://fashionforward.com",
      facebook: "https://facebook.com/fashionforward",
      instagram: "https://instagram.com/fashionforward",
    },
    policies: {
      returnPolicy: "14-day return policy with tags attached",
      shippingPolicy: "Free shipping on orders over $75",
      privacyPolicy: "Your privacy is our priority",
    },
    stats: {
      totalSales: 8900,
      responseTime: "< 4 hours",
      followerCount: 3100,
      averageShippingTime: "3-5 days",
    },
    createdAt: "2018-06-20T00:00:00Z",
    updatedAt: "2024-01-14T15:45:00Z",
  },
  {
    id: "shop_3",
    name: "Home & Garden Paradise",
    description:
      "Everything for your home and garden needs. From furniture to gardening tools, home decor to outdoor equipment, we help you create the perfect living space.",
    avatar:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 670,
    verified: true,
    location: "Austin, TX 73301",
    city: "Austin",
    state: "Texas",
    zipCode: "73301",
    businessType: "business",
    categories: ["Home", "Garden", "Furniture", "Decor"],
    totalOffers: 189,
    establishedYear: 2012,
    website: "https://homegardenparadise.com",
    phone: "+1 (555) 456-7890",
    email: "info@homegardenparadise.com",
    workingHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "8:00 AM - 5:00 PM",
      sunday: "10:00 AM - 4:00 PM",
      timezone: "CST",
      note: "Seasonal hours may vary, call ahead for delivery services",
    },
    sellerInfo: {
      ownerName: "Robert & Maria Garcia",
      businessLicense: "BL-TX-2012-003456",
      experience: "12+ years in home and garden retail",
      specializations: [
        "Outdoor Furniture",
        "Garden Plants",
        "Home Decor",
        "Landscape Design",
      ],
      languages: ["English", "Spanish"],
      certifications: [
        "Master Gardener Certification",
        "Interior Design Certificate",
      ],
    },
    socialLinks: {
      website: "https://homegardenparadise.com",
      facebook: "https://facebook.com/homegardenparadise",
    },
    policies: {
      returnPolicy: "30-day return policy for unused items",
      shippingPolicy: "Local delivery available for furniture",
      privacyPolicy: "We protect your personal information",
    },
    stats: {
      totalSales: 5600,
      responseTime: "< 6 hours",
      followerCount: 1800,
      averageShippingTime: "5-7 days",
    },
    createdAt: "2012-08-10T00:00:00Z",
    updatedAt: "2024-01-13T09:20:00Z",
  },
  {
    id: "shop_4",
    name: "Sports Arena",
    description:
      "Premium sports equipment and athletic wear for all your fitness needs. Whether you're a professional athlete or weekend warrior, we have the gear to help you perform your best.",
    avatar:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 445,
    verified: false,
    location: "Miami, FL 33101",
    city: "Miami",
    state: "Florida",
    zipCode: "33101",
    businessType: "individual",
    categories: ["Sports", "Fitness", "Outdoor", "Athletic Wear"],
    totalOffers: 98,
    establishedYear: 2020,
    phone: "+1 (555) 321-0987",
    email: "contact@sportsarena.com",
    workingHours: {
      monday: "6:00 AM - 9:00 PM",
      tuesday: "6:00 AM - 9:00 PM",
      wednesday: "6:00 AM - 9:00 PM",
      thursday: "6:00 AM - 9:00 PM",
      friday: "6:00 AM - 10:00 PM",
      saturday: "7:00 AM - 10:00 PM",
      sunday: "8:00 AM - 8:00 PM",
      timezone: "EST",
      note: "Early morning and late evening hours for fitness enthusiasts",
    },
    sellerInfo: {
      ownerName: "Jake Martinez",
      experience: "4+ years in sports equipment",
      specializations: [
        "Athletic Wear",
        "Fitness Equipment",
        "Outdoor Gear",
        "Nutrition Supplements",
      ],
      languages: ["English", "Spanish"],
      certifications: [
        "Personal Trainer Certification",
        "Sports Equipment Specialist",
      ],
    },
    socialLinks: {
      instagram: "https://instagram.com/sportsarena",
    },
    policies: {
      returnPolicy: "15-day return policy for defective items",
      shippingPolicy: "Standard shipping rates apply",
      privacyPolicy: "Basic privacy protection",
    },
    stats: {
      totalSales: 2200,
      responseTime: "< 12 hours",
      followerCount: 850,
      averageShippingTime: "4-6 days",
    },
    createdAt: "2020-01-05T00:00:00Z",
    updatedAt: "2024-01-12T14:10:00Z",
  },
  {
    id: "shop_5",
    name: "Automotive Pro",
    description:
      "Professional automotive parts and accessories for all vehicle types. We serve mechanics, dealerships, and car enthusiasts with high-quality OEM and aftermarket parts.",
    avatar:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=100&h=100&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=300&fit=crop",
    rating: 4.4,
    reviewCount: 789,
    verified: true,
    location: "Detroit, MI 48201",
    city: "Detroit",
    state: "Michigan",
    zipCode: "48201",
    businessType: "enterprise",
    categories: ["Automotive", "Parts", "Accessories", "Tools"],
    totalOffers: 312,
    establishedYear: 2008,
    website: "https://automotivepro.com",
    phone: "+1 (555) 111-2222",
    email: "sales@automotivepro.com",
    workingHours: {
      monday: "7:00 AM - 6:00 PM",
      tuesday: "7:00 AM - 6:00 PM",
      wednesday: "7:00 AM - 6:00 PM",
      thursday: "7:00 AM - 6:00 PM",
      friday: "7:00 AM - 6:00 PM",
      saturday: "8:00 AM - 4:00 PM",
      sunday: "Closed",
      timezone: "EST",
      note: "Emergency parts available 24/7 by appointment",
    },
    sellerInfo: {
      ownerName: "David Thompson",
      businessLicense: "BL-MI-2008-007890",
      taxId: "TAX-MI-123456789",
      experience: "16+ years in automotive industry",
      specializations: [
        "OEM Parts",
        "Performance Upgrades",
        "Diagnostic Tools",
        "Commercial Fleet",
      ],
      languages: ["English"],
      certifications: [
        "ASE Master Mechanic",
        "Parts Specialist Certification",
        "Fleet Management",
      ],
    },
    socialLinks: {
      website: "https://automotivepro.com",
      facebook: "https://facebook.com/automotivepro",
    },
    policies: {
      returnPolicy: "90-day warranty on all parts",
      shippingPolicy: "Next-day delivery available",
      privacyPolicy: "Enterprise-grade data protection",
    },
    stats: {
      totalSales: 18500,
      responseTime: "< 1 hour",
      followerCount: 6200,
      averageShippingTime: "1-2 days",
    },
    createdAt: "2008-11-22T00:00:00Z",
    updatedAt: "2024-01-15T11:50:00Z",
  },
  {
    id: "shop_6",
    name: "Beauty Bliss",
    description:
      "Your ultimate destination for beauty and skincare products. From makeup to skincare, haircare to fragrances, we offer premium beauty products from top brands.",
    avatar:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 1100,
    verified: true,
    location: "Los Angeles, CA 90210",
    city: "Los Angeles",
    state: "California",
    zipCode: "90210",
    businessType: "business",
    categories: ["Beauty", "Skincare", "Makeup", "Fragrance"],
    totalOffers: 267,
    establishedYear: 2019,
    website: "https://beautybliss.com",
    phone: "+1 (555) 777-8888",
    email: "info@beautybliss.com",
    workingHours: {
      monday: "9:00 AM - 8:00 PM",
      tuesday: "9:00 AM - 8:00 PM",
      wednesday: "9:00 AM - 8:00 PM",
      thursday: "9:00 AM - 9:00 PM",
      friday: "9:00 AM - 9:00 PM",
      saturday: "9:00 AM - 9:00 PM",
      sunday: "11:00 AM - 7:00 PM",
      timezone: "PST",
      note: "Virtual consultations available outside business hours",
    },
    sellerInfo: {
      ownerName: "Isabella Rodriguez",
      businessLicense: "BL-CA-2019-009876",
      experience: "5+ years in beauty industry",
      specializations: [
        "Skincare Consultation",
        "Makeup Artistry",
        "Product Curation",
        "Beauty Education",
      ],
      languages: ["English", "Spanish", "Portuguese"],
      certifications: [
        "Licensed Esthetician",
        "Makeup Artist Certification",
        "Beauty Business Management",
      ],
    },
    socialLinks: {
      website: "https://beautybliss.com",
      instagram: "https://instagram.com/beautybliss",
      twitter: "https://twitter.com/beautybliss",
    },
    policies: {
      returnPolicy: "30-day return policy for unopened items",
      shippingPolicy: "Free shipping on orders over $35",
      privacyPolicy: "Comprehensive privacy protection",
    },
    stats: {
      totalSales: 15600,
      responseTime: "< 3 hours",
      followerCount: 7800,
      averageShippingTime: "2-4 days",
    },
    createdAt: "2019-04-12T00:00:00Z",
    updatedAt: "2024-01-15T16:25:00Z",
  },
];

export const getShopById = (id: string): Shop | undefined => {
  return shops.find((shop) => shop.id === id);
};

export const getShopsByCategory = (category: string): Shop[] => {
  return shops.filter((shop) =>
    shop.categories.some((cat) =>
      cat.toLowerCase().includes(category.toLowerCase()),
    ),
  );
};

export const getShopsByLocation = (city?: string, state?: string): Shop[] => {
  return shops.filter((shop) => {
    if (city && shop.city.toLowerCase() !== city.toLowerCase()) return false;
    if (state && shop.state.toLowerCase() !== state.toLowerCase()) return false;
    return true;
  });
};

export const searchShops = (query: string): Shop[] => {
  const lowerQuery = query.toLowerCase();
  return shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(lowerQuery) ||
      shop.description.toLowerCase().includes(lowerQuery) ||
      shop.categories.some((cat) => cat.toLowerCase().includes(lowerQuery)) ||
      shop.location.toLowerCase().includes(lowerQuery),
  );
};
