import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSavedFilters, type SavedFilter } from "../hooks/useSavedFilters";

const STORAGE_KEY = "savedTicketFilters";

function preset(overrides: Partial<SavedFilter> = {}): SavedFilter {
  return {
    name: "Default",
    search: "",
    status: "",
    priority: "",
    sortBy: "created_at",
    order: "desc",
    ...overrides,
  };
}

describe("useSavedFilters", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty presets when nothing stored", () => {
    const { result } = renderHook(() => useSavedFilters());
    expect(result.current.presets).toEqual([]);
  });

  it("loads presets from localStorage on init", () => {
    const stored: SavedFilter[] = [
      preset({ name: "Urgent", priority: "high" }),
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useSavedFilters());
    expect(result.current.presets).toEqual(stored);
  });

  it("saves a new preset", () => {
    const { result } = renderHook(() => useSavedFilters());

    act(() => {
      result.current.save(preset({ name: "My View", status: "new" }));
    });

    expect(result.current.presets).toHaveLength(1);
    expect(result.current.presets[0].name).toBe("My View");
    expect(result.current.presets[0].status).toBe("new");

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(JSON.parse(raw!)).toEqual(result.current.presets);
  });

  it("overwrites existing preset by name", () => {
    const { result } = renderHook(() => useSavedFilters());

    act(() => {
      result.current.save(preset({ name: "View", priority: "low" }));
    });
    act(() => {
      result.current.save(preset({ name: "View", priority: "high" }));
    });

    expect(result.current.presets).toHaveLength(1);
    expect(result.current.presets[0].priority).toBe("high");
  });

  it("removes a preset by name", () => {
    const { result } = renderHook(() => useSavedFilters());

    act(() => {
      result.current.save(preset({ name: "A" }));
      result.current.save(preset({ name: "B" }));
    });
    expect(result.current.presets).toHaveLength(2);

    act(() => {
      result.current.remove("A");
    });

    expect(result.current.presets).toHaveLength(1);
    expect(result.current.presets[0].name).toBe("B");
  });

  it("survives corrupt localStorage", () => {
    localStorage.setItem(STORAGE_KEY, "not-json{");

    const { result } = renderHook(() => useSavedFilters());
    expect(result.current.presets).toEqual([]);
  });
});
