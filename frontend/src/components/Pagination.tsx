import { useTranslation } from "react-i18next";

interface Props {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pages, onPageChange }: Props) {
  const { t } = useTranslation();
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 border rounded-lg disabled:opacity-30 hover:bg-gray-50"
      >
        {t("pagination.prev")}
      </button>
      <span className="text-sm text-gray-600">
        {t("pagination.pageInfo", { page, pages })}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="px-3 py-1.5 border rounded-lg disabled:opacity-30 hover:bg-gray-50"
      >
        {t("pagination.next")}
      </button>
    </div>
  );
}
