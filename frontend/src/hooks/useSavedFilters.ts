import { useState, useCallback } from "react";

export interface SavedFilter {
  name: string;
  search: string;
  status: string;
  priority: string;
  sortBy: string;
  order: "asc" | "desc";
}

const STORAGE_KEY = "savedTicketFilters";

function loadPresets(): SavedFilter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function storePresets(presets: SavedFilter[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export function useSavedFilters() {
  const [presets, setPresets] = useState<SavedFilter[]>(loadPresets);

  const save = useCallback((preset: SavedFilter) => {
    setPresets((prev) => {
      const filtered = prev.filter((p) => p.name !== preset.name);
      const next = [...filtered, preset];
      storePresets(next);
      return next;
    });
  }, []);

  const remove = useCallback((name: string) => {
    setPresets((prev) => {
      const next = prev.filter((p) => p.name !== name);
      storePresets(next);
      return next;
    });
  }, []);

  return { presets, save, remove };
}
