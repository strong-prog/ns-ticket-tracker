import { useTranslation } from "react-i18next";

interface Props {
  sortBy: string;
  order: "asc" | "desc";
  onSortByChange: (field: string) => void;
  onOrderChange: (order: "asc" | "desc") => void;
}

export default function SortControls({ sortBy, order, onSortByChange, onOrderChange }: Props) {
  const { t } = useTranslation();

  const SORT_OPTIONS = [
    { value: "created_at", label: t("sort.date") },
    { value: "priority", label: t("sort.priority") },
    { value: "status", label: t("sort.status") },
    { value: "title", label: t("sort.title") },
  ];

  return (
    <div className="flex items-center gap-2">
      <select
        id="sort-by"
        name="sort_by"
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {t("sort.label", { field: opt.label })}
          </option>
        ))}
      </select>
      <button
        onClick={() => onOrderChange(order === "asc" ? "desc" : "asc")}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
        title={order === "asc" ? t("sort.asc") : t("sort.desc")}
      >
        {order === "asc" ? "↑" : "↓"}
      </button>
    </div>
  );
}
