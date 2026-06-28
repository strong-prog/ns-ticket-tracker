export type TicketStatus = "new" | "in_progress" | "done";
export type TicketPriority = "low" | "normal" | "high";

export interface Ticket {
  id: number;
  title: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
}

export interface TicketCreate {
  title: string;
  description?: string | null;
  priority: TicketPriority;
}

export interface TicketUpdateStatus {
  status: TicketStatus;
}

export interface TicketList {
  items: Ticket[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  search?: string;
  sort_by?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}
