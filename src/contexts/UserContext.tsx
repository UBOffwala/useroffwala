import React, { createContext, useContext, ReactNode } from "react";
import { UserProfile, UserStats, defaultUserProfile } from "@/types/user";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  stats: UserStats;
  isLoggedIn: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useLocalStorage<UserProfile>("user_profile", {
    ...defaultUserProfile,
    id: "demo-user-123",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Love finding great deals and discovering new products!",
    address: {
      street: "123 Main Street",
      apartment: "Apt 4B",
      city: "San Francisco",
      state: "California",
      zipCode: "94102",
      country: "United States",
    },
    isVerified: true,
    joinedDate: "2023-01-15T00:00:00.000Z",
  });

  const [stats] = useLocalStorage<UserStats>("user_stats", {
    totalPurchases: 12,
    totalSaved: 48,
    reviewsGiven: 8,
    memberSince: "2023-01-15",
  });

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
      address: updates.address
        ? { ...prev.address, ...updates.address }
        : prev.address,
      preferences: updates.preferences
        ? { ...prev.preferences, ...updates.preferences }
        : prev.preferences,
    }));
  };

  const login = (userData: UserProfile) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(defaultUserProfile);
  };

  const isLoggedIn = Boolean(user.id && user.email);

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        stats,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
