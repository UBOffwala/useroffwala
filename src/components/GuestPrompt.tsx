import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingBag, Heart, User, Star, Gift, Zap } from "lucide-react";

interface GuestPromptProps {
  title?: string;
  description?: string;
  features?: string[];
  className?: string;
}

export function GuestPrompt({
  title = "Join OfferHub to unlock amazing deals!",
  description = "Sign up to access exclusive offers, save your favorites, and discover personalized recommendations.",
  features = [
    "Exclusive member-only deals",
    "Personalized offer recommendations",
    "Save offers to your wishlist",
    "Track your savings and purchases",
    "Get notified about new deals",
    "Access to premium features",
  ],
  className = "",
}: GuestPromptProps) {
  return (
    <Card className={`max-w-2xl mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-gradient-to-r from-[#1890ff] to-[#722ed1] rounded-full flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription className="text-lg">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => {
            const icons = [Star, Gift, Heart, Zap, User, ShoppingBag];
            const Icon = icons[index % icons.length];

            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-4 w-4 text-[#1890ff]" />
                </div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link to="/auth/register" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-[#1890ff] to-[#722ed1] hover:from-[#1890ff]/90 hover:to-[#722ed1]/90">
              Create Free Account
            </Button>
          </Link>
          <Link to="/auth/login" className="flex-1">
            <Button variant="outline" className="w-full">
              Sign In
            </Button>
          </Link>
        </div>

        <p className="text-xs text-gray-500 text-center">
          By signing up, you agree to our{" "}
          <Link to="/terms" className="text-[#1890ff] hover:text-[#1890ff]/80">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="text-[#1890ff] hover:text-[#1890ff]/80"
          >
            Privacy Policy
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
