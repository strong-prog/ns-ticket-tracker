import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { useDeleteTicket } from "../hooks/useTickets";
import type { Ticket } from "../types/ticket";
import StatusChanger from "./StatusChanger";
import TicketDetailModal from "./TicketDetailModal";

interface Props {
  tickets: Ticket[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export default function TicketTable({ tickets }: Props) {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const deleteTicket = useDeleteTicket();
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const priorityLabels: Record<string, string> = {
    low: t("common.priority.low"),
    normal: t("common.priority.normal"),
    high: t("common.priority.high"),
  };

  function priorityBadge(priority: string) {
    const colors: Record<string, string> = {
      low: "bg-gray-100 text-gray-700",
      normal: "bg-blue-100 text-blue-700",
      high: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${colors[priority] || colors.normal}`}
      >
        {priorityLabels[priority] || priority}
      </span>
    );
  }

  return (
    <>
    <div className="overflow-x-auto bg-white border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">{t("ticketTable.id")}</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">{t("ticketTable.title")}</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">{t("ticketTable.status")}</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">{t("ticketTable.priority")}</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">{t("ticketTable.created")}</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">{t("ticketTable.actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500">{ticket.id}</td>
              <td className="px-4 py-3">
                <div
                  className="font-medium cursor-pointer hover:text-blue-600"
                  onClick={() => setSelectedTicket(ticket)}
                >{ticket.title}</div>
                {ticket.description && (
                  <div className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                    {ticket.description}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <StatusChanger ticketId={ticket.id} currentStatus={ticket.status} />
              </td>
              <td className="px-4 py-3">{priorityBadge(ticket.priority)}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                {formatDate(ticket.created_at)}
              </td>
              <td className="px-4 py-3">
                {isAdmin && ticket.status !== "done" && (
                  confirmingId === ticket.id ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="text-xs text-red-600">
                        {t("ticketTable.confirmPrompt", { id: ticket.id })}
                      </span>
                      <button
                        onClick={() => {
                          deleteTicket.mutate(ticket.id);
                          setConfirmingId(null);
                        }}
                        disabled={deleteTicket.isPending}
                        className="text-red-600 text-xs font-bold underline hover:text-red-800 disabled:opacity-50"
                      >
                        {t("ticketTable.confirm")}
                      </button>
                      <button
                        onClick={() => setConfirmingId(null)}
                        className="text-gray-500 text-xs underline hover:text-gray-700"
                      >
                        {t("ticketTable.cancel")}
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmingId(ticket.id)}
                      className="text-red-600 text-xs underline hover:text-red-800"
                    >
                      {t("ticketTable.delete")}
                    </button>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {selectedTicket && (
      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    )}
    </>
  );
}
