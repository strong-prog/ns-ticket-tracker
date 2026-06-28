import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTickets, useStats, useOverdueCount } from "./hooks/useTickets";
import { useSavedFilters } from "./hooks/useSavedFilters";
import AdminLogin from "./components/AdminLogin";
import DashboardStats from "./components/DashboardStats";
import OverdueBanner from "./components/OverdueBanner";
import EmptyState from "./components/EmptyState";
import ErrorMessage from "./components/ErrorMessage";
import FilterBar from "./components/FilterBar";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import Pagination from "./components/Pagination";
import SavedFiltersDropdown from "./components/SavedFiltersDropdown";
import SearchBar from "./components/SearchBar";
import SortControls from "./components/SortControls";
import TicketForm from "./components/TicketForm";
import TicketTable from "./components/TicketTable";
import type { TicketFilters } from "./types/ticket";

export default function App() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const tableRef = useRef<HTMLDivElement>(null);
  const scrollToTable = useRef(false);

  const filters: TicketFilters = {
    search: search || undefined,
    status: (status || undefined) as TicketFilters["status"],
    priority: (priority || undefined) as TicketFilters["priority"],
    sort_by: sortBy,
    order,
    page,
    limit: 10,
  };

  const { data, isLoading, isError, error, refetch } = useTickets(filters);
  const { data: stats } = useStats();
  const { data: overdueCount = 0 } = useOverdueCount(3);
  const { presets, save, remove } = useSavedFilters();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value);
    setPage(1);
  };

  const handleSortByChange = (field: string) => {
    setSortBy(field);
    setPage(1);
  };

  const handleOrderChange = (newOrder: "asc" | "desc") => {
    setOrder(newOrder);
    setPage(1);
  };

  useEffect(() => {
    if (scrollToTable.current && !isLoading && data && data.items.length > 0) {
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      scrollToTable.current = false;
    }
  }, [data, isLoading]);

  return (
    <Layout>
      <div className="flex justify-end mb-4">
        <AdminLogin />
      </div>

      {stats && <DashboardStats stats={stats} />}
      <OverdueBanner
        count={overdueCount}
        days={3}
        onClick={() => {
          scrollToTable.current = true;
          setStatus("in_progress");
        }}
      />

      <TicketForm />

      <div className="flex flex-col gap-4 mb-4">
        <SearchBar value={search} onChange={handleSearchChange} />
        <div className="flex flex-wrap gap-3 items-center">
          <FilterBar
            status={status}
            priority={priority}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
          />
          <SortControls
            sortBy={sortBy}
            order={order}
            onSortByChange={handleSortByChange}
            onOrderChange={handleOrderChange}
          />
          <SavedFiltersDropdown
            presets={presets}
            onApply={(p) => {
              setSearch(p.search);
              setStatus(p.status);
              setPriority(p.priority);
              setSortBy(p.sortBy);
              setOrder(p.order);
              setPage(1);
            }}
            onSave={(name) => {
              save({ name, search, status, priority, sortBy, order });
            }}
            onDelete={remove}
          />
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
      {isError && (
        <ErrorMessage
          message={error instanceof Error ? error.message : t("error.failedToLoad")}
          onRetry={() => refetch()}
        />
      )}
      {data && data.items.length === 0 && <EmptyState />}
      {data && data.items.length > 0 && (
        <div ref={tableRef}>
          <TicketTable tickets={data.items} />
          <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
        </div>
      )}
    </Layout>
  );
}
