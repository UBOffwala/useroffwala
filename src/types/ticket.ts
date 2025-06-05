export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketCategory =
  | "seller-issue"
  | "product-issue"
  | "payment-issue"
  | "delivery-issue"
  | "technical-issue"
  | "account-issue"
  | "other";

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  userType: "user" | "admin";
  userName: string;
  userAvatar?: string;
  message: string;
  attachments?: string[];
  createdAt: string;
  isEdited?: boolean;
  editedAt?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;

  // User Information
  userId: string;
  userName: string;
  userEmail: string;

  // Related Information
  offerId?: string;
  offerTitle?: string;
  sellerId?: string;
  sellerName?: string;

  // Tracking
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;

  // Admin Assignment
  assignedAdminId?: string;
  assignedAdminName?: string;

  // Messages/Responses
  messages: TicketMessage[];

  // Metadata
  tags?: string[];
  isUrgent?: boolean;
  customerSatisfaction?: 1 | 2 | 3 | 4 | 5;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  dateRange?: [string, string];
  assignedAdmin?: string;
  search?: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  avgResolutionTime: number; // in hours
}

export const ticketCategories = [
  {
    id: "seller-issue",
    name: "Seller Issue",
    icon: "👤",
    description: "Issues with seller behavior or policies",
  },
  {
    id: "product-issue",
    name: "Product Issue",
    icon: "📦",
    description: "Problems with product quality or description",
  },
  {
    id: "payment-issue",
    name: "Payment Issue",
    icon: "💳",
    description: "Payment processing or refund issues",
  },
  {
    id: "delivery-issue",
    name: "Delivery Issue",
    icon: "🚚",
    description: "Shipping and delivery problems",
  },
  {
    id: "technical-issue",
    name: "Technical Issue",
    icon: "⚙️",
    description: "Website or app technical problems",
  },
  {
    id: "account-issue",
    name: "Account Issue",
    icon: "🔐",
    description: "Account access or settings issues",
  },
  {
    id: "other",
    name: "Other",
    icon: "❓",
    description: "Other issues not covered above",
  },
] as const;

export const priorityLevels = [
  {
    id: "low",
    name: "Low",
    color: "bg-gray-100 text-gray-800",
    description: "Minor issue, no immediate action needed",
  },
  {
    id: "medium",
    name: "Medium",
    color: "bg-yellow-100 text-yellow-800",
    description: "Normal priority, address within 24-48 hours",
  },
  {
    id: "high",
    name: "High",
    color: "bg-orange-100 text-orange-800",
    description: "Important issue, needs attention soon",
  },
  {
    id: "critical",
    name: "Critical",
    color: "bg-red-100 text-red-800",
    description: "Urgent issue, immediate attention required",
  },
] as const;

export const statusOptions = [
  {
    id: "open",
    name: "Open",
    color: "bg-blue-100 text-blue-800",
    description: "New ticket, awaiting review",
  },
  {
    id: "in-progress",
    name: "In Progress",
    color: "bg-purple-100 text-purple-800",
    description: "Being worked on by support team",
  },
  {
    id: "resolved",
    name: "Resolved",
    color: "bg-green-100 text-green-800",
    description: "Issue has been resolved",
  },
  {
    id: "closed",
    name: "Closed",
    color: "bg-gray-100 text-gray-800",
    description: "Ticket is closed and archived",
  },
] as const;
