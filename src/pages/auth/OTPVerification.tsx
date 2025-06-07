import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  AlertCircle,
  Loader2,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { updateUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email and type from location state
  const email = location.state?.email || "";
  const verificationType = location.state?.type || "registration"; // "registration" or "password-reset"

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error when user starts typing
    if (error) setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6);
        const newOtp = Array(6)
          .fill("")
          .map((_, i) => digits[i] || "");
        setOtp(newOtp);

        // Focus last filled input or first empty one
        const nextFocusIndex = Math.min(digits.length, 5);
        inputRefs.current[nextFocusIndex]?.focus();
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, accept any 6-digit code
      if (verificationType === "registration") {
        // Update user as verified
        updateUser({ isVerified: true });
        navigate("/", { replace: true });
      } else if (verificationType === "password-reset") {
        // Navigate to reset password page
        navigate("/auth/reset-password", {
          state: { email, token: otpCode },
        });
      }
    } catch (error) {
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset countdown
      setCountdown(30);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);

      // Focus first input
      inputRefs.current[0]?.focus();
    } catch (error) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

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
                  onClick={() => {
                    if (verificationType === "registration") {
                      navigate("/auth/register/step-2");
                    } else if (verificationType === "password-reset") {
                      navigate("/auth/forgot-password");
                    } else {
                      navigate(-1);
                    }
                  }}
                  className="p-0 h-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  {verificationType === "registration"
                    ? "Back to registration"
                    : "Back to forgot password"}
                </span>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-[#1890ff] to-[#722ed1] rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-7 w-7 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                  {verificationType === "registration"
                    ? "Verify your email"
                    : "Enter verification code"}
                </CardTitle>
                <CardDescription>
                  {verificationType === "registration"
                    ? "We've sent a 6-digit verification code to"
                    : "We've sent a 6-digit OTP to"}
                </CardDescription>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {email}
                </p>
                {verificationType === "password-reset" && (
                  <p className="text-xs text-gray-600 mt-2">
                    Once verified, you'll be able to reset your password
                  </p>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-center space-x-2">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-[#1890ff] focus:ring-[#1890ff]"
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Enter the 6-digit code from your email
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#1890ff] to-[#722ed1] hover:from-[#1890ff]/90 hover:to-[#722ed1]/90"
                  disabled={!isComplete || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify code"
                  )}
                </Button>
              </form>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?
                </p>

                {canResend ? (
                  <Button
                    variant="outline"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="w-full"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Resend code
                      </>
                    )}
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500">
                    Resend available in {countdown}s
                  </p>
                )}

                <p className="text-sm text-gray-600">
                  Wrong email address?{" "}
                  <Link
                    to={
                      verificationType === "registration"
                        ? "/auth/register/step-2"
                        : "/auth/forgot-password"
                    }
                    className="text-[#1890ff] hover:text-[#1890ff]/80 font-medium"
                  >
                    {verificationType === "registration"
                      ? "Go back to registration"
                      : "Change email"}
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
