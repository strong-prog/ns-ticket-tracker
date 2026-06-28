import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { SavedFilter } from "../hooks/useSavedFilters";

interface Props {
  presets: SavedFilter[];
  onApply: (preset: SavedFilter) => void;
  onSave: (name: string) => void;
  onDelete: (name: string) => void;
}

export default function SavedFiltersDropdown({ presets, onApply, onSave, onDelete }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSaving(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:bg-gray-50 flex items-center gap-1"
      >
        {t("savedFilters.label")}
        {presets.length > 0 && (
          <span className="text-xs text-gray-400">({presets.length})</span>
        )}
        <span className="text-xs ml-1">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
          {presets.length === 0 && !saving && (
            <p className="px-4 py-3 text-sm text-gray-400">
              {t("savedFilters.saveCurrent")}…
            </p>
          )}

          {presets.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-50"
            >
              <button
                onClick={() => {
                  onApply(p);
                  setOpen(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 text-left flex-1 truncate"
              >
                {p.name}
              </button>
              <button
                onClick={() => onDelete(p.name)}
                className="text-gray-400 hover:text-red-600 ml-2 text-xs flex-shrink-0"
                title={t("ticketTable.delete")}
              >
                ✕
              </button>
            </div>
          ))}

          <div className="border-t border-gray-100">
            {saving ? (
              <div className="px-4 py-2 flex items-center gap-2">
                <input
                  id="preset-name"
                  name="preset_name"
                  type="text"
                  placeholder={t("savedFilters.namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && name.trim()) {
                    onSave(name.trim());
                    setName("");
                    setSaving(false);
                    setOpen(false);
                  }
                  }}
                  autoFocus
                />
                <button
                  onClick={() => setSaving(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  {t("savedFilters.cancel")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSaving(true)}
                className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                + {t("savedFilters.saveCurrent")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
