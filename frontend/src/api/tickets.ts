import api from "./client";
import type { Ticket, TicketCreate, TicketList, TicketFilters, TicketStats, TicketUpdateStatus } from "../types/ticket";

export async function fetchStats(): Promise<TicketStats> {
  const { data } = await api.get<TicketStats>("/tickets/stats");
  return data;
}

export async function fetchTickets(filters: TicketFilters): Promise<TicketList> {
  const params: Record<string, string | number> = {};
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.search) params.search = filters.search;
  if (filters.sort_by) params.sort_by = filters.sort_by;
  if (filters.order) params.order = filters.order;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const { data } = await api.get<TicketList>("/tickets", { params });
  return data;
}

export async function createTicket(ticket: TicketCreate): Promise<Ticket> {
  const { data } = await api.post<Ticket>("/tickets", ticket);
  return data;
}

export async function updateTicketStatus(id: number, update: TicketUpdateStatus): Promise<Ticket> {
  const { data } = await api.patch<Ticket>(`/tickets/${id}/status`, update);
  return data;
}

export async function deleteTicket(id: number): Promise<void> {
  await api.delete(`/tickets/${id}`);
}

export async function loginAdmin(username: string, password: string): Promise<void> {
  const credentials = btoa(`${username}:${password}`);
  await api.post("/auth/login", null, {
    headers: { Authorization: `Basic ${credentials}` },
  });
}
