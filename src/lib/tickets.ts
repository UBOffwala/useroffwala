import {
  Ticket,
  TicketFilters,
  TicketStats,
  TicketMessage,
  TicketStatus,
  TicketPriority,
} from "@/types/ticket";
import { tickets } from "@/data/tickets";

export function getAllTickets(): Ticket[] {
  return tickets.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getTicketById(id: string): Ticket | undefined {
  return tickets.find((ticket) => ticket.id === id);
}

export function getUserTickets(userId: string): Ticket[] {
  return tickets
    .filter((ticket) => ticket.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}

export function filterTickets(filters: TicketFilters): Ticket[] {
  let filteredTickets = [...tickets];

  if (filters.status) {
    filteredTickets = filteredTickets.filter(
      (ticket) => ticket.status === filters.status,
    );
  }

  if (filters.priority) {
    filteredTickets = filteredTickets.filter(
      (ticket) => ticket.priority === filters.priority,
    );
  }

  if (filters.category) {
    filteredTickets = filteredTickets.filter(
      (ticket) => ticket.category === filters.category,
    );
  }

  if (filters.assignedAdmin) {
    filteredTickets = filteredTickets.filter(
      (ticket) => ticket.assignedAdminId === filters.assignedAdmin,
    );
  }

  if (filters.search) {
    const query = filters.search.toLowerCase();
    filteredTickets = filteredTickets.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query) ||
        ticket.userName.toLowerCase().includes(query) ||
        ticket.tags?.some((tag) => tag.toLowerCase().includes(query)),
    );
  }

  if (filters.dateRange) {
    const [startDate, endDate] = filters.dateRange;
    filteredTickets = filteredTickets.filter((ticket) => {
      const ticketDate = new Date(ticket.createdAt);
      return (
        ticketDate >= new Date(startDate) && ticketDate <= new Date(endDate)
      );
    });
  }

  return filteredTickets.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getTicketStats(): TicketStats {
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in-progress").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;
  const closed = tickets.filter((t) => t.status === "closed").length;

  // Calculate average resolution time (mock calculation)
  const resolvedTickets = tickets.filter((t) => t.resolvedAt);
  const avgResolutionTime =
    resolvedTickets.length > 0
      ? resolvedTickets.reduce((acc, ticket) => {
          const created = new Date(ticket.createdAt).getTime();
          const resolved = new Date(ticket.resolvedAt!).getTime();
          return acc + (resolved - created) / (1000 * 60 * 60); // Convert to hours
        }, 0) / resolvedTickets.length
      : 0;

  return {
    total,
    open,
    inProgress,
    resolved,
    closed,
    avgResolutionTime: Math.round(avgResolutionTime),
  };
}

export function formatTicketDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getRelativeTime(date: string): string {
  const now = new Date();
  const ticketDate = new Date(date);
  const diffInHours = Math.floor(
    (now.getTime() - ticketDate.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 168) {
    // 7 days
    const days = Math.floor(diffInHours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    return ticketDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

export function getPriorityWeight(priority: TicketPriority): number {
  const weights = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };
  return weights[priority];
}

export function getStatusWeight(status: TicketStatus): number {
  const weights = {
    open: 4,
    "in-progress": 3,
    resolved: 2,
    closed: 1,
  };
  return weights[status];
}

export function sortTicketsByPriority(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => {
    const priorityDiff =
      getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
    if (priorityDiff !== 0) return priorityDiff;

    const statusDiff = getStatusWeight(b.status) - getStatusWeight(a.status);
    if (statusDiff !== 0) return statusDiff;

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function generateTicketId(): string {
  return `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
