import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TicketIcon,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useTickets } from "@/contexts/TicketContext";
import { useUser } from "@/contexts/UserContext";
import { getRelativeTime } from "@/lib/tickets";
import { statusOptions } from "@/types/ticket";

export function TicketSummary() {
  const { getUserTickets } = useTickets();
  const { user } = useUser();

  const userTickets = getUserTickets(user.id);
  const recentTickets = userTickets.slice(0, 3);

  const ticketStats = {
    total: userTickets.length,
    open: userTickets.filter((t) => t.status === "open").length,
    inProgress: userTickets.filter((t) => t.status === "in-progress").length,
    resolved: userTickets.filter((t) => t.status === "resolved").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-purple-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <TicketIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find((s) => s.id === status);
    return statusOption?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TicketIcon className="h-5 w-5" />
          Support Tickets
        </CardTitle>
        <Link to="/tickets/new">
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {ticketStats.total}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {ticketStats.open}
            </div>
            <div className="text-sm text-gray-600">Open</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {ticketStats.inProgress}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {ticketStats.resolved}
            </div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
        </div>

        {/* Recent Tickets */}
        {recentTickets.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-900">
              Recent Tickets
            </h3>
            {recentTickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(ticket.status)}
                      <span className="font-medium text-sm truncate">
                        {ticket.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${getStatusColor(ticket.status)} text-xs`}
                      >
                        {
                          statusOptions.find((s) => s.id === ticket.status)
                            ?.name
                        }
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {getRelativeTime(ticket.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <TicketIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-3">No support tickets yet</p>
            <Link to="/tickets/new">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Ticket
              </Button>
            </Link>
          </div>
        )}

        {userTickets.length > 3 && (
          <div className="text-center">
            <Link to="/tickets">
              <Button variant="ghost" size="sm" className="gap-2">
                View All Tickets
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
