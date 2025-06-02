import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Search,
  Navigation,
  ArrowLeft,
  Star,
  TrendingUp,
  Users,
  Building,
  Globe,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation, Location } from "@/contexts/LocationContext";
import { cn } from "@/lib/utils";

const states = [
  {
    id: "ca",
    name: "California",
    cities: [
      "San Francisco",
      "Los Angeles",
      "San Diego",
      "Sacramento",
      "Oakland",
      "Fresno",
    ],
  },
  {
    id: "ny",
    name: "New York",
    cities: [
      "New York City",
      "Buffalo",
      "Rochester",
      "Syracuse",
      "Albany",
      "Yonkers",
    ],
  },
  {
    id: "tx",
    name: "Texas",
    cities: [
      "Houston",
      "San Antonio",
      "Dallas",
      "Austin",
      "Fort Worth",
      "El Paso",
    ],
  },
  {
    id: "fl",
    name: "Florida",
    cities: [
      "Miami",
      "Orlando",
      "Tampa",
      "Jacksonville",
      "Fort Lauderdale",
      "Tallahassee",
    ],
  },
  {
    id: "il",
    name: "Illinois",
    cities: [
      "Chicago",
      "Aurora",
      "Rockford",
      "Joliet",
      "Naperville",
      "Springfield",
    ],
  },
  {
    id: "pa",
    name: "Pennsylvania",
    cities: [
      "Philadelphia",
      "Pittsburgh",
      "Allentown",
      "Erie",
      "Reading",
      "Scranton",
    ],
  },
  {
    id: "oh",
    name: "Ohio",
    cities: [
      "Columbus",
      "Cleveland",
      "Cincinnati",
      "Toledo",
      "Akron",
      "Dayton",
    ],
  },
  {
    id: "ga",
    name: "Georgia",
    cities: ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens", "Macon"],
  },
];

const popularLocations: Location[] = [
  {
    id: "1",
    name: "San Francisco, CA",
    city: "San Francisco",
    state: "California",
    country: "United States",
    zipCode: "94102",
  },
  {
    id: "2",
    name: "New York, NY",
    city: "New York",
    state: "New York",
    country: "United States",
    zipCode: "10001",
  },
  {
    id: "3",
    name: "Los Angeles, CA",
    city: "Los Angeles",
    state: "California",
    country: "United States",
    zipCode: "90210",
  },
  {
    id: "4",
    name: "Chicago, IL",
    city: "Chicago",
    state: "Illinois",
    country: "United States",
    zipCode: "60601",
  },
  {
    id: "5",
    name: "Miami, FL",
    city: "Miami",
    state: "Florida",
    country: "United States",
    zipCode: "33101",
  },
  {
    id: "6",
    name: "Houston, TX",
    city: "Houston",
    state: "Texas",
    country: "United States",
    zipCode: "77001",
  },
  {
    id: "7",
    name: "Phoenix, AZ",
    city: "Phoenix",
    state: "Arizona",
    country: "United States",
    zipCode: "85001",
  },
  {
    id: "8",
    name: "Philadelphia, PA",
    city: "Philadelphia",
    state: "Pennsylvania",
    country: "United States",
    zipCode: "19101",
  },
];

export default function LocationPage() {
  const navigate = useNavigate();
  const { currentLocation, setLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("");

  const handleLocationSelect = (location: Location) => {
    setLocation(location);
    navigate(-1); // Go back to previous page
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          const detectedLocation: Location = {
            id: "detected",
            name: "Current Location",
            city: "San Francisco", // Mock detected city
            state: "California",
            country: "United States",
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          };
          handleLocationSelect(detectedLocation);
        },
        (error) => {
          console.error("Error detecting location:", error);
        },
      );
    }
  };

  const filteredStates = states.filter(
    (state) =>
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.cities.some((city) =>
        city.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const filteredPopularLocations = popularLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Location
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select your location to see relevant offers and deals in your area
            </p>
          </div>
        </div>

        {/* Current Location Display */}
        {currentLocation && (
          <Card className="mb-8 bg-gradient-to-r from-[#1890ff]/5 to-purple-500/5 border-[#1890ff]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1890ff]/10 rounded-full">
                    <MapPin className="h-5 w-5 text-[#1890ff]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Current Location
                    </h3>
                    <p className="text-gray-600">{currentLocation.name}</p>
                  </div>
                  <Badge className="bg-[#1890ff] text-white">Active</Badge>
                </div>
                <Button variant="outline" onClick={() => setLocation(null)}>
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location Detection */}
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <Navigation className="h-12 w-12 text-[#1890ff] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Auto-Detect Location
            </h3>
            <p className="text-gray-600 mb-4">
              Allow us to detect your current location for the most relevant
              deals
            </p>
            <Button onClick={handleDetectLocation} className="gap-2">
              <Navigation className="h-4 w-4" />
              Detect My Location
            </Button>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for city, state, or ZIP code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Selection */}
        <Tabs defaultValue="popular" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="popular" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Popular
            </TabsTrigger>
            <TabsTrigger value="states" className="gap-2">
              <Building className="h-4 w-4" />
              By State
            </TabsTrigger>
            <TabsTrigger value="international" className="gap-2">
              <Globe className="h-4 w-4" />
              International
            </TabsTrigger>
          </TabsList>

          <TabsContent value="popular" className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Popular Locations
              </h3>
              <p className="text-gray-600">
                Most searched locations by our users
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPopularLocations.map((location) => (
                <Card
                  key={location.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => handleLocationSelect(location)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#1890ff]/10 rounded-full">
                        <MapPin className="h-5 w-5 text-[#1890ff]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {location.city}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {location.state}
                        </p>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Star className="h-3 w-3" />
                        Popular
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="states" className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Browse by State
              </h3>
              <p className="text-gray-600">
                Select your state to see available cities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStates.map((state) => (
                <Card
                  key={state.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-[#1890ff]" />
                      {state.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {state.cities.map((city) => (
                        <Button
                          key={city}
                          variant="ghost"
                          size="sm"
                          className="justify-start text-left"
                          onClick={() =>
                            handleLocationSelect({
                              id: `${state.id}-${city.toLowerCase().replace(" ", "-")}`,
                              name: `${city}, ${state.name.substring(0, 2).toUpperCase()}`,
                              city: city,
                              state: state.name,
                              country: "United States",
                            })
                          }
                        >
                          {city}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="international" className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                International Locations
              </h3>
              <p className="text-gray-600">
                Coming soon - International shipping and locations
              </p>
            </div>

            <Card className="text-center p-12">
              <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                International Expansion Coming Soon
              </h4>
              <p className="text-gray-600 mb-4">
                We're working hard to bring OfferHub to more countries around
                the world.
              </p>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Join Waitlist
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
