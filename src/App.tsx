import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { TicketProvider } from "@/contexts/TicketContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { ReviewProvider } from "@/contexts/ReviewContext";
import { ShopProvider } from "@/contexts/ShopContext";
import { ShopReviewProvider } from "@/contexts/ShopReviewContext";
import Index from "./pages/Index";
import OfferDetails from "./pages/OfferDetails";
import ShopPage from "./pages/ShopPage";
import Shops from "./pages/Shops";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Categories from "./pages/Categories";
import LocationPage from "./pages/LocationPage";
import Tickets from "./pages/Tickets";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Lazy load auth components to isolate potential issues
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const OTPVerification = React.lazy(
  () => import("./pages/auth/OTPVerification"),
);
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));

const App = () => {
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <WishlistProvider>
          <TicketProvider>
            <LocationProvider>
              <ReviewProvider>
                <ShopProvider>
                  <ShopReviewProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
                      <BrowserRouter>
                        <React.Suspense fallback={<div>Loading...</div>}>
                          <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<Index />} />
                            <Route
                              path="/categories"
                              element={<Categories />}
                            />
                            <Route path="/shops" element={<Shops />} />
                            <Route
                              path="/location"
                              element={<LocationPage />}
                            />

                            {/* Auth routes - only accessible when not logged in */}
                            <Route
                              path="/auth/login"
                              element={
                                <ProtectedRoute requireAuth={false}>
                                  <Login />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/auth/register"
                              element={
                                <ProtectedRoute requireAuth={false}>
                                  <Register />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/auth/forgot-password"
                              element={
                                <ProtectedRoute requireAuth={false}>
                                  <ForgotPassword />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/auth/otp-verification"
                              element={<OTPVerification />}
                            />
                            <Route
                              path="/auth/reset-password"
                              element={<ResetPassword />}
                            />

                            {/* Protected routes - require authentication */}
                            <Route
                              path="/offer/:id"
                              element={
                                <ProtectedRoute>
                                  <OfferDetails />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/shop/:id"
                              element={
                                <ProtectedRoute>
                                  <ShopPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/profile"
                              element={
                                <ProtectedRoute>
                                  <Profile />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/wishlist"
                              element={
                                <ProtectedRoute>
                                  <Wishlist />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/tickets"
                              element={
                                <ProtectedRoute>
                                  <Tickets />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/tickets/new"
                              element={
                                <ProtectedRoute>
                                  <CreateTicket />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/tickets/:id"
                              element={
                                <ProtectedRoute>
                                  <TicketDetails />
                                </ProtectedRoute>
                              }
                            />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </React.Suspense>
                      </BrowserRouter>
                    </TooltipProvider>
                  </ShopReviewProvider>
                </ShopProvider>
              </ReviewProvider>
            </LocationProvider>
          </TicketProvider>
        </WishlistProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
