import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <input
      id="ticket-search"
      name="search"
      type="text"
      placeholder={t("search.placeholder")}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    />
  );
}
