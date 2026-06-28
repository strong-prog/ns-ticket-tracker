import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { TicketStatus } from "../types/ticket";
import { useUpdateTicketStatus } from "../hooks/useTickets";

interface Props {
  ticketId: number;
  currentStatus: TicketStatus;
}

export default function StatusChanger({ ticketId, currentStatus }: Props) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<TicketStatus>(currentStatus);
  const updateStatus = useUpdateTicketStatus();

  const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
    { value: "new", label: t("common.status.new") },
    { value: "in_progress", label: t("common.status.inProgress") },
    { value: "done", label: t("common.status.done") },
  ];

  if (currentStatus === "done") {
    return (
      <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
        {t("common.status.done")}
      </span>
    );
  }

  const handleChange = (status: TicketStatus) => {
    setSelected(status);
    updateStatus.mutate({ id: ticketId, update: { status } });
  };

  return (
    <select
      id={`status-${ticketId}`}
      name="status"
      value={selected}
      onChange={(e) => handleChange(e.target.value as TicketStatus)}
      className="px-2 py-0.5 text-xs border border-gray-300 rounded bg-white outline-none focus:ring-1 focus:ring-blue-500"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
