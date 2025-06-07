import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/contexts/WishlistContext";
import { useUser } from "@/contexts/UserContext";
import { LocationSelector } from "@/components/LocationSelector";
import { SearchSuggestions } from "@/components/SearchSuggestions";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Search,
  Menu,
  Heart,
  ShoppingBag,
  User,
  MapPin,
  Clock,
  TrendingUp,
  Package,
  Store,
  Tag,
  Award,
  ArrowRight,
  X,
  Loader2,
  LogOut,
  Settings,
} from "lucide-react";
import { categories } from "@/data/offers";
import { cn } from "@/lib/utils";

export function Header() {
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { wishlistCount } = useWishlist();
  const { user, isLoggedIn, logout } = useUser();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/?search=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput("");
      setShowSuggestions(false);
      setIsSearchFocused(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchInput(value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setIsSearchFocused(true);
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (suggestion: any) => {
    navigate(suggestion.link);
    setSearchInput("");
    setShowSuggestions(false);
    setIsSearchFocused(false);
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
    setIsSearchFocused(false);
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
            <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-[#1890ff] to-[#722ed1] bg-clip-text text-transparent">
              OfferHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium hover:text-[#1890ff] transition-colors">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {categories.slice(0, 8).map((category) => (
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
                      <div className="mt-4 pt-4 border-t">
                        <Link
                          to="/categories"
                          className="text-sm text-[#1890ff] hover:text-[#1890ff]/80 font-medium flex items-center gap-1"
                        >
                          View all categories
                          <ArrowRight className="w-3 h-3" />
                        </Link>
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
                    to="/shops"
                    className="text-sm font-medium hover:text-[#1890ff] transition-colors"
                  >
                    Shops
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

          {/* Enhanced Search Bar */}
          <div
            className="flex-1 max-w-2xl mx-8 hidden md:block"
            ref={searchRef}
          >
            <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for offers, shops, categories..."
                  value={searchInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={handleInputFocus}
                  className={cn(
                    "pl-10 pr-12 w-full focus:ring-2 focus:ring-[#1890ff] focus:border-[#1890ff] transition-all",
                    showSuggestions &&
                      (searchInput.length > 0 || isSearchFocused) &&
                      "rounded-b-none",
                  )}
                />
                {searchInput && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => {
                      setSearchInput("");
                      setShowSuggestions(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </form>

              <SearchSuggestions
                query={searchInput}
                isVisible={
                  showSuggestions && (searchInput.length > 0 || isSearchFocused)
                }
                onSelectSuggestion={handleSuggestionSelect}
                onClose={handleCloseSuggestions}
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Location Selector */}
            <div className="hidden lg:block">
              <LocationSelector />
            </div>

            {/* Wishlist */}
            <Link to="/wishlist">
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600 text-xs">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </Badge>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>

            {/* User Profile */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden lg:inline">{user.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/tickets" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth/login">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-5 w-5" />
                  <span className="hidden lg:inline">Sign In</span>
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-10"
                    />
                  </form>

                  {/* Mobile Navigation Links */}
                  <div className="space-y-2">
                    <Link
                      to="/categories"
                      className="block px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
                    >
                      Categories
                    </Link>
                    <Link
                      to="/?featured=true"
                      className="block px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
                    >
                      Featured
                    </Link>
                    <Link
                      to="/?new=true"
                      className="block px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
                    >
                      New Arrivals
                    </Link>
                    <Link
                      to="/?discount=true"
                      className="block px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
                    >
                      Deals
                    </Link>
                    <Link
                      to="/shops"
                      className="block px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
                    >
                      Shops
                    </Link>
                    <Link
                      to="/tickets"
                      className="block px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
                    >
                      Support
                    </Link>
                  </div>

                  {/* Mobile Authentication */}
                  <div className="pt-4 border-t space-y-2">
                    {isLoggedIn ? (
                      <>
                        <div className="px-3 py-2 text-sm">
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {user.email}
                          </div>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          Wishlist
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            navigate("/");
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/auth/login"
                          className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Sign In
                        </Link>
                        <Link
                          to="/auth/register"
                          className="block px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#1890ff] to-[#722ed1] text-white rounded transition-colors"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Mobile Location */}
                  <div className="pt-4 border-t">
                    <LocationSelector />
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
