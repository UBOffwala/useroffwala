import React, { createContext, useContext, ReactNode } from "react";
import { Offer } from "@/types/offer";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface WishlistContextType {
  wishlist: Offer[];
  addToWishlist: (offer: Offer) => void;
  removeFromWishlist: (offerId: string) => void;
  isInWishlist: (offerId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

interface WishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [wishlist, setWishlist] = useLocalStorage<Offer[]>("wishlist", []);

  const addToWishlist = (offer: Offer) => {
    setWishlist((prev) => {
      // Check if offer is already in wishlist
      if (prev.some((item) => item.id === offer.id)) {
        return prev;
      }
      return [...prev, offer];
    });
  };

  const removeFromWishlist = (offerId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== offerId));
  };

  const isInWishlist = (offerId: string) => {
    return wishlist.some((item) => item.id === offerId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
