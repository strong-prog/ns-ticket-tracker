import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { useDeleteTicket } from "../hooks/useTickets";
import type { Ticket } from "../types/ticket";
import StatusChanger from "./StatusChanger";

interface Props {
  ticket: Ticket;
  onClose: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export default function TicketDetailModal({ ticket, onClose }: Props) {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const deleteTicket = useDeleteTicket();
  const [confirming, setConfirming] = useState(false);

  const priorityLabels: Record<string, string> = {
    low: t("common.priority.low"),
    normal: t("common.priority.normal"),
    high: t("common.priority.high"),
  };

  const statusLabels: Record<string, string> = {
    new: t("common.status.new"),
    in_progress: t("common.status.inProgress"),
    done: t("common.status.done"),
  };

  const handleDelete = () => {
    deleteTicket.mutate(ticket.id, { onSuccess: () => onClose() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            {t("ticketDetail.title", { id: ticket.id })}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">{t("ticketTable.title")}</div>
            <div className="text-sm font-medium text-gray-800">{ticket.title}</div>
          </div>

          <div>
            <div className="text-xs text-gray-400 mb-1">{t("ticketDetail.description")}</div>
            <div className="text-sm text-gray-700">
              {ticket.description || <span className="text-gray-300 italic">&mdash;</span>}
            </div>
          </div>

          <div className="flex gap-6">
            <div>
              <div className="text-xs text-gray-400 mb-1">{t("ticketDetail.status")}</div>
              <div className="text-sm">
                {ticket.status === "done" ? (
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {statusLabels[ticket.status]}
                  </span>
                ) : (
                  <StatusChanger ticketId={ticket.id} currentStatus={ticket.status} />
                )}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">{t("ticketDetail.priority")}</div>
              <div className="text-sm font-medium">{priorityLabels[ticket.priority]}</div>
            </div>
          </div>

          <div className="flex gap-6">
            <div>
              <div className="text-xs text-gray-400 mb-1">{t("ticketDetail.created")}</div>
              <div className="text-sm text-gray-600">{formatDate(ticket.created_at)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">{t("ticketDetail.updated")}</div>
              <div className="text-sm text-gray-600">{formatDate(ticket.updated_at)}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            {t("ticketDetail.close")}
          </button>
          {isAdmin && ticket.status !== "done" && (
            confirming ? (
              <span className="inline-flex items-center gap-2">
                <span className="text-xs text-red-600">
                  {t("ticketTable.confirmPrompt", { id: ticket.id })}
                </span>
                <button
                  onClick={handleDelete}
                  disabled={deleteTicket.isPending}
                  className="text-red-600 text-xs font-bold underline hover:text-red-800 disabled:opacity-50"
                >
                  {t("ticketTable.confirm")}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="text-gray-500 text-xs underline hover:text-gray-700"
                >
                  {t("ticketTable.cancel")}
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="text-red-600 text-sm underline hover:text-red-800"
              >
                {t("ticketTable.delete")}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
