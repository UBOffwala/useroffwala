import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  TicketIcon,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTickets } from "@/contexts/TicketContext";
import { useUser } from "@/contexts/UserContext";
import { filterTickets, getTicketStats, getRelativeTime } from "@/lib/tickets";
import {
  ticketCategories,
  priorityLevels,
  statusOptions,
} from "@/types/ticket";
import { cn } from "@/lib/utils";

export default function Tickets() {
  const { tickets, isAdmin, setIsAdmin } = useTickets();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter tickets based on current filters and user role
  const filteredTickets = filterTickets({
    search: searchQuery || undefined,
    status: selectedStatus !== "all" ? (selectedStatus as any) : undefined,
    priority:
      selectedPriority !== "all" ? (selectedPriority as any) : undefined,
    category:
      selectedCategory !== "all" ? (selectedCategory as any) : undefined,
  });

  // Further filter by user if not admin
  const displayTickets = isAdmin
    ? filteredTickets
    : filteredTickets.filter((ticket) => ticket.userId === user.id);

  const stats = getTicketStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <TicketIcon className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    const priorityLevel = priorityLevels.find((p) => p.id === priority);
    return priorityLevel?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find((s) => s.id === status);
    return statusOption?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <TicketIcon className="h-8 w-8 text-blue-600" />
              Support Tickets
            </h1>
            <p className="text-gray-600">
              {isAdmin
                ? "Manage and respond to customer support tickets"
                : "Track your support requests and get help"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {isAdmin && (
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border">
                <Settings className="h-4 w-4 text-gray-500" />
                <Label htmlFor="admin-mode" className="text-sm">
                  Admin Mode
                </Label>
                <Switch
                  id="admin-mode"
                  checked={isAdmin}
                  onCheckedChange={setIsAdmin}
                />
              </div>
            )}

            <Link to="/tickets/new">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4" />
                New Ticket
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Total Tickets</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.open}
                </div>
                <div className="text-sm text-gray-600">Open</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.inProgress}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.resolved}
                </div>
                <div className="text-sm text-gray-600">Resolved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.avgResolutionTime}h
                </div>
                <div className="text-sm text-gray-600">Avg Resolution</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {ticketCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedPriority}
                  onValueChange={setSelectedPriority}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    {priorityLevels.map((priority) => (
                      <SelectItem key={priority.id} value={priority.id}>
                        {priority.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Lists */}
          {(["all", "open", "in-progress", "resolved", "closed"] as const).map(
            (tabStatus) => (
              <TabsContent
                key={tabStatus}
                value={tabStatus}
                className="space-y-4"
              >
                {displayTickets
                  .filter(
                    (ticket) =>
                      tabStatus === "all" || ticket.status === tabStatus,
                  )
                  .map((ticket) => (
                    <Card
                      key={ticket.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(ticket.status)}
                                <Link
                                  to={`/tickets/${ticket.id}`}
                                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                >
                                  {ticket.title}
                                </Link>
                              </div>

                              <div className="flex gap-2 ml-auto">
                                <Badge
                                  className={getPriorityColor(ticket.priority)}
                                >
                                  {
                                    priorityLevels.find(
                                      (p) => p.id === ticket.priority,
                                    )?.name
                                  }
                                </Badge>
                                <Badge
                                  className={getStatusColor(ticket.status)}
                                >
                                  {
                                    statusOptions.find(
                                      (s) => s.id === ticket.status,
                                    )?.name
                                  }
                                </Badge>
                                {ticket.isUrgent && (
                                  <Badge className="bg-red-100 text-red-800">
                                    Urgent
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {ticket.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{ticket.userName}</span>
                              </div>

                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{getRelativeTime(ticket.createdAt)}</span>
                              </div>

                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>
                                  {ticket.messages.length}{" "}
                                  {ticket.messages.length === 1
                                    ? "message"
                                    : "messages"}
                                </span>
                              </div>

                              {ticket.category && (
                                <div className="flex items-center gap-1">
                                  <span>
                                    {
                                      ticketCategories.find(
                                        (c) => c.id === ticket.category,
                                      )?.icon
                                    }
                                  </span>
                                  <span>
                                    {
                                      ticketCategories.find(
                                        (c) => c.id === ticket.category,
                                      )?.name
                                    }
                                  </span>
                                </div>
                              )}

                              {ticket.assignedAdminName && (
                                <div className="flex items-center gap-1">
                                  <span>
                                    Assigned to:{" "}
                                    <strong>{ticket.assignedAdminName}</strong>
                                  </span>
                                </div>
                              )}
                            </div>

                            {ticket.tags && ticket.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {ticket.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <Link to={`/tickets/${ticket.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>

                            {ticket.offerTitle && (
                              <Link to={`/offer/${ticket.offerId}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600"
                                >
                                  View Offer
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                {displayTickets.filter(
                  (ticket) =>
                    tabStatus === "all" || ticket.status === tabStatus,
                ).length === 0 && (
                  <div className="text-center py-12">
                    <TicketIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No tickets found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {tabStatus === "all"
                        ? "No tickets match your current filters."
                        : `No ${tabStatus.replace("-", " ")} tickets found.`}
                    </p>
                    {tabStatus === "all" && (
                      <Link to="/tickets/new">
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Create New Ticket
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </TabsContent>
            ),
          )}
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
