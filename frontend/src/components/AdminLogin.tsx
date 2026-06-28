import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";

export default function AdminLogin() {
  const { t } = useTranslation();
  const { isAdmin, login, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login(username, password);
    } catch {
      setError(t("admin.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-green-700 font-medium">{t("admin.mode")}</span>
        <button
          onClick={logout}
          className="text-sm text-red-600 underline hover:text-red-800"
        >
          {t("admin.logout")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        id="admin-username"
        name="username"
        type="text"
        autoComplete="username"
        placeholder={t("admin.username")}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded text-sm w-28 outline-none focus:ring-1 focus:ring-blue-500"
      />
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder={t("admin.password")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded text-sm w-28 outline-none focus:ring-1 focus:ring-blue-500"
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      />
      <button
        onClick={handleLogin}
        disabled={loading || !username || !password}
        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "..." : t("admin.login")}
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
