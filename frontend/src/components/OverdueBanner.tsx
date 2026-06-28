import { useTranslation } from "react-i18next";

interface Props {
  count: number;
  days: number;
  onClick: () => void;
}

export default function OverdueBanner({ count, days, onClick }: Props) {
  const { t } = useTranslation();

  if (count === 0) return null;

  return (
    <div
      onClick={onClick}
      className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 mb-4 cursor-pointer hover:bg-amber-100 transition-colors"
    >
      <p className="text-sm text-amber-800">
        {t("overdue.banner", { count, days })}
      </p>
    </div>
  );
}
