import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "@/data/offers";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    count: number;
  };
  className?: string;
  isLarge?: boolean;
}

function CategoryCard({
  category,
  className,
  isLarge = false,
}: CategoryCardProps) {
  const gradients = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-purple-400 to-purple-600",
    "bg-gradient-to-br from-green-400 to-green-600",
    "bg-gradient-to-br from-orange-400 to-orange-600",
    "bg-gradient-to-br from-pink-400 to-pink-600",
    "bg-gradient-to-br from-indigo-400 to-indigo-600",
    "bg-gradient-to-br from-teal-400 to-teal-600",
    "bg-gradient-to-br from-red-400 to-red-600",
  ];

  const gradient = gradients[category.id.length % gradients.length];

  return (
    <Link to={`/categories?selected=${category.id}`}>
      <Card
        className={cn(
          "group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-0",
          isLarge ? "h-32" : "h-24",
          className,
        )}
      >
        <CardContent className={cn("p-0 h-full relative", gradient)}>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

          <div className="relative h-full flex items-center justify-center text-white">
            <div className="text-center">
              <div
                className={cn(
                  "text-center mb-2 group-hover:scale-110 transition-transform",
                  isLarge ? "text-3xl" : "text-2xl",
                )}
              >
                {category.icon}
              </div>
              <h3
                className={cn(
                  "font-semibold group-hover:scale-105 transition-transform",
                  isLarge ? "text-lg" : "text-sm",
                )}
              >
                {category.name}
              </h3>
              <p
                className={cn(
                  "text-white/80 mt-1",
                  isLarge ? "text-sm" : "text-xs",
                )}
              >
                {category.count} offers
              </p>
            </div>
          </div>

          {/* Trending badge for popular categories */}
          {category.count > 150 && (
            <Badge className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Hot
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

interface CategoryGridProps {
  title?: string;
  showAll?: boolean;
  className?: string;
}

export function CategoryGrid({
  title = "Browse by Category",
  showAll = false,
  className,
}: CategoryGridProps) {
  const displayCategories = showAll ? categories : categories.slice(0, 6);

  return (
    <section className={cn("py-12 bg-white", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">
              Find exactly what you're looking for
            </p>
          </div>

          {!showAll && (
            <Link to="/categories">
              <Button
                variant="outline"
                className="gap-2 hover:border-[#1890ff] hover:text-[#1890ff] hover:bg-[#1890ff]/5"
              >
                View All Categories
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {displayCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {!showAll && (
          <div className="text-center mt-10">
            <Link to="/categories">
              <Button className="bg-gradient-to-r from-[#1890ff] to-[#722ed1] hover:from-[#1890ff]/90 hover:to-[#722ed1]/90 px-8 py-3 text-lg">
                Browse All Categories
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
