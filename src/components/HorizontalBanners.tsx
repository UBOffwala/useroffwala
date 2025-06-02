import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Zap,
  Sparkles,
  Calendar,
  ShoppingBag,
  Percent,
  Crown,
  Star,
  Clock,
  Target,
  Heart,
  Flame,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BannerData {
  id: string;
  type:
    | "festival"
    | "megasale"
    | "season"
    | "flash"
    | "weekend"
    | "limited"
    | "special"
    | "trending";
  title: string;
  subtitle: string;
  discount?: string;
  endDate?: string;
  bgGradient: string;
  textColor?: string;
  link?: string;
  image?: string;
  featured?: boolean;
}

const bannerData: BannerData[] = [
  {
    id: "1",
    type: "megasale",
    title: "MEGA WINTER SALE",
    subtitle: "Up to 80% off on winter collection",
    discount: "80% OFF",
    endDate: "Feb 15, 2024",
    bgGradient: "bg-gradient-to-r from-red-500 via-pink-500 to-purple-600",
    link: "/?discount=true",
    featured: true,
  },
  {
    id: "2",
    type: "festival",
    title: "Valentine Special",
    subtitle: "Perfect gifts for your loved ones",
    discount: "50% OFF",
    endDate: "Feb 14, 2024",
    bgGradient: "bg-gradient-to-r from-pink-400 via-red-400 to-pink-600",
    link: "/?category=fashion",
  },
  {
    id: "3",
    type: "flash",
    title: "FLASH DEAL",
    subtitle: "Limited time electronics sale",
    discount: "60% OFF",
    endDate: "Today Only",
    bgGradient: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
    link: "/?category=electronics",
  },
  {
    id: "4",
    type: "season",
    title: "Spring Collection",
    subtitle: "Fresh arrivals for the new season",
    discount: "40% OFF",
    endDate: "Mar 31, 2024",
    bgGradient: "bg-gradient-to-r from-green-400 via-blue-500 to-purple-600",
    link: "/?new=true",
  },
  {
    id: "5",
    type: "weekend",
    title: "Weekend Warriors",
    subtitle: "Sports & fitness gear deals",
    discount: "45% OFF",
    endDate: "This Weekend",
    bgGradient: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500",
    link: "/?category=sports",
  },
  {
    id: "6",
    type: "special",
    title: "Premium Brands",
    subtitle: "Luxury items at unbeatable prices",
    discount: "30% OFF",
    endDate: "Limited Stock",
    bgGradient: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-500",
    link: "/?featured=true",
  },
  {
    id: "7",
    type: "trending",
    title: "Most Wanted",
    subtitle: "Trending products everyone loves",
    discount: "55% OFF",
    endDate: "While stocks last",
    bgGradient: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
    link: "/",
  },
  {
    id: "8",
    type: "limited",
    title: "Clearance Sale",
    subtitle: "Last chance to grab these deals",
    discount: "70% OFF",
    endDate: "Few items left",
    bgGradient: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-600",
    link: "/?discount=true",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "festival":
      return <Sparkles className="h-5 w-5" />;
    case "megasale":
      return <Percent className="h-5 w-5" />;
    case "season":
      return <Calendar className="h-5 w-5" />;
    case "flash":
      return <Zap className="h-5 w-5" />;
    case "weekend":
      return <Gift className="h-5 w-5" />;
    case "limited":
      return <Clock className="h-5 w-5" />;
    case "special":
      return <Crown className="h-5 w-5" />;
    case "trending":
      return <Flame className="h-5 w-5" />;
    default:
      return <ShoppingBag className="h-5 w-5" />;
  }
};

interface HorizontalBannerProps {
  banner: BannerData;
  isLarge?: boolean;
}

function HorizontalBanner({ banner, isLarge = false }: HorizontalBannerProps) {
  return (
    <Link to={banner.link || "/"}>
      <Card
        className={cn(
          "relative overflow-hidden border-0 shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-xl hover:scale-105",
          banner.bgGradient,
          isLarge
            ? "h-48 min-w-[400px] md:min-w-[450px]"
            : "h-40 min-w-[280px] md:min-w-[320px]",
          "text-white",
        )}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />

        {/* Decorative elements */}
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-white/10 rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 right-8 w-20 h-20 bg-white/5 rounded-full transform -translate-y-1/2" />

        <div
          className={cn(
            "relative h-full flex flex-col justify-between p-6",
            isLarge ? "p-8" : "p-6",
          )}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                {getIcon(banner.type)}
              </div>
              {banner.featured && (
                <Badge className="bg-yellow-400 text-yellow-900 text-xs font-bold">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            <h3
              className={cn(
                "font-bold mb-2 leading-tight",
                isLarge ? "text-2xl" : "text-xl",
              )}
            >
              {banner.title}
            </h3>

            <p
              className={cn(
                "text-white/90 leading-relaxed",
                isLarge ? "text-base" : "text-sm",
              )}
            >
              {banner.subtitle}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div>
              {banner.discount && (
                <div
                  className={cn(
                    "font-bold mb-1",
                    isLarge ? "text-2xl" : "text-lg",
                  )}
                >
                  {banner.discount}
                </div>
              )}
              {banner.endDate && (
                <div
                  className={cn(
                    "text-white/80 flex items-center gap-1",
                    isLarge ? "text-sm" : "text-xs",
                  )}
                >
                  <Clock className="h-3 w-3" />
                  {banner.endDate}
                </div>
              )}
            </div>

            <Button
              size={isLarge ? "default" : "sm"}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              variant="outline"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function HorizontalBanners() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Update current index based on scroll position
      const bannerWidth = window.innerWidth >= 768 ? 370 : 310;
      const newIndex = Math.round(scrollLeft / bannerWidth);
      setCurrentIndex(newIndex);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      setIsAutoScrolling(false);
      // Responsive scroll amount based on screen size
      const scrollAmount = window.innerWidth >= 768 ? 370 : 310; // Width of one banner + gap
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      // Resume auto-scroll after 10 seconds
      setTimeout(() => setIsAutoScrolling(true), 10000);
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      setIsAutoScrolling(false);
      const bannerWidth = window.innerWidth >= 768 ? 370 : 310;
      const scrollAmount = bannerWidth * index;
      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });

      // Resume auto-scroll after 10 seconds
      setTimeout(() => setIsAutoScrolling(true), 10000);
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;

        if (scrollLeft >= maxScroll - 10) {
          // Reset to beginning
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Scroll to next banner
          scroll("right");
        }
      }
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => setIsAutoScrolling(true);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🔥 Hot Deals & Offers
            </h2>
            <p className="text-gray-600">
              Don't miss out on these amazing limited-time offers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="hidden md:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="hidden md:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
            onScroll={checkScrollButtons}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitScrollbar: { display: "none" },
            }}
          >
            {bannerData.map((banner, index) => (
              <HorizontalBanner
                key={banner.id}
                banner={banner}
                isLarge={index === 0} // Make first banner larger
              />
            ))}
          </div>

          {/* Gradient overlays for scroll indication */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {bannerData.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentIndex === index
                  ? "bg-[#1890ff] w-6"
                  : "bg-gray-300 hover:bg-gray-400",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
