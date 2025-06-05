import { Offer, FilterOptions } from "@/types/offer";
import { offers } from "@/data/offers";

export function getAllOffers(): Offer[] {
  return offers;
}

export function getOfferById(id: string): Offer | undefined {
  return offers.find((offer) => offer.id === id);
}

export function getFeaturedOffers(): Offer[] {
  return offers.filter((offer) => offer.isFeatured);
}

export function getOffersByCategory(category: string): Offer[] {
  return offers.filter((offer) => offer.category === category);
}

export function filterOffers(filters: FilterOptions): Offer[] {
  let filteredOffers = [...offers];

  if (filters.category) {
    filteredOffers = filteredOffers.filter(
      (offer) => offer.category === filters.category,
    );
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filteredOffers = filteredOffers.filter(
      (offer) => offer.price >= min && offer.price <= max,
    );
  }

  if (filters.rating) {
    filteredOffers = filteredOffers.filter(
      (offer) => offer.rating >= filters.rating,
    );
  }

  if (filters.location) {
    filteredOffers = filteredOffers.filter((offer) =>
      offer.location?.toLowerCase().includes(filters.location!.toLowerCase()),
    );
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price":
        filteredOffers.sort((a, b) => a.price - b.price);
        break;
      case "rating":
        filteredOffers.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filteredOffers.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "discount":
        filteredOffers.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
    }
  }

  return filteredOffers;
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

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function calculateSavings(
  price: number,
  originalPrice?: number,
): number {
  if (!originalPrice) return 0;
  return originalPrice - price;
}

export function getDiscountPercentage(
  price: number,
  originalPrice?: number,
): number {
  if (!originalPrice) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
