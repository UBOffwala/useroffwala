import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Shop, ShopFollowing } from "@/types/shop";

interface ShopContextType {
  followedShops: Shop[];
  followShop: (shop: Shop) => void;
  unfollowShop: (shopId: string) => void;
  isFollowing: (shopId: string) => boolean;
  getFollowedShopsCount: () => number;
  clearFollowedShops: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const FOLLOWED_SHOPS_KEY = "offerhub_followed_shops";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [followedShops, setFollowedShops] = useState<Shop[]>([]);

  // Load followed shops from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FOLLOWED_SHOPS_KEY);
      if (stored) {
        setFollowedShops(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load followed shops:", error);
    }
  }, []);

  // Save followed shops to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(FOLLOWED_SHOPS_KEY, JSON.stringify(followedShops));
    } catch (error) {
      console.error("Failed to save followed shops:", error);
    }
  }, [followedShops]);

  const followShop = (shop: Shop) => {
    setFollowedShops((prev) => {
      const isAlreadyFollowing = prev.some((s) => s.id === shop.id);
      if (isAlreadyFollowing) return prev;

      return [
        ...prev,
        {
          ...shop,
          stats: {
            ...shop.stats,
            followerCount: (shop.stats?.followerCount || 0) + 1,
          },
        },
      ];
    });
  };

  const unfollowShop = (shopId: string) => {
    setFollowedShops((prev) => prev.filter((shop) => shop.id !== shopId));
  };

  const isFollowing = (shopId: string): boolean => {
    return followedShops.some((shop) => shop.id === shopId);
  };

  const getFollowedShopsCount = (): number => {
    return followedShops.length;
  };

  const clearFollowedShops = () => {
    setFollowedShops([]);
  };

  return (
    <ShopContext.Provider
      value={{
        followedShops,
        followShop,
        unfollowShop,
        isFollowing,
        getFollowedShopsCount,
        clearFollowedShops,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
