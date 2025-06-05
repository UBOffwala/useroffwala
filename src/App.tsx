import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { TicketProvider } from "@/contexts/TicketContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { ShopProvider } from "@/contexts/ShopContext";
import Index from "./pages/Index";
import OfferDetails from "./pages/OfferDetails";
import ShopPage from "./pages/ShopPage";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Categories from "./pages/Categories";
import LocationPage from "./pages/LocationPage";
import Tickets from "./pages/Tickets";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <WishlistProvider>
        <TicketProvider>
          <LocationProvider>
            <ShopProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/offer/:id" element={<OfferDetails />} />
                    <Route path="/shop/:id" element={<ShopPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/location" element={<LocationPage />} />
                    <Route path="/tickets" element={<Tickets />} />
                    <Route path="/tickets/new" element={<CreateTicket />} />
                    <Route path="/tickets/:id" element={<TicketDetails />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </ShopProvider>
          </LocationProvider>
        </TicketProvider>
      </WishlistProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
