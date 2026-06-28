import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTickets } from "./hooks/useTickets";
import AdminLogin from "./components/AdminLogin";
import EmptyState from "./components/EmptyState";
import ErrorMessage from "./components/ErrorMessage";
import FilterBar from "./components/FilterBar";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import Pagination from "./components/Pagination";
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

  return (
    <Layout>
      <div className="flex justify-end mb-4">
        <AdminLogin />
      </div>

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
        <>
          <TicketTable tickets={data.items} />
          <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
        </>
      )}
    </Layout>
  );
}
