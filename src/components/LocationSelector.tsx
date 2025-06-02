import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MapPin, ChevronDown, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import { cn } from "@/lib/utils";

interface LocationSelectorProps {
  className?: string;
}

export function LocationSelector({ className }: LocationSelectorProps) {
  const { currentLocation } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const getLocationText = () => {
    if (!currentLocation) return "Select Location";

    // Show city and state abbreviation for compact display
    const stateAbbr = getStateAbbreviation(currentLocation.state);
    return `${currentLocation.city}, ${stateAbbr}`;
  };

  const getStateAbbreviation = (state: string) => {
    const abbreviations: { [key: string]: string } = {
      California: "CA",
      "New York": "NY",
      Texas: "TX",
      Florida: "FL",
      Illinois: "IL",
      // Add more as needed
    };
    return abbreviations[state] || state.substring(0, 2).toUpperCase();
  };

  const popularLocations = [
    {
      id: "1",
      name: "San Francisco, CA",
      city: "San Francisco",
      state: "California",
      country: "United States",
    },
    {
      id: "2",
      name: "New York, NY",
      city: "New York",
      state: "New York",
      country: "United States",
    },
    {
      id: "3",
      name: "Los Angeles, CA",
      city: "Los Angeles",
      state: "California",
      country: "United States",
    },
    {
      id: "4",
      name: "Chicago, IL",
      city: "Chicago",
      state: "Illinois",
      country: "United States",
    },
    {
      id: "5",
      name: "Miami, FL",
      city: "Miami",
      state: "Florida",
      country: "United States",
    },
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 text-gray-700 hover:text-[#1890ff] max-w-[200px] justify-start",
            className,
          )}
        >
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate text-sm">{getLocationText()}</span>
          <ChevronDown className="h-3 w-3 flex-shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Choose Location</h3>
            <Button size="sm" variant="ghost" className="gap-1 text-[#1890ff]">
              <Navigation className="h-3 w-3" />
              Detect
            </Button>
          </div>

          {/* Current Location */}
          {currentLocation && (
            <div className="mb-4 p-3 bg-[#1890ff]/5 rounded-lg border border-[#1890ff]/20">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-[#1890ff]" />
                <span className="font-medium text-sm">Current Location</span>
                <Badge className="bg-[#1890ff] text-white text-xs">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-gray-600 pl-6">
                {currentLocation.name}
              </p>
            </div>
          )}

          {/* Popular Locations */}
          <div className="mb-4">
            <h4 className="font-medium text-sm text-gray-700 mb-2">
              Popular Locations
            </h4>
            <div className="space-y-1">
              {popularLocations.map((location) => (
                <button
                  key={location.id}
                  className="w-full text-left p-2 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    // This would update location context
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">{location.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-3">
            <Link to="/location" onClick={() => setIsOpen(false)}>
              <Button className="w-full gap-2" variant="outline">
                <MapPin className="h-4 w-4" />
                Search All Locations
              </Button>
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
