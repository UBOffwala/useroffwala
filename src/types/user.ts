export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";

  // Address Information
  address: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  // Preferences
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    marketing: boolean;
    language: string;
    currency: string;
  };

  // Account Info
  joinedDate: string;
  lastLogin?: string;
  isVerified: boolean;
}

export interface UserStats {
  totalPurchases: number;
  totalSaved: number;
  reviewsGiven: number;
  memberSince: string;
}

export const defaultUserProfile: UserProfile = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: {
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  },
  preferences: {
    newsletter: true,
    notifications: true,
    marketing: false,
    language: "en",
    currency: "USD",
  },
  joinedDate: new Date().toISOString(),
  isVerified: false,
};
