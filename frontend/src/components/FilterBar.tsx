import { useTranslation } from "react-i18next";

interface Props {
  status: string;
  priority: string;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
}

export default function FilterBar({ status, priority, onStatusChange, onPriorityChange }: Props) {
  const { t } = useTranslation();

  const STATUS_OPTIONS = [
    { value: "", label: t("filter.allStatuses") },
    { value: "new", label: t("common.status.new") },
    { value: "in_progress", label: t("common.status.inProgress") },
    { value: "done", label: t("common.status.done") },
  ];

  const PRIORITY_OPTIONS = [
    { value: "", label: t("filter.allPriorities") },
    { value: "low", label: t("common.priority.low") },
    { value: "normal", label: t("common.priority.normal") },
    { value: "high", label: t("common.priority.high") },
  ];
  return (
    <div className="flex gap-3">
      <select
        id="filter-status"
        name="status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        id="filter-priority"
        name="priority"
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
      >
        {PRIORITY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
