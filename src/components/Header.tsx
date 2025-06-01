import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/contexts/WishlistContext";
import { useUser } from "@/contexts/UserContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, Menu, Heart, ShoppingBag, User } from "lucide-react";
import { categories } from "@/data/offers";
import { cn } from "@/lib/utils";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { wishlistCount } = useWishlist();
  const { user, isLoggedIn } = useUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-[#1890ff] to-[#722ed1] rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-[#1890ff] to-[#722ed1] bg-clip-text text-transparent">
              OfferHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link
                    to="/categories"
                    className="text-sm font-medium hover:text-[#1890ff] transition-colors"
                  >
                    Categories
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Browse</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-96 p-6">
                      <div className="grid grid-cols-2 gap-4">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            to={`/?category=${category.id}`}
                            className="group block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{category.icon}</span>
                              <div>
                                <div className="font-medium group-hover:text-[#1890ff] transition-colors">
                                  {category.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {category.count} offers
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to="/?featured=true"
                    className="text-sm font-medium hover:text-[#1890ff] transition-colors"
                  >
                    Featured
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to="/?new=true"
                    className="text-sm font-medium hover:text-[#1890ff] transition-colors"
                  >
                    New Arrivals
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to="/?discount=true"
                    className="text-sm font-medium hover:text-[#1890ff] transition-colors"
                  >
                    Deals
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to="/tickets"
                    className="text-sm font-medium hover:text-[#1890ff] transition-colors"
                  >
                    Support
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for offers, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden md:flex"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                  <SheetDescription className="text-left">
                    Browse categories and offers
                  </SheetDescription>
                </SheetHeader>

                {/* Mobile Search */}
                <div className="my-6">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search offers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </form>
                </div>

                {/* Mobile Categories */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/?category=${category.id}`}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-xl">{category.icon}</span>
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-sm text-gray-500">
                              {category.count} offers
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <Link
                        to="/?featured=true"
                        className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Featured Offers
                      </Link>
                      <Link
                        to="/?new=true"
                        className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        New Arrivals
                      </Link>
                      <Link
                        to="/?discount=true"
                        className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Best Deals
                      </Link>
                      <Link
                        to="/tickets"
                        className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Support & Tickets
                      </Link>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <Link
                        to="/wishlist"
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Heart className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Wishlist</div>
                          <div className="text-sm text-gray-500">
                            {wishlistCount} saved items
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <User className="h-5 w-5" />
                        <div>
                          <div className="font-medium">My Profile</div>
                          <div className="text-sm text-gray-500">
                            {isLoggedIn
                              ? `${user.firstName} ${user.lastName}`
                              : "Account settings"}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
