import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Card className="p-8">
            <CardContent className="space-y-6">
              <div className="text-6xl font-bold text-gray-400">404</div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Page Not Found
                </h1>
                <p className="text-gray-600">
                  Sorry, we couldn't find the offer or page you're looking for.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link to="/" className="w-full">
                  <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Home className="h-4 w-4" />
                    Go Home
                  </Button>
                </Link>

                <Link to="/?search=" className="w-full">
                  <Button variant="outline" className="w-full gap-2">
                    <Search className="h-4 w-4" />
                    Search Offers
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  onClick={() => window.history.back()}
                  className="w-full gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
