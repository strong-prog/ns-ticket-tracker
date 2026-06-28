import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTickets, fetchStats, createTicket, updateTicketStatus, deleteTicket } from "../api/tickets";
import type { TicketCreate, TicketFilters, TicketUpdateStatus } from "../types/ticket";

export function useStats() {
  return useQuery({
    queryKey: ["tickets", "stats"],
    queryFn: fetchStats,
    staleTime: 10_000,
  });
}

export function useOverdueCount(days = 3) {
  return useQuery({
    queryKey: ["tickets", "overdue", days],
    queryFn: async () => {
      const data = await fetchTickets({
        status: "in_progress",
        limit: 100,
        sort_by: "updated_at",
        order: "asc",
      });
      const cutoff = Date.now() - days * 86_400_000;
      return data.items.filter((t) => new Date(t.updated_at).getTime() < cutoff).length;
    },
    staleTime: 30_000,
  });
}

export function useTickets(filters: TicketFilters) {
  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: () => fetchTickets(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TicketCreate) => createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, update }: { id: number; update: TicketUpdateStatus }) =>
      updateTicketStatus(id, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}
