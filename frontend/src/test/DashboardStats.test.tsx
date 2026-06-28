import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./utils";
import DashboardStats from "../components/DashboardStats";
import type { TicketStats } from "../types/ticket";

describe("DashboardStats", () => {
  const stats: TicketStats = {
    total: 10,
    by_status: { new: 5, in_progress: 3, done: 2 },
    by_priority: { low: 2, normal: 5, high: 3 },
  };

  it("renders total count", () => {
    renderWithProviders(<DashboardStats stats={stats} />);
    expect(screen.getAllByText("10").length).toBeGreaterThanOrEqual(1);
  });

  it("renders status cards with correct labels", () => {
    renderWithProviders(<DashboardStats stats={stats} />);
    expect(screen.getAllByText("New").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("In Progress").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Done").length).toBeGreaterThanOrEqual(1);
  });

  it("renders priority bars with titles", () => {
    renderWithProviders(<DashboardStats stats={stats} />);
    const bars = screen.getAllByTitle("Normal: 5");
    expect(bars.length).toBeGreaterThanOrEqual(1);
  });

  it("hides priority section when no tickets", () => {
    const empty: TicketStats = { total: 0, by_status: {}, by_priority: {} };
    renderWithProviders(<DashboardStats stats={empty} />);
    expect(screen.getAllByText("0").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByText("Priority distribution").length).toBe(0);
  });
});
