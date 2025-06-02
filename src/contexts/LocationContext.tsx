import React, { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface LocationContextType {
  currentLocation: Location | null;
  setLocation: (location: Location | null) => void;
  isLocationSet: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

const defaultLocation: Location = {
  id: "default",
  name: "San Francisco, CA",
  city: "San Francisco",
  state: "California",
  country: "United States",
  zipCode: "94102",
  coordinates: {
    lat: 37.7749,
    lng: -122.4194,
  },
};

interface LocationProviderProps {
  children: ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [currentLocation, setCurrentLocation] =
    useLocalStorage<Location | null>("user_location", defaultLocation);

  const setLocation = (location: Location | null) => {
    setCurrentLocation(location);
  };

  const isLocationSet = Boolean(currentLocation);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setLocation,
        isLocationSet,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
