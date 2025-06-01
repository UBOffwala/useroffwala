import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Flame,
  Clock,
  MapPin,
  TrendingUp,
  Star,
  ArrowRight,
  Timer,
} from "lucide-react";
import { OfferCard } from "@/components/OfferCard";
import { offers } from "@/data/offers";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  endTime: string;
}

function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    return Math.max(0, end - now);
  });

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="flex items-center gap-2 text-red-600">
      <Timer className="h-4 w-4" />
      <span className="font-mono font-bold">
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}

export function TopDealsSection() {
  // Get top deals based on discount percentage
  const topDeals = offers
    .filter((offer) => offer.discount && offer.discount > 30)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 6);

  // Get trending products (high rating + many reviews)
  const trendingDeals = offers
    .filter((offer) => offer.rating >= 4.5 && offer.reviewCount > 500)
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 6);

  // Mock flash deals (time-limited offers)
  const flashDeals = offers
    .filter((offer) => offer.isNew && offer.discount)
    .slice(0, 4);

  // Mock location-based deals
  const localDeals = offers
    .filter(
      (offer) =>
        offer.location?.includes("San Francisco") ||
        offer.location?.includes("CA"),
    )
    .slice(0, 6);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="top-deals" className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Amazing Deals & Offers
            </h2>
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
              <TabsTrigger value="top-deals" className="gap-2">
                <Flame className="h-4 w-4" />
                <span className="hidden sm:inline">Top Deals</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Trending</span>
              </TabsTrigger>
              <TabsTrigger value="flash" className="gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Flash Sale</span>
              </TabsTrigger>
              <TabsTrigger value="local" className="gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Near You</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="top-deals" className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🔥 Hottest Deals Right Now
              </h3>
              <p className="text-gray-600">
                Save big with our top-rated discounts and offers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topDeals.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>

            <div className="text-center">
              <Link to="/?discount=true">
                <Button className="bg-[#1890ff] hover:bg-[#1890ff]/90 gap-2">
                  View All Top Deals
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                📈 Trending Now
              </h3>
              <p className="text-gray-600">
                Most popular products everyone's talking about
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingDeals.map((offer) => (
                <div key={offer.id} className="relative">
                  <OfferCard offer={offer} />
                  <Badge className="absolute top-2 left-2 bg-orange-500 text-white gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Trending
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="flash" className="space-y-6">
            <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                  <Clock className="h-6 w-6" />⚡ Flash Sale - Limited Time!
                </CardTitle>
                <div className="flex items-center justify-center gap-4">
                  <p>Hurry up! These deals won't last long</p>
                  <CountdownTimer endTime="2024-02-01T23:59:59" />
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {flashDeals.map((offer) => (
                <div key={offer.id} className="relative">
                  <OfferCard offer={offer} />
                  <div className="absolute top-2 right-2">
                    <CountdownTimer endTime="2024-02-01T23:59:59" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="local" className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                📍 Latest in Your Area
              </h3>
              <p className="text-gray-600">
                Discover great deals from sellers near San Francisco, CA
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localDeals.map((offer) => (
                <div key={offer.id} className="relative">
                  <OfferCard offer={offer} />
                  <Badge className="absolute top-2 left-2 bg-green-500 text-white gap-1">
                    <MapPin className="h-3 w-3" />
                    Local
                  </Badge>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/?location=san-francisco">
                <Button
                  variant="outline"
                  className="gap-2 hover:border-[#1890ff] hover:text-[#1890ff]"
                >
                  <MapPin className="h-4 w-4" />
                  View All Local Deals
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
