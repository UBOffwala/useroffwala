import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ArrowLeft,
  Mail,
  Send,
  ShoppingBag,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call for sending OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to OTP verification instead of showing email sent state
      navigate("/auth/otp-verification", {
        state: {
          email,
          type: "password-reset",
          from: "/auth/forgot-password",
        },
      });
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
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
                  onClick={() => navigate("/auth/login")}
                  className="p-0 h-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">Back to sign in</span>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-[#1890ff] to-[#722ed1] rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-7 w-7 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                  Forgot password?
                </CardTitle>
                <CardDescription>
                  Enter your email and we'll send you an OTP to reset your
                  password
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      className={cn(
                        "pl-10",
                        error &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500",
                      )}
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    We'll send a 6-digit OTP to this email for verification
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#1890ff] to-[#722ed1] hover:from-[#1890ff]/90 hover:to-[#722ed1]/90"
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send OTP
                    </>
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
