import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/contexts/UserContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Home,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterStep2() {
  const [formData, setFormData] = useState({
    street: "",
    apartment: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Get basic details from previous step
  const basicDetails = location.state?.basicDetails;

  // If no basic details, redirect back to step 1
  if (!basicDetails) {
    navigate("/auth/register");
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!formData.area.trim()) {
      newErrors.area = "Area/Locality is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create complete user data
      const userData = {
        id: "user-" + Date.now(),
        firstName: basicDetails.firstName,
        lastName: basicDetails.lastName,
        email: basicDetails.email,
        phone: basicDetails.phone,
        bio: "",
        address: {
          street: formData.street.trim(),
          apartment: formData.apartment.trim(),
          area: formData.area.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.pincode.trim(),
          country: formData.country,
        },
        preferences: {
          newsletter: basicDetails.subscribeNewsletter,
          notifications: true,
          marketing: basicDetails.subscribeNewsletter,
          language: "en",
          currency: "INR",
        },
        joinedDate: new Date().toISOString(),
        isVerified: false, // Will be verified after OTP
      };

      login(userData);
      // Redirect to OTP verification
      navigate("/auth/otp-verification", {
        state: { email: basicDetails.email, type: "registration" },
      });
    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <div className="flex items-center space-x-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/auth/register")}
                  className="p-0 h-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Back to basic details
                </span>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-[#1890ff] to-[#722ed1] rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-7 w-7 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                  Almost there!
                </CardTitle>
                <CardDescription>
                  Step 2 of 2: Enter your address details
                </CardDescription>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <span className="ml-2 text-sm text-green-600">
                      Basic Details
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-[#1890ff] mx-4"></div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#1890ff] text-white rounded-full flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <span className="ml-2 text-sm font-medium text-[#1890ff]">
                      Address
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              {/* Show user info from step 1 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {basicDetails.firstName.charAt(0)}
                      {basicDetails.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {basicDetails.firstName} {basicDetails.lastName}
                    </p>
                    <p className="text-xs text-blue-700">
                      {basicDetails.email}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="street"
                      type="text"
                      placeholder="123 Main Street"
                      value={formData.street}
                      onChange={(e) =>
                        handleInputChange("street", e.target.value)
                      }
                      className={cn(
                        "pl-10",
                        errors.street &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500",
                      )}
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                  {errors.street && (
                    <p className="text-sm text-red-600">{errors.street}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apartment">Apartment/Floor (Optional)</Label>
                  <Input
                    id="apartment"
                    type="text"
                    placeholder="Apt 4B, Floor 2"
                    value={formData.apartment}
                    onChange={(e) =>
                      handleInputChange("apartment", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Area/Locality *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="area"
                      type="text"
                      placeholder="Koramangala, Sector 5"
                      value={formData.area}
                      onChange={(e) =>
                        handleInputChange("area", e.target.value)
                      }
                      className={cn(
                        "pl-10",
                        errors.area &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500",
                      )}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.area && (
                    <p className="text-sm text-red-600">{errors.area}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Bangalore"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className={cn(
                        errors.city &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500",
                      )}
                      disabled={isLoading}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      type="text"
                      placeholder="Karnataka"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      className={cn(
                        errors.state &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500",
                      )}
                      disabled={isLoading}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      type="text"
                      placeholder="560095"
                      value={formData.pincode}
                      onChange={(e) =>
                        handleInputChange(
                          "pincode",
                          e.target.value.replace(/\D/g, ""),
                        )
                      }
                      className={cn(
                        errors.pincode &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500",
                      )}
                      disabled={isLoading}
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="text-sm text-red-600">{errors.pincode}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      disabled={isLoading}
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#1890ff] to-[#722ed1] hover:from-[#1890ff]/90 hover:to-[#722ed1]/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </div>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/auth/login"
                    className="text-[#1890ff] hover:text-[#1890ff]/80 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
