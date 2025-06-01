import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Send,
  Paperclip,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTickets } from "@/contexts/TicketContext";
import { useUser } from "@/contexts/UserContext";
import {
  ticketCategories,
  priorityLevels,
  TicketCategory,
  TicketPriority,
} from "@/types/ticket";
import { offers } from "@/data/offers";
import { toast } from "sonner";

export default function CreateTicket() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addTicket } = useTickets();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as TicketCategory | "",
    priority: "medium" as TicketPriority,
    offerId: "none",
    tags: [] as string[],
  });

  const [customTag, setCustomTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form data from URL parameters
  useEffect(() => {
    const offerId = searchParams.get("offer");
    if (offerId) {
      const selectedOffer = offers.find((o) => o.id === offerId);
      if (selectedOffer) {
        setFormData((prev) => ({
          ...prev,
          offerId,
          title: `Issue with ${selectedOffer.title}`,
          category: "product-issue" as TicketCategory,
        }));
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedOffer =
        formData.offerId && formData.offerId !== "none"
          ? offers.find((o) => o.id === formData.offerId)
          : null;

      const ticketId = addTicket({
        title: formData.title,
        description: formData.description,
        category: formData.category as TicketCategory,
        priority: formData.priority,
        status: "open",
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        offerId: selectedOffer?.id || undefined,
        offerTitle: selectedOffer?.title || undefined,
        sellerId: selectedOffer
          ? selectedOffer.vendor.name.toLowerCase().replace(/\s+/g, "-")
          : undefined,
        sellerName: selectedOffer?.vendor.name || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      });

      toast.success("Ticket created successfully!");
      navigate(`/tickets/${ticketId}`);
    } catch (error) {
      toast.error("Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (
      customTag.trim() &&
      !formData.tags.includes(customTag.trim().toLowerCase())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, customTag.trim().toLowerCase()],
      }));
      setCustomTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const selectedCategory = ticketCategories.find(
    (cat) => cat.id === formData.category,
  );
  const selectedPriority = priorityLevels.find(
    (p) => p.id === formData.priority,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/tickets")}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tickets
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Support Ticket
          </h1>
          <p className="text-gray-600">
            Describe your issue and we'll help you resolve it as quickly as
            possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: TicketCategory) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCategory && (
                      <p className="text-sm text-gray-600">
                        {selectedCategory.description}
                      </p>
                    )}
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: TicketPriority) =>
                        setFormData((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityLevels.map((priority) => (
                          <SelectItem key={priority.id} value={priority.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{priority.name}</span>
                              <Badge className={`ml-2 ${priority.color}`}>
                                {priority.name}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedPriority && (
                      <p className="text-sm text-gray-600">
                        {selectedPriority.description}
                      </p>
                    )}
                  </div>

                  {/* Related Offer */}
                  <div className="space-y-2">
                    <Label htmlFor="offer">Related Offer (Optional)</Label>
                    <Select
                      value={formData.offerId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, offerId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select related offer if applicable" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No related offer</SelectItem>
                        {offers.map((offer) => (
                          <SelectItem key={offer.id} value={offer.id}>
                            <div className="flex items-center gap-2">
                              <span className="truncate">{offer.title}</span>
                              <Badge variant="secondary" className="ml-auto">
                                ${offer.price}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Please provide as much detail as possible about your issue..."
                      rows={6}
                      required
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        placeholder="Add relevant tags..."
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Attachments */}
                  <div className="space-y-2">
                    <Label htmlFor="attachments">
                      Attachments (Coming Soon)
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
                      <Paperclip className="h-8 w-8 mx-auto mb-2" />
                      <p>File attachment feature will be available soon</p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Create Ticket
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/tickets")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Tips for Better Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <span>Be specific about the issue you're experiencing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <span>Include relevant offer or seller information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <span>Choose the correct category and priority</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <span>Add relevant tags to help categorize your issue</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Urgent Issues */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Urgent Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-700 mb-3">
                  For critical issues that need immediate attention:
                </p>
                <ul className="space-y-2 text-sm text-orange-700">
                  <li>• Payment or security issues</li>
                  <li>• Account compromise</li>
                  <li>• Fraudulent activity</li>
                </ul>
                <p className="text-xs text-orange-600 mt-3">
                  Set priority to "Critical" for fastest response
                </p>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card>
              <CardHeader>
                <CardTitle>Expected Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Critical:</span>
                    <Badge className="bg-red-100 text-red-800">1-2 hours</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>High:</span>
                    <Badge className="bg-orange-100 text-orange-800">
                      4-8 hours
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium:</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      24 hours
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Low:</span>
                    <Badge className="bg-gray-100 text-gray-800">
                      48 hours
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
