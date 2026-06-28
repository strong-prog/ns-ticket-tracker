import { useTranslation } from "react-i18next";

export default function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="text-center py-16 text-gray-500">
      <p className="text-lg mb-2">{t("empty.title")}</p>
      <p className="text-sm">{t("empty.subtitle")}</p>
    </div>
  );
}
