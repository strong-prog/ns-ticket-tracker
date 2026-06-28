import { useTranslation } from "react-i18next";
import type { TicketStats } from "../types/ticket";

interface Props {
  stats: TicketStats;
}

const STATUS_CARDS = [
  { key: "new", color: "border-l-blue-500", bg: "bg-blue-50", text: "text-blue-700" },
  { key: "in_progress", color: "border-l-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  { key: "done", color: "border-l-green-500", bg: "bg-green-50", text: "text-green-700" },
] as const;

const PRIORITY_CONFIG = {
  low: { color: "bg-gray-400", width: "w-1/4" },
  normal: { color: "bg-blue-500", width: "w-2/4" },
  high: { color: "bg-red-500", width: "w-1/4" },
};

export default function DashboardStats({ stats }: Props) {
  const { t } = useTranslation();
  const total = stats.total || 0;

  const priorityTotal =
    (stats.by_priority?.low || 0) +
    (stats.by_priority?.normal || 0) +
    (stats.by_priority?.high || 0);

  const statusLabels: Record<string, string> = {
    new: t("common.status.new"),
    in_progress: t("common.status.inProgress"),
    done: t("common.status.done"),
  };

  const priorityLabels: Record<string, string> = {
    low: t("common.priority.low"),
    normal: t("common.priority.normal"),
    high: t("common.priority.high"),
  };

  return (
    <div className="mb-4 space-y-3">
      <div className="grid grid-cols-4 gap-3">
        <div className="border-l-4 border-l-gray-500 bg-white rounded-lg p-3 shadow-sm">
          <div className="text-xs text-gray-500">{t("dashboard.total")}</div>
          <div className="text-xl font-bold text-gray-800">{total}</div>
        </div>
        {STATUS_CARDS.map(({ key, color, bg, text }) => (
          <div key={key} className={`border-l-4 ${color} ${bg} rounded-lg p-3 shadow-sm`}>
            <div className={`text-xs ${text}`}>{statusLabels[key]}</div>
            <div className={`text-xl font-bold ${text}`}>
              {stats.by_status?.[key] || 0}
            </div>
          </div>
        ))}
      </div>

      {priorityTotal > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-3">{t("dashboard.priorityDistribution")}</div>
          <div className="flex items-center gap-2 mb-3">
            {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => {
              const count = stats.by_priority?.[key] || 0;
              const pct = priorityTotal > 0 ? Math.round((count / priorityTotal) * 100) : 0;
              return (
                <div
                  key={key}
                  className={`h-4 ${cfg.color} rounded`}
                  style={{ width: `${Math.max(pct, 4)}%` }}
                  title={`${priorityLabels[key]}: ${count}`}
                />
              );
            })}
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            {Object.entries(PRIORITY_CONFIG).map(([key]) => {
              const count = stats.by_priority?.[key] || 0;
              return (
                <span key={key}>
                  {priorityLabels[key]}: <strong>{count}</strong>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
