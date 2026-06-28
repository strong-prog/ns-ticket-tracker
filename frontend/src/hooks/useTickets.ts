import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTickets, createTicket, updateTicketStatus, deleteTicket } from "../api/tickets";
import type { TicketCreate, TicketFilters, TicketUpdateStatus } from "../types/ticket";

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
