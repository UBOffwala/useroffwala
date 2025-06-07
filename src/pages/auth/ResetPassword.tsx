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
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Eye,
  EyeOff,
  Lock,
  ShoppingBag,
  AlertCircle,
  Loader2,
  CheckCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email and token from location state
  const email = location.state?.email || "";
  const token = location.state?.token || "";

  // If no token, redirect to forgot password
  if (!token && !isSuccess) {
    navigate("/auth/forgot-password");
    return null;
  }

  const passwordStrength = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const passwordStrengthScore =
    Object.values(passwordStrength).filter(Boolean).length;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrengthScore < 3) {
      newErrors.password =
        "Password is too weak. Please include uppercase, lowercase, numbers, and special characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

      setIsSuccess(true);
    } catch (error) {
      setErrors({ submit: "Failed to reset password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrengthScore <= 2) return "text-red-500";
    if (passwordStrengthScore <= 3) return "text-yellow-500";
    return "text-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrengthScore <= 2) return "Weak";
    if (passwordStrengthScore <= 3) return "Medium";
    return "Strong";
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-7 w-7 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                  Password reset successful
                </CardTitle>
                <CardDescription>
                  Your password has been successfully reset
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-green-900">
                        Password updated successfully
                      </p>
                      <p className="text-sm text-green-700">
                        You can now sign in with your new password. Keep it safe
                        and secure!
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/auth/login")}
                  className="w-full bg-gradient-to-r from-[#1890ff] to-[#722ed1] hover:from-[#1890ff]/90 hover:to-[#722ed1]/90"
                >
                  Continue to sign in
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Need help?{" "}
                    <Link
                      to="/tickets/new"
                      className="text-[#1890ff] hover:text-[#1890ff]/80 font-medium"
                    >
                      Contact support
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-gradient-to-r from-[#1890ff] to-[#722ed1] rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-7 w-7 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">
                Reset your password
              </CardTitle>
              <CardDescription>
                Create a new secure password for your account
              </CardDescription>
              {email && (
                <p className="text-sm text-gray-600">
                  for <span className="font-medium">{email}</span>
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={cn(
                        "pl-10 pr-10",
                        errors.password &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500",
                      )}
                      disabled={isLoading}
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          Password strength:
                        </span>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            getPasswordStrengthColor(),
                          )}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div
                          className={cn(
                            "flex items-center gap-1",
                            passwordStrength.length
                              ? "text-green-600"
                              : "text-gray-400",
                          )}
                        >
                          <Check className="h-3 w-3" />
                          8+ characters
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-1",
                            passwordStrength.uppercase
                              ? "text-green-600"
                              : "text-gray-400",
                          )}
                        >
                          <Check className="h-3 w-3" />
                          Uppercase
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-1",
                            passwordStrength.lowercase
                              ? "text-green-600"
                              : "text-gray-400",
                          )}
                        >
                          <Check className="h-3 w-3" />
                          Lowercase
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-1",
                            passwordStrength.number
                              ? "text-green-600"
                              : "text-gray-400",
                          )}
                        >
                          <Check className="h-3 w-3" />
                          Number
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-1",
                            passwordStrength.special
                              ? "text-green-600"
                              : "text-gray-400",
                          )}
                        >
                          <Check className="h-3 w-3" />
                          Special char
                        </div>
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className={cn(
                        "pl-10 pr-10",
                        errors.confirmPassword &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500",
                      )}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#1890ff] to-[#722ed1] hover:from-[#1890ff]/90 hover:to-[#722ed1]/90"
                  disabled={
                    isLoading || !formData.password || !formData.confirmPassword
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
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
