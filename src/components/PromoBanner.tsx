import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Gift,
  Zap,
  Sparkles,
  Calendar,
  ShoppingBag,
  Percent,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PromoBannerProps {
  type: "festival" | "megasale" | "season" | "flash" | "weekend" | "limited";
  title: string;
  subtitle: string;
  discount?: string;
  endDate?: string;
  bgGradient: string;
  textColor?: string;
  link?: string;
  isDismissible?: boolean;
  className?: string;
}

export function PromoBanner({
  type,
  title,
  subtitle,
  discount,
  endDate,
  bgGradient,
  textColor = "text-white",
  link = "/?discount=true",
  isDismissible = false,
  className,
}: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "festival":
        return <Sparkles className="h-6 w-6" />;
      case "megasale":
        return <Percent className="h-6 w-6" />;
      case "season":
        return <Calendar className="h-6 w-6" />;
      case "flash":
        return <Zap className="h-6 w-6" />;
      case "weekend":
        return <Gift className="h-6 w-6" />;
      case "limited":
        return <ShoppingBag className="h-6 w-6" />;
      default:
        return <Gift className="h-6 w-6" />;
    }
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 shadow-lg",
        bgGradient,
        textColor,
        className,
      )}
    >
      {isDismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-white hover:bg-white/20"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
            {getIcon()}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold">{title}</h3>
              {discount && (
                <Badge className="bg-yellow-400 text-yellow-900 font-bold">
                  {discount}
                </Badge>
              )}
            </div>
            <p className="text-white/90 text-sm">{subtitle}</p>
            {endDate && (
              <p className="text-white/80 text-xs mt-1">Ends: {endDate}</p>
            )}
          </div>
        </div>

        <Link to={link}>
          <Button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold">
            Shop Now
          </Button>
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full" />
      <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-white/10 rounded-full" />
    </Card>
  );
}

interface PromoBannerSectionProps {
  className?: string;
}

export function PromoBannerSection({ className }: PromoBannerSectionProps) {
  const banners = [
    {
      type: "megasale" as const,
      title: "MEGA SALE",
      subtitle: "Up to 70% off on electronics and fashion",
      discount: "UP TO 70% OFF",
      endDate: "Jan 31, 2024",
      bgGradient: "bg-gradient-to-r from-red-500 via-pink-500 to-purple-600",
      link: "/?discount=true",
    },
    {
      type: "festival" as const,
      title: "Festival Special",
      subtitle: "Celebrate with amazing deals on home & garden",
      discount: "50% OFF",
      endDate: "Feb 14, 2024",
      bgGradient: "bg-gradient-to-r from-orange-400 via-red-500 to-pink-500",
      link: "/?category=home",
    },
  ];

  return (
    <section className={cn("py-8", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner, index) => (
          <PromoBanner key={index} {...banner} />
        ))}
      </div>
    </section>
  );
}
