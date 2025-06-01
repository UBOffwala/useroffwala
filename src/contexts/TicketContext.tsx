import React, { createContext, useContext, ReactNode } from "react";
import {
  Ticket,
  TicketMessage,
  TicketStatus,
  TicketFilters,
} from "@/types/ticket";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { tickets as initialTickets } from "@/data/tickets";
import { generateTicketId, generateMessageId } from "@/lib/tickets";

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (
    ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "messages">,
  ) => string;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  addMessage: (
    ticketId: string,
    message: Omit<TicketMessage, "id" | "ticketId" | "createdAt">,
  ) => void;
  assignAdmin: (ticketId: string, adminId: string, adminName: string) => void;
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
  deleteTicket: (ticketId: string) => void;
  getTicketById: (id: string) => Ticket | undefined;
  getUserTickets: (userId: string) => Ticket[];
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

interface TicketProviderProps {
  children: ReactNode;
}

export function TicketProvider({ children }: TicketProviderProps) {
  const [tickets, setTickets] = useLocalStorage<Ticket[]>(
    "tickets",
    initialTickets,
  );
  const [isAdmin, setIsAdmin] = useLocalStorage<boolean>("is_admin", false);

  const addTicket = (
    ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "messages">,
  ): string => {
    const newTicket: Ticket = {
      ...ticketData,
      id: generateTicketId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    setTickets((prev) => [newTicket, ...prev]);
    return newTicket.id;
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          const updates: Partial<Ticket> = {
            status,
            updatedAt: new Date().toISOString(),
          };

          if (status === "resolved" && !ticket.resolvedAt) {
            updates.resolvedAt = new Date().toISOString();
          } else if (status === "closed" && !ticket.closedAt) {
            updates.closedAt = new Date().toISOString();
          }

          return { ...ticket, ...updates };
        }
        return ticket;
      }),
    );
  };

  const addMessage = (
    ticketId: string,
    messageData: Omit<TicketMessage, "id" | "ticketId" | "createdAt">,
  ) => {
    const newMessage: TicketMessage = {
      ...messageData,
      id: generateMessageId(),
      ticketId,
      createdAt: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            messages: [...ticket.messages, newMessage],
            updatedAt: new Date().toISOString(),
          };
        }
        return ticket;
      }),
    );
  };

  const assignAdmin = (
    ticketId: string,
    adminId: string,
    adminName: string,
  ) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            assignedAdminId: adminId,
            assignedAdminName: adminName,
            updatedAt: new Date().toISOString(),
          };
        }
        return ticket;
      }),
    );
  };

  const updateTicket = (ticketId: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return ticket;
      }),
    );
  };

  const deleteTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
  };

  const getTicketById = (id: string): Ticket | undefined => {
    return tickets.find((ticket) => ticket.id === id);
  };

  const getUserTickets = (userId: string): Ticket[] => {
    return tickets
      .filter((ticket) => ticket.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicketStatus,
        addMessage,
        assignAdmin,
        updateTicket,
        deleteTicket,
        getTicketById,
        getUserTickets,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketProvider");
  }
  return context;
}
