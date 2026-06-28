import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./utils";
import OverdueBanner from "../components/OverdueBanner";

describe("OverdueBanner", () => {
  it("renders nothing when count is 0", () => {
    const { container } = renderWithProviders(
      <OverdueBanner count={0} days={3} onClick={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders banner when count > 0", () => {
    renderWithProviders(
      <OverdueBanner count={5} days={3} onClick={() => {}} />,
    );
    expect(screen.getByText(/5.*3/)).toBeInTheDocument();
  });

  it("calls onClick when banner is clicked", () => {
    const onClick = vi.fn();
    renderWithProviders(
      <OverdueBanner count={2} days={7} onClick={onClick} />,
    );
    fireEvent.click(screen.getByText(/2.*7/));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
