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
}

function CategoryCard({ category, className }: CategoryCardProps) {
  const lightColors = [
    { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-200" },
    {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      border: "border-purple-200",
    },
    { bg: "bg-green-50", icon: "text-green-600", border: "border-green-200" },
    {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      border: "border-orange-200",
    },
    { bg: "bg-pink-50", icon: "text-pink-600", border: "border-pink-200" },
    {
      bg: "bg-indigo-50",
      icon: "text-indigo-600",
      border: "border-indigo-200",
    },
    { bg: "bg-teal-50", icon: "text-teal-600", border: "border-teal-200" },
    { bg: "bg-red-50", icon: "text-red-600", border: "border-red-200" },
  ];

  const colorScheme = lightColors[category.id.length % lightColors.length];

  return (
    <Link to={`/categories?selected=${category.id}`}>
      <Card
        className={cn(
          "group hover:shadow-xl hover:shadow-[#1890ff]/10 transition-all duration-300 cursor-pointer overflow-hidden",
          "hover:border-[#1890ff]/30 hover:-translate-y-1 h-32",
          className,
        )}
      >
        <CardContent
          className={cn(
            "p-6 h-full relative",
            colorScheme.bg,
            "border-2 border-gray-100 group-hover:border-[#1890ff]/30",
          )}
        >
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#1890ff] transition-colors duration-300 text-sm">
              {category.name}
            </h3>
            <p className="text-gray-600 mt-1 font-medium text-xs">
              {category.count} offers
            </p>

            {/* Decorative element */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full transition-all duration-300 bg-gray-200 group-hover:bg-[#1890ff] group-hover:w-12" />
          </div>

          {/* Trending badge for popular categories */}
          {category.count > 150 && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-[#1890ff] to-[#722ed1] text-white text-xs shadow-lg">
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
