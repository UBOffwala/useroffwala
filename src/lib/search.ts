import { offers } from "@/data/offers";
import { shops } from "@/data/shops";
import { Offer } from "@/types/offer";
import { Shop } from "@/types/shop";

export interface SearchResults {
  offers: Offer[];
  shops: Shop[];
  searchType: "offers" | "shops" | "mixed";
  isShopSearch: boolean;
}

export interface LocationFilter {
  city?: string;
  state?: string;
  area?: string;
}

export interface ShopFilters extends LocationFilter {
  category?: string;
  businessType?: "individual" | "business" | "enterprise";
  verified?: boolean;
  rating?: number;
  sortBy?:
    | "relevance"
    | "rating"
    | "followers"
    | "offers"
    | "alphabetical"
    | "newest";
}

// Keywords that indicate shop search intent
const SHOP_KEYWORDS = [
  "shop",
  "shops",
  "store",
  "stores",
  "seller",
  "sellers",
  "vendor",
  "vendors",
  "business",
  "businesses",
  "boutique",
  "boutiques",
  "market",
  "marketplace",
  "retailer",
  "retailers",
  "dealer",
  "dealers",
];

export function detectSearchIntent(
  query: string,
): "offers" | "shops" | "mixed" {
  const lowerQuery = query.toLowerCase();

  // Check if query contains shop-related keywords
  const hasShopKeywords = SHOP_KEYWORDS.some((keyword) =>
    lowerQuery.includes(keyword),
  );

  // Check for category + shop combinations like "fashion shops"
  const categoryShopPattern =
    /(\w+)\s+(shop|store|seller|vendor|business|boutique)s?/i;
  const hasCategoryShop = categoryShopPattern.test(lowerQuery);

  if (hasShopKeywords || hasCategoryShop) {
    return "shops";
  }

  // If query mentions specific locations, show both
  const locationPattern = /(in|at|near|from)\s+\w+/i;
  if (locationPattern.test(lowerQuery)) {
    return "mixed";
  }

  return "offers";
}

export function searchOffers(query: string): Offer[] {
  const lowercaseQuery = query.toLowerCase();
  return offers.filter(
    (offer) =>
      offer.title.toLowerCase().includes(lowercaseQuery) ||
      offer.description.toLowerCase().includes(lowercaseQuery) ||
      offer.shortDescription.toLowerCase().includes(lowercaseQuery) ||
      offer.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
      offer.category.toLowerCase().includes(lowercaseQuery) ||
      offer.vendor.name.toLowerCase().includes(lowercaseQuery) ||
      offer.location?.toLowerCase().includes(lowercaseQuery),
  );
}

export function searchShops(query: string, filters?: ShopFilters): Shop[] {
  const lowerQuery = query.toLowerCase();

  // Remove shop keywords from query for better matching
  const cleanQuery = SHOP_KEYWORDS.reduce(
    (q, keyword) =>
      q.replace(new RegExp(`\\b${keyword}s?\\b`, "gi"), "").trim(),
    lowerQuery,
  );

  let filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(cleanQuery) ||
      shop.description.toLowerCase().includes(cleanQuery) ||
      shop.categories.some((cat) => cat.toLowerCase().includes(cleanQuery)) ||
      shop.location.toLowerCase().includes(cleanQuery) ||
      shop.city.toLowerCase().includes(cleanQuery) ||
      shop.state.toLowerCase().includes(cleanQuery),
  );

  // Apply filters
  if (filters) {
    if (filters.city) {
      filteredShops = filteredShops.filter((shop) =>
        shop.city.toLowerCase().includes(filters.city!.toLowerCase()),
      );
    }

    if (filters.state) {
      filteredShops = filteredShops.filter((shop) =>
        shop.state.toLowerCase().includes(filters.state!.toLowerCase()),
      );
    }

    if (filters.category) {
      filteredShops = filteredShops.filter((shop) =>
        shop.categories.some((cat) =>
          cat.toLowerCase().includes(filters.category!.toLowerCase()),
        ),
      );
    }

    if (filters.businessType) {
      filteredShops = filteredShops.filter(
        (shop) => shop.businessType === filters.businessType,
      );
    }

    if (filters.verified !== undefined) {
      filteredShops = filteredShops.filter(
        (shop) => shop.verified === filters.verified,
      );
    }

    if (filters.rating) {
      filteredShops = filteredShops.filter(
        (shop) => shop.rating >= filters.rating!,
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "rating":
          filteredShops.sort((a, b) => b.rating - a.rating);
          break;
        case "followers":
          filteredShops.sort(
            (a, b) =>
              (b.stats?.followerCount || 0) - (a.stats?.followerCount || 0),
          );
          break;
        case "offers":
          filteredShops.sort((a, b) => b.totalOffers - a.totalOffers);
          break;
        case "alphabetical":
          filteredShops.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "newest":
          filteredShops.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
        case "relevance":
        default:
          // Keep original order (relevance-based)
          break;
      }
    }
  }

  return filteredShops;
}

export function performSearch(
  query: string,
  shopFilters?: ShopFilters,
): SearchResults {
  const searchType = detectSearchIntent(query);
  const isShopSearch = searchType === "shops";

  let searchResults: SearchResults = {
    offers: [],
    shops: [],
    searchType,
    isShopSearch,
  };

  switch (searchType) {
    case "offers":
      searchResults.offers = searchOffers(query);
      break;
    case "shops":
      searchResults.shops = searchShops(query, shopFilters);
      break;
    case "mixed":
      searchResults.offers = searchOffers(query);
      searchResults.shops = searchShops(query, shopFilters);
      break;
  }

  return searchResults;
}

export function getLocationSuggestions(): {
  cities: string[];
  states: string[];
} {
  const cities = Array.from(new Set(shops.map((shop) => shop.city))).sort();
  const states = Array.from(new Set(shops.map((shop) => shop.state))).sort();

  return { cities, states };
}

export function getShopsByLocationAndCategory(
  location?: string,
  category?: string,
): Shop[] {
  let filteredShops = shops;

  if (location) {
    const lowerLocation = location.toLowerCase();
    filteredShops = filteredShops.filter(
      (shop) =>
        shop.city.toLowerCase().includes(lowerLocation) ||
        shop.state.toLowerCase().includes(lowerLocation) ||
        shop.location.toLowerCase().includes(lowerLocation),
    );
  }

  if (category) {
    filteredShops = filteredShops.filter((shop) =>
      shop.categories.some((cat) =>
        cat.toLowerCase().includes(category.toLowerCase()),
      ),
    );
  }

  return filteredShops;
}
