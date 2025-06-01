import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Send,
  User,
  Clock,
  CheckCircle,
  Settings,
  MessageSquare,
  Star,
  AlertTriangle,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTickets } from "@/contexts/TicketContext";
import { useUser } from "@/contexts/UserContext";
import { formatTicketDate, getRelativeTime } from "@/lib/tickets";
import {
  ticketCategories,
  priorityLevels,
  statusOptions,
  TicketStatus,
} from "@/types/ticket";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const {
    getTicketById,
    addMessage,
    updateTicketStatus,
    assignAdmin,
    isAdmin,
  } = useTickets();
  const { user } = useUser();

  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStatus, setNewStatus] = useState<TicketStatus | "">("");
  const [satisfactionRating, setSatisfactionRating] = useState(0);

  if (!id) {
    return <Navigate to="/tickets" replace />;
  }

  const ticket = getTicketById(id);

  if (!ticket) {
    return <Navigate to="/tickets" replace />;
  }

  // Check if user has access to this ticket
  if (!isAdmin && ticket.userId !== user.id) {
    return <Navigate to="/tickets" replace />;
  }

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmitting(true);

    try {
      addMessage(ticket.id, {
        userId: user.id,
        userType: isAdmin ? "admin" : "user",
        userName: `${user.firstName} ${user.lastName}`,
        userAvatar: user.avatar,
        message: newMessage,
      });

      // Auto-assign admin if this is the first admin response
      if (isAdmin && !ticket.assignedAdminId) {
        assignAdmin(ticket.id, user.id, `${user.firstName} ${user.lastName}`);
      }

      // Auto-update status to in-progress if admin responds to open ticket
      if (isAdmin && ticket.status === "open") {
        updateTicketStatus(ticket.id, "in-progress");
      }

      setNewMessage("");
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (status: TicketStatus) => {
    updateTicketStatus(ticket.id, status);
    toast.success(`Ticket status updated to ${status.replace("-", " ")}`);
  };

  const handleAssignToMe = () => {
    assignAdmin(ticket.id, user.id, `${user.firstName} ${user.lastName}`);
    toast.success("Ticket assigned to you");
  };

  const category = ticketCategories.find((cat) => cat.id === ticket.category);
  const priority = priorityLevels.find((p) => p.id === ticket.priority);
  const status = statusOptions.find((s) => s.id === ticket.status);

  const canUserRespond =
    ticket.status !== "closed" && (ticket.userId === user.id || isAdmin);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {ticket.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={priority?.color}>
                  {priority?.name} Priority
                </Badge>
                <Badge className={status?.color}>{status?.name}</Badge>
                {ticket.isUrgent && (
                  <Badge className="bg-red-100 text-red-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Urgent
                  </Badge>
                )}
                <span className="text-sm text-gray-500">
                  Ticket #{ticket.id.split("-")[1]}
                </span>
              </div>
            </div>

            {isAdmin && (
              <div className="flex flex-col sm:flex-row gap-2">
                {!ticket.assignedAdminId && (
                  <Button
                    onClick={handleAssignToMe}
                    variant="outline"
                    size="sm"
                  >
                    Assign to Me
                  </Button>
                )}

                <Select
                  value={newStatus}
                  onValueChange={(value: TicketStatus) => {
                    setNewStatus(value);
                    handleStatusChange(value);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((statusOption) => (
                      <SelectItem key={statusOption.id} value={statusOption.id}>
                        {statusOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Original Ticket */}
            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={ticket.userAvatar} />
                    <AvatarFallback>
                      {ticket.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{ticket.userName}</span>
                      <Badge variant="secondary">User</Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTicketDate(ticket.createdAt)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap">{ticket.description}</p>
                </div>

                {ticket.tags && ticket.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {ticket.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Messages */}
            {ticket.messages.length > 0 && (
              <div className="space-y-4">
                {ticket.messages.map((message) => (
                  <Card
                    key={message.id}
                    className={cn(
                      message.userType === "admin"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white",
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.userAvatar} />
                          <AvatarFallback
                            className={cn(
                              message.userType === "admin"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-600 text-white",
                            )}
                          >
                            {message.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {message.userName}
                            </span>
                            <Badge
                              variant={
                                message.userType === "admin"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {message.userType === "admin"
                                ? "Support"
                                : "User"}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {getRelativeTime(message.createdAt)}
                            </span>
                          </div>
                          <div className="prose prose-sm prose-gray max-w-none">
                            <p className="whitespace-pre-wrap">
                              {message.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Response Form */}
            {canUserRespond && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {isAdmin ? "Admin Response" : "Add Response"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitMessage} className="space-y-4">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={
                        isAdmin
                          ? "Type your response to help the customer..."
                          : "Add additional information or follow up..."
                      }
                      rows={4}
                      required
                    />

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {isAdmin
                          ? "Your response will be visible to the user"
                          : "Additional information will help us resolve your issue faster"}
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting || !newMessage.trim()}
                        className="gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send {isAdmin ? "Response" : "Message"}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Customer Satisfaction */}
            {ticket.status === "resolved" &&
              ticket.userId === user.id &&
              !ticket.customerSatisfaction && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Star className="h-5 w-5" />
                      Rate Your Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 mb-4">
                      How satisfied are you with the resolution of your ticket?
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant={
                            satisfactionRating === rating
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setSatisfactionRating(rating)}
                        >
                          <Star
                            className={cn(
                              "h-4 w-4",
                              satisfactionRating >= rating && "fill-current",
                            )}
                          />
                        </Button>
                      ))}
                    </div>
                    {satisfactionRating > 0 && (
                      <Button className="mt-3" size="sm">
                        Submit Rating
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Ticket Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-medium text-sm text-gray-600">
                    Category
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span>{category?.icon}</span>
                    <span>{category?.name}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <span className="font-medium text-sm text-gray-600">
                    Priority
                  </span>
                  <div className="mt-1">
                    <Badge className={priority?.color}>{priority?.name}</Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <span className="font-medium text-sm text-gray-600">
                    Status
                  </span>
                  <div className="mt-1">
                    <Badge className={status?.color}>{status?.name}</Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <span className="font-medium text-sm text-gray-600">
                    Created
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{formatTicketDate(ticket.createdAt)}</span>
                  </div>
                </div>

                {ticket.updatedAt !== ticket.createdAt && (
                  <>
                    <Separator />
                    <div>
                      <span className="font-medium text-sm text-gray-600">
                        Last Updated
                      </span>
                      <div className="flex items-center gap-1 mt-1 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{getRelativeTime(ticket.updatedAt)}</span>
                      </div>
                    </div>
                  </>
                )}

                {ticket.assignedAdminName && (
                  <>
                    <Separator />
                    <div>
                      <span className="font-medium text-sm text-gray-600">
                        Assigned To
                      </span>
                      <div className="flex items-center gap-1 mt-1 text-sm">
                        <User className="h-4 w-4" />
                        <span>{ticket.assignedAdminName}</span>
                      </div>
                    </div>
                  </>
                )}

                {ticket.customerSatisfaction && (
                  <>
                    <Separator />
                    <div>
                      <span className="font-medium text-sm text-gray-600">
                        Customer Rating
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < ticket.customerSatisfaction!
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300",
                            )}
                          />
                        ))}
                        <span className="text-sm ml-1">
                          ({ticket.customerSatisfaction}/5)
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Related Offer */}
            {ticket.offerTitle && (
              <Card>
                <CardHeader>
                  <CardTitle>Related Offer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link
                      to={`/offer/${ticket.offerId}`}
                      className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {ticket.offerTitle}
                    </Link>
                    {ticket.sellerName && (
                      <div className="text-sm text-gray-600">
                        by {ticket.sellerName}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={ticket.userAvatar} />
                      <AvatarFallback>
                        {ticket.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{ticket.userName}</div>
                      <div className="text-sm text-gray-600">
                        {ticket.userEmail}
                      </div>
                    </div>
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
