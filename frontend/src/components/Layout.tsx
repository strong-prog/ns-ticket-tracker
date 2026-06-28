import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "ru" ? "en" : "ru");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{t("layout.title")}</h1>
        <button
          onClick={toggleLang}
          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
        >
          {t("langSwitcher.label")}
        </button>
      </header>
      <main>{children}</main>
    </div>
  );
}
