import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  User,
  X,
  Pencil,
  Ban,
  XCircle,
} from "lucide-react";
import api from "../context/api/api";

// import api from "../api";

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

// const API_URL = "auditlog/auditlogs/";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const formatDateTime = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
};

const getInitial = (name) => {
  if (!name) return "?";

  return String(name)
    .charAt(0)
    .toUpperCase();
};

const getActionConfig = (action) => {
  switch (action) {
    case "CREATE":
      return {
        label: "Created",
        icon: Plus,
        color:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
        iconColor: "bg-emerald-100 text-emerald-600",
      };

    case "UPDATE":
      return {
        label: "Updated",
        icon: Pencil,
        color:
          "bg-blue-50 text-blue-700 border-blue-200",
        iconColor: "bg-blue-100 text-blue-600",
      };

    case "DELETE":
      return {
        label: "Deleted",
        icon: Trash2,
        color:
          "bg-red-50 text-red-700 border-red-200",
        iconColor: "bg-red-100 text-red-600",
      };

    case "APPROVE":
      return {
        label: "Approved",
        icon: CheckCircle2,
        color:
          "bg-green-50 text-green-700 border-green-200",
        iconColor: "bg-green-100 text-green-600",
      };

    case "REJECT":
      return {
        label: "Rejected",
        icon: XCircle,
        color:
          "bg-orange-50 text-orange-700 border-orange-200",
        iconColor: "bg-orange-100 text-orange-600",
      };

    case "CANCEL":
      return {
        label: "Cancelled",
        icon: Ban,
        color:
          "bg-slate-100 text-slate-700 border-slate-200",
        iconColor: "bg-slate-200 text-slate-600",
      };

    default:
      return {
        label: action || "Action",
        icon: Activity,
        color:
          "bg-violet-50 text-violet-700 border-violet-200",
        iconColor: "bg-violet-100 text-violet-600",
      };
  }
};

/*
|--------------------------------------------------------------------------
| Main Component
|--------------------------------------------------------------------------
*/

const ViewAuditLogs = () => {
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");

  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedLog, setSelectedLog] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Fetch Audit Logs
  |--------------------------------------------------------------------------
  */

  const fetchAuditLogs = async ({ refresh = false } = {}) => {
    try {
      setError("");

      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("auditlog/auditlogs");
      const data = response.data;

      if (Array.isArray(data)) {
        setLogs(data);
      } else if (Array.isArray(data.results)) {
        setLogs(data.results);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error("Audit log fetch error:", err);

      if (err.response?.status === 401) {
        setError(
          "You are not authenticated. Please sign in again."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to load audit logs."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);
  const actions = useMemo(() => {
    const uniqueActions = [
      ...new Set(
        logs
          .map((log) => log.action)
          .filter(Boolean)
      ),
    ];

    return ["all", ...uniqueActions];
  }, [logs]);

  const models = useMemo(() => {
    const uniqueModels = [
      ...new Set(
        logs
          .map((log) => log.model_name)
          .filter(Boolean)
      ),
    ];

    return ["all", ...uniqueModels];
  }, [logs]);
  const filteredLogs = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return logs.filter((log) => {
      const description =
        log.description?.toLowerCase() || "";

      const user =
        log.user_display?.toLowerCase() || "";

      const model =
        log.model_name?.toLowerCase() || "";

      const objectId =
        String(log.object_id || "").toLowerCase();

      const action =
        log.action?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        description.includes(searchValue) ||
        user.includes(searchValue) ||
        model.includes(searchValue) ||
        objectId.includes(searchValue) ||
        action.includes(searchValue);

      const matchesAction =
        actionFilter === "all" ||
        log.action === actionFilter;

      const matchesModel =
        modelFilter === "all" ||
        log.model_name === modelFilter;

      return (
        matchesSearch &&
        matchesAction &&
        matchesModel
      );
    });
  }, [
    logs,
    search,
    actionFilter,
    modelFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Sorting
  |--------------------------------------------------------------------------
  */

  const sortedLogs = useMemo(() => {
    const sorted = [...filteredLogs];

    sorted.sort((a, b) => {
      let valueA;
      let valueB;

      if (sortField === "user") {
        valueA = (
          a.user_display || ""
        ).toLowerCase();

        valueB = (
          b.user_display || ""
        ).toLowerCase();
      } else if (sortField === "action") {
        valueA = (
          a.action || ""
        ).toLowerCase();

        valueB = (
          b.action || ""
        ).toLowerCase();
      } else if (sortField === "model") {
        valueA = (
          a.model_name || ""
        ).toLowerCase();

        valueB = (
          b.model_name || ""
        ).toLowerCase();
      } else {
        valueA = new Date(
          a.created_at || 0
        ).getTime();

        valueB = new Date(
          b.created_at || 0
        ).getTime();
      }

      if (valueA < valueB) {
        return sortDirection === "asc"
          ? -1
          : 1;
      }

      if (valueA > valueB) {
        return sortDirection === "asc"
          ? 1
          : -1;
      }

      return 0;
    });

    return sorted;
  }, [
    filteredLogs,
    sortField,
    sortDirection,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedLogs.length / itemsPerPage
    )
  );

  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
    const creates = logs.filter(
      (log) => log.action === "CREATE"
    ).length;

    const updates = logs.filter(
      (log) => log.action === "UPDATE"
    ).length;

    const deletes = logs.filter(
      (log) => log.action === "DELETE"
    ).length;

    const users = new Set(
    logs
        .map((log) => log.user)
        .filter(Boolean)
    );

    return {
      total: logs.length,
      creates,
      updates,
      deletes,
      users: users.size,
    };
  }, [logs]);

  /*
  |--------------------------------------------------------------------------
  | Sorting
  |--------------------------------------------------------------------------
  */

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((current) =>
        current === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }

    setCurrentPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Clear Filters
  |--------------------------------------------------------------------------
  */

  const clearFilters = () => {
    setSearch("");
    setActionFilter("all");
    setModelFilter("all");
    setCurrentPage(1);
  };

  const hasFilters =
    search ||
    actionFilter !== "all" ||
    modelFilter !== "all";

  /*
  |--------------------------------------------------------------------------
  | Sort Icon
  |--------------------------------------------------------------------------
  */

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
      );
    }

    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-emerald-600" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-emerald-600" />
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          <div className="animate-pulse space-y-6">

            <div className="h-10 w-56 rounded-lg bg-slate-200" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl bg-white"
                />
              ))}
            </div>

            <div className="h-[500px] rounded-2xl bg-white" />

          </div>

        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-xl bg-emerald-100 p-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-emerald-600">
                System Activity
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Audit Logs
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track every important action performed in the system.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              fetchAuditLogs({
                refresh: true,
              })
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <RefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

            <div>

              <p className="font-semibold text-red-800">
                Unable to load audit logs
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <button
                onClick={() =>
                  fetchAuditLogs()
                }
                className="mt-3 text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>

            </div>

          </div>
        )}

        {/* Statistics */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Activities"
            value={statistics.total}
            subtitle="All recorded actions"
            icon={Activity}
            iconClass="bg-emerald-100 text-emerald-600"
          />

          <StatCard
            title="Created"
            value={statistics.creates}
            subtitle="New records"
            icon={Plus}
            iconClass="bg-blue-100 text-blue-600"
          />

          <StatCard
            title="Updated"
            value={statistics.updates}
            subtitle="Modified records"
            icon={Pencil}
            iconClass="bg-violet-100 text-violet-600"
          />

          <StatCard
            title="Deleted"
            value={statistics.deletes}
            subtitle={`${statistics.users} active users`}
            icon={Trash2}
            iconClass="bg-red-100 text-red-600"
          />

        </div>

        {/* Main Card */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Toolbar */}

          <div className="border-b border-slate-200 p-4 sm:p-5">

            <div className="flex flex-col gap-3 lg:flex-row">

              {/* Search */}

              <div className="relative flex-1">

                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(
                      event.target.value
                    );
                    setCurrentPage(1);
                  }}
                  placeholder="Search by user, action, description, model..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

              </div>

              {/* Action Filter */}

              <div className="relative">

                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  value={actionFilter}
                  onChange={(event) => {
                    setActionFilter(
                      event.target.value
                    );
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 lg:w-44"
                >

                  <option value="all">
                    All actions
                  </option>

                  {actions
                    .filter(
                      (action) =>
                        action !== "all"
                    )
                    .map((action) => (
                      <option
                        key={action}
                        value={action}
                      >
                        {action}
                      </option>
                    ))}

                </select>

              </div>

              {/* Model Filter */}

              <div className="relative">

                <select
                  value={modelFilter}
                  onChange={(event) => {
                    setModelFilter(
                      event.target.value
                    );
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 lg:w-44"
                >

                  <option value="all">
                    All modules
                  </option>

                  {models
                    .filter(
                      (model) =>
                        model !== "all"
                    )
                    .map((model) => (
                      <option
                        key={model}
                        value={model}
                      >
                        {model}
                      </option>
                    ))}

                </select>

              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >

                  <X className="h-4 w-4" />

                  Clear

                </button>
              )}

            </div>

            {hasFilters && (
              <div className="mt-4 text-xs text-slate-500">

                Showing{" "}

                <span className="font-semibold text-slate-700">
                  {sortedLogs.length}
                </span>{" "}

                matching activities

              </div>
            )}

          </div>

          {/* Desktop Table */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50/70">

                  <th className="px-6 py-3.5 text-left">
                    <button
                      onClick={() =>
                        handleSort("user")
                      }
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Performed By
                      <SortIcon field="user" />
                    </button>
                  </th>

                  <th className="px-6 py-3.5 text-left">
                    <button
                      onClick={() =>
                        handleSort("action")
                      }
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Action
                      <SortIcon field="action" />
                    </button>
                  </th>

                  <th className="px-6 py-3.5 text-left">
                    <button
                      onClick={() =>
                        handleSort("model")
                      }
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Module
                      <SortIcon field="model" />
                    </button>
                  </th>

                  <th className="px-6 py-3.5 text-left">

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Description
                    </span>

                  </th>

                  <th className="px-6 py-3.5 text-left">

                    <button
                      onClick={() =>
                        handleSort("created_at")
                      }
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Date
                      <SortIcon field="created_at" />
                    </button>

                  </th>

                  <th className="w-16 px-6 py-3.5" />

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {paginatedLogs.map((log) => (
                  <AuditLogRow
                    key={log.id}
                    log={log}
                    onView={() =>
                      setSelectedLog(log)
                    }
                  />
                ))}

              </tbody>

            </table>

            {paginatedLogs.length === 0 && (
              <EmptyState
                hasFilters={hasFilters}
                onClear={clearFilters}
              />
            )}

          </div>

          {/* Mobile */}

          <div className="md:hidden">

            {paginatedLogs.length > 0 ? (
              <div className="divide-y divide-slate-100">

                {paginatedLogs.map((log) => (
                  <MobileAuditCard
                    key={log.id}
                    log={log}
                    onView={() =>
                      setSelectedLog(log)
                    }
                  />
                ))}

              </div>
            ) : (
              <EmptyState
                hasFilters={hasFilters}
                onClear={clearFilters}
              />
            )}

          </div>

          {/* Pagination */}

          {sortedLogs.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

              <p className="text-sm text-slate-500">

                Showing{" "}

                <span className="font-semibold text-slate-700">
                  {(currentPage - 1) *
                    itemsPerPage +
                    1}
                </span>{" "}

                to{" "}

                <span className="font-semibold text-slate-700">
                  {Math.min(
                    currentPage *
                      itemsPerPage,
                    sortedLogs.length
                  )}
                </span>{" "}

                of{" "}

                <span className="font-semibold text-slate-700">
                  {sortedLogs.length}
                </span>

              </p>

              <div className="flex items-center justify-between gap-2">

                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >

                  <ChevronLeft className="h-4 w-4" />

                  Previous

                </button>

                <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  {currentPage} /{" "}
                  {totalPages}
                </div>

                <button
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >

                  Next

                  <ChevronRight className="h-4 w-4" />

                </button>

              </div>

            </div>
          )}

        </div>

        {/* Recent Activity Timeline */}

        {logs.length > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5">

              <div className="flex items-center gap-2">

                <Clock className="h-5 w-5 text-emerald-600" />

                <h2 className="text-base font-bold text-slate-900">
                  Recent Activity
                </h2>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                The latest actions performed in the system.
              </p>

            </div>

            <div className="space-y-5">

              {logs
                .slice(0, 5)
                .map((log, index) => (
                  <TimelineItem
                    key={log.id}
                    log={log}
                    isLast={index === 4}
                  />
                ))}

            </div>

          </div>
        )}

      </div>

      {/* Details Modal */}

      {selectedLog && (
        <AuditLogDetailsModal
          log={selectedLog}
          onClose={() =>
            setSelectedLog(null)
          }
        />
      )}

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Statistics Card
|--------------------------------------------------------------------------
*/

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>

        </div>

        <div
          className={`rounded-xl p-3 ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>

      </div>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Desktop Row
|--------------------------------------------------------------------------
*/

const AuditLogRow = ({
  log,
  onView,
}) => {
  const config = getActionConfig(
    log.action
  );

  const ActionIcon = config.icon;

  return (
    <tr className="group transition hover:bg-slate-50/80">

      {/* User */}

      <td className="px-6 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
            {getInitial(
              log.user_display
            )}
          </div>

          <div className="min-w-0">
            <p className="max-w-[150px] truncate text-sm font-semibold text-slate-900">
            {log.user_full_name || "Unknown user"}
            </p>
            <p className="text-xs text-slate-500">
            {log.user_display || "No phone number"}
            </p>
            <p className="text-[11px] text-slate-400">
            User #{log.user}
            </p>
          </div>

        </div>

      </td>

      {/* Action */}

      <td className="px-6 py-4">

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.color}`}
        >

          <ActionIcon className="h-3.5 w-3.5" />

          {log.action}

        </span>

      </td>

      {/* Model */}

      <td className="px-6 py-4">

        <div>

          <p className="text-sm font-semibold text-slate-800">
            {log.model_name}
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            Record #{log.object_id}
          </p>

        </div>

      </td>

      {/* Description */}

      <td className="max-w-xs px-6 py-4">

        <p className="truncate text-sm text-slate-600">
          {log.description ||
            "No description"}
        </p>

      </td>

      {/* Date */}

      <td className="whitespace-nowrap px-6 py-4">

        <p className="text-sm font-medium text-slate-700">
          {formatDate(log.created_at)}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {new Date(
            log.created_at
          ).toLocaleTimeString(
            "en-KE",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </p>

      </td>

      {/* View */}

      <td className="px-6 py-4">

        <button
          onClick={onView}
          title="View audit record"
          className="rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-emerald-50 hover:text-emerald-600 group-hover:opacity-100"
        >

          <Eye className="h-4 w-4" />

        </button>

      </td>

    </tr>
  );
};

/*
|--------------------------------------------------------------------------
| Mobile Card
|--------------------------------------------------------------------------
*/

const MobileAuditCard = ({
  log,
  onView,
}) => {
  const config = getActionConfig(
    log.action
  );

  const ActionIcon = config.icon;

  return (
    <button
      type="button"
      onClick={onView}
      className="w-full text-left transition hover:bg-slate-50"
    >

      <div className="p-4">

        <div className="flex items-start justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconColor}`}
            >
              <ActionIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold text-slate-900">
                {log.description ||
                  "System activity"}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {log.model_name} · #
                {log.object_id}
              </p>

            </div>

          </div>

          <span
            className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-semibold ${config.color}`}
          >
            {log.action}
          </span>

        </div>

        <div className="mt-4 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
              {getInitial(
                log.user_display
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700">
                {log.user_full_name || "Unknown user"}
                </p>
                <p className="text-[11px] text-slate-500">
                {log.user_display || "No phone number"}
                </p>
                <p className="text-[10px] text-slate-400">
                Performed by
                </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-slate-600">
              {formatDate(
                log.created_at
              )}
            </p>
            <p className="text-[11px] text-slate-400">
              {new Date(
                log.created_at
              ).toLocaleTimeString(
                "en-KE",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>

          </div>

        </div>

      </div>

    </button>
  );
};

/*
|--------------------------------------------------------------------------
| Timeline Item
|--------------------------------------------------------------------------
*/

const TimelineItem = ({
  log,
  isLast,
}) => {
  const config = getActionConfig(
    log.action
  );

  const ActionIcon = config.icon;

  return (
    <div className="relative flex gap-4">

      {!isLast && (
        <div className="absolute left-[19px] top-10 h-full w-px bg-slate-200" />
      )}

      <div
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconColor}`}
      >
        <ActionIcon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1 pb-1">

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-700">

            <span className="font-semibold">
            {log.user_full_name || "Unknown user"}
            </span>{" "}

            <span className="text-slate-500">
              {config.label.toLowerCase()}
            </span>{" "}

            <span className="font-semibold text-slate-800">
              {log.model_name}
            </span>

          </p>

          <span className="shrink-0 text-xs text-slate-400">
            {formatDateTime(
              log.created_at
            )}
          </span>

        </div>

        <p className="mt-1 text-sm text-slate-500">
          {log.description ||
            "No description provided."}
        </p>

      </div>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

const EmptyState = ({
  hasFilters,
  onClear,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

      <div className="mb-4 rounded-2xl bg-slate-100 p-4">
        <Activity className="h-7 w-7 text-slate-400" />
      </div>

      <h3 className="text-base font-semibold text-slate-900">
        No audit records found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">

        {hasFilters
          ? "Try changing your search or filters."
          : "There are no recorded system activities yet."}

      </p>

      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Clear filters
        </button>
      )}

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Details Modal
|--------------------------------------------------------------------------
*/

const AuditLogDetailsModal = ({
  log,
  onClose,
}) => {
  const config = getActionConfig(
    log.action
  );

  const ActionIcon = config.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Audit Record
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Activity #{log.id}
            </h2>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Action */}

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 px-5 py-7 text-center sm:px-6">

          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${config.iconColor}`}
          >
            <ActionIcon className="h-7 w-7" />
          </div>

          <p className="mt-3 text-xl font-bold text-slate-900">
            {log.action}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {log.model_name} · Record #
            {log.object_id}
          </p>

        </div>

        {/* Details */}

        <div className="space-y-1 px-5 py-5 sm:px-6">

          <DetailRow
            label="Performed by"
            value={
              log.user_display ||
              "Unknown user"
            }
            icon={User}
          />

          <DetailRow
            label="User ID"
            value={`#${log.user}`}
            icon={User}
          />

          <DetailRow
            label="Action"
            value={log.action}
            icon={ActionIcon}
          />

          <DetailRow
            label="Module"
            value={log.model_name}
            icon={Activity}
          />

          <DetailRow
            label="Record ID"
            value={`#${log.object_id}`}
            icon={ShieldCheck}
          />

          <DetailRow
            label="Date & Time"
            value={formatDateTime(
              log.created_at
            )}
            icon={Calendar}
          />

          <div className="mt-4 rounded-xl bg-slate-50 p-4">

            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Description
            </p>

            <p className="text-sm leading-6 text-slate-700">
              {log.description ||
                "No description provided."}
            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Detail Row
|--------------------------------------------------------------------------
*/

const DetailRow = ({
  label,
  value,
  icon: Icon,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl px-3 py-3 hover:bg-slate-50">

      <div className="flex items-center gap-3">

        <Icon className="h-4 w-4 text-slate-400" />

        <span className="text-sm text-slate-500">
          {label}
        </span>

      </div>

      <span className="max-w-[60%] text-right text-sm font-semibold text-slate-800">
        {value}
      </span>

    </div>
  );
};
export default ViewAuditLogs;
