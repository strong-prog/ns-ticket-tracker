import { useTranslation } from "react-i18next";

interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: Props) {
  const { t } = useTranslation();
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p className="text-red-700 mb-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-red-600 underline hover:text-red-800"
        >
          {t("error.retry")}
        </button>
      )}
    </div>
  );
}
