import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/contexts/WishlistContext";
import { useUser } from "@/contexts/UserContext";
import { useSearch } from "@/contexts/SearchContext";
import { LocationSelector } from "@/components/LocationSelector";
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
} from "lucide-react";
import { categories } from "@/data/offers";
import { SearchSuggestion } from "@/types/search";
import { cn } from "@/lib/utils";

export function Header() {
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { wishlistCount } = useWishlist();
  const { user, isLoggedIn } = useUser();
  const {
    query,
    suggestions,
    recentSearches,
    popularSearches,
    isLoading,
    updateQuery,
    performSearchAction,
    selectSuggestion,
    clearSearch,
  } = useSearch();

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

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchInput(suggestion.text);
    setShowSuggestions(false);
    setIsSearchFocused(false);

    // Navigate based on suggestion type
    if (suggestion.type === "category") {
      navigate(
        `/?search=${encodeURIComponent(suggestion.text)}&category=${suggestion.id.replace("category_", "")}`,
      );
    } else if (suggestion.type === "vendor") {
      navigate(`/?search=${encodeURIComponent(suggestion.text)}`);
    } else {
      navigate(`/?search=${encodeURIComponent(suggestion.text)}`);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchInput(value);
    updateQuery(value);
    setShowSuggestions(value.length > 0 || isSearchFocused);
  };

  const handleInputFocus = () => {
    setIsSearchFocused(true);
    setShowSuggestions(true);
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    setSearchInput(searchTerm);
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    setShowSuggestions(false);
    setIsSearchFocused(false);
  };

  const getSuggestionIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "offer":
        return <Package className="w-4 h-4 text-blue-500" />;
      case "category":
        return <Tag className="w-4 h-4 text-green-500" />;
      case "vendor":
        return <Store className="w-4 h-4 text-purple-500" />;
      case "brand":
        return <Award className="w-4 h-4 text-orange-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "offer":
        return "Product";
      case "category":
        return "Category";
      case "vendor":
        return "Vendor";
      case "brand":
        return "Brand";
      default:
        return "";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={() => clearSearch()}
          >
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
                  placeholder="Search for offers, brands, categories..."
                  value={searchInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={handleInputFocus}
                  className={cn(
                    "pl-10 pr-12 w-full focus:ring-2 focus:ring-[#1890ff] focus:border-[#1890ff] transition-all",
                    showSuggestions && "rounded-b-none border-b-0",
                  )}
                />
                {isLoading && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                )}
                {searchInput && !isLoading && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => {
                      setSearchInput("");
                      updateQuery("");
                      setShowSuggestions(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && (
                <Card className="absolute top-full left-0 right-0 z-50 border-t-0 rounded-t-none shadow-lg">
                  <CardContent className="p-0 max-h-96 overflow-y-auto">
                    {/* Current suggestions based on input */}
                    {suggestions.length > 0 && (
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-1">
                          Suggestions
                        </div>
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded transition-colors"
                          >
                            {getSuggestionIcon(suggestion.type)}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {suggestion.text}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-2">
                                <span>{getTypeLabel(suggestion.type)}</span>
                                {suggestion.count && (
                                  <span>• {suggestion.count} results</span>
                                )}
                                {suggestion.category && (
                                  <span>• in {suggestion.category}</span>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Recent searches when no input or no suggestions */}
                    {(searchInput.length === 0 || suggestions.length === 0) &&
                      recentSearches.length > 0 && (
                        <div className="p-2 border-t">
                          <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Recent searches
                          </div>
                          {recentSearches.slice(0, 5).map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleRecentSearchClick(search)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded transition-colors"
                            >
                              <Clock className="w-4 h-4 text-gray-400" />
                              <div className="flex-1 text-sm truncate">
                                {search}
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </button>
                          ))}
                        </div>
                      )}

                    {/* Popular searches */}
                    {searchInput.length === 0 && (
                      <div className="p-2 border-t">
                        <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Popular searches
                        </div>
                        {popularSearches.slice(0, 4).map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleRecentSearchClick(search)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded transition-colors"
                          >
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                            <div className="flex-1 text-sm truncate">
                              {search}
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Empty state */}
                    {searchInput.length > 0 && suggestions.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <div className="text-sm">No suggestions found</div>
                        <div className="text-xs">
                          Press Enter to search for "{searchInput}"
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
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
            <Link to={isLoggedIn ? "/profile" : "/profile"}>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-5 w-5" />
                <span className="hidden lg:inline">
                  {isLoggedIn ? user.firstName : "Sign In"}
                </span>
              </Button>
            </Link>

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
                      to="/tickets"
                      className="block px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
                    >
                      Support
                    </Link>
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
