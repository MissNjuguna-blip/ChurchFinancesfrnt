import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  CalendarDays,
  Receipt,
  Wallet,
  TrendingUp,
  CreditCard,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import api from "../context/api/api";

// import api from "../api/api";
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(Number(amount || 0));
};

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

const getInitial = (value) => {
  if (!value) return "?";

  return String(value).charAt(0).toUpperCase();
};

/*
|--------------------------------------------------------------------------
| Status Badge
|--------------------------------------------------------------------------
*/

const StatusBadge = ({ status }) => {
  const normalizedStatus = String(status || "").toUpperCase();

  const styles = {
    PAID: {
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    },

    PENDING: {
      icon: Clock3,
      className: "bg-amber-50 text-amber-700 ring-amber-600/20",
    },

    CANCELLED: {
      icon: XCircle,
      className: "bg-red-50 text-red-700 ring-red-600/20",
    },

    FAILED: {
      icon: XCircle,
      className: "bg-red-50 text-red-700 ring-red-600/20",
    },
  };

  const config = styles[normalizedStatus] || {
    icon: Clock3,
    className: "bg-slate-100 text-slate-600 ring-slate-500/20",
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />

      {normalizedStatus || "UNKNOWN"}
    </span>
  );
};

/*
|--------------------------------------------------------------------------
| Payment Method Badge
|--------------------------------------------------------------------------
*/

const PaymentMethodBadge = ({ method }) => {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
      <CreditCard className="h-3.5 w-3.5" />

      {method || "—"}
    </span>
  );
};

/*
|--------------------------------------------------------------------------
| Main Component
|--------------------------------------------------------------------------
*/

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");

  const [sortField, setSortField] = useState("expense_date");
  const [sortDirection, setSortDirection] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedExpense, setSelectedExpense] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Fetch Expenses
  |--------------------------------------------------------------------------
  */

  const fetchExpenses = async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("expenses/expenses/");
      const data = response.data;
      if (Array.isArray(data)) {
        setExpenses(data);
      } else if (Array.isArray(data.results)) {
        setExpenses(data.results);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", err);

      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to load expenses. Please try again."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const paymentMethods = useMemo(() => {
    const methods = [
      ...new Set(
        expenses
          .map((expense) => expense.payment_method)
          .filter(Boolean)
      ),
    ];

    return ["ALL", ...methods];
  }, [expenses]);

  /*
  |--------------------------------------------------------------------------
  | Filtering
  |--------------------------------------------------------------------------
  */

  const filteredExpenses = useMemo(() => {
    const now = new Date();

    return expenses.filter((expense) => {
      const searchTerm = search.trim().toLowerCase();

      const description =
        expense.description?.toLowerCase() || "";

      const reference =
        expense.reference?.toLowerCase() || "";

      const paymentMethod =
        expense.payment_method?.toLowerCase() || "";

      const matchesSearch =
        !searchTerm ||
        description.includes(searchTerm) ||
        reference.includes(searchTerm) ||
        paymentMethod.includes(searchTerm) ||
        String(expense.id).includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" ||
        expense.status === statusFilter;

      const matchesPayment =
        paymentFilter === "ALL" ||
        expense.payment_method === paymentFilter;

      let matchesDate = true;

      if (
        dateFilter !== "ALL" &&
        expense.expense_date
      ) {
        const expenseDate = new Date(
          expense.expense_date
        );

        if (dateFilter === "TODAY") {
          matchesDate =
            expenseDate.toDateString() ===
            now.toDateString();
        }

        if (dateFilter === "WEEK") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(
            now.getDate() - 7
          );

          matchesDate =
            expenseDate >= sevenDaysAgo;
        }

        if (dateFilter === "MONTH") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(
            now.getDate() - 30
          );

          matchesDate =
            expenseDate >= thirtyDaysAgo;
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment &&
        matchesDate
      );
    });
  }, [
    expenses,
    search,
    statusFilter,
    paymentFilter,
    dateFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Sorting
  |--------------------------------------------------------------------------
  */

  const sortedExpenses = useMemo(() => {
    const result = [...filteredExpenses];

    result.sort((a, b) => {
      let valueA;
      let valueB;

      if (sortField === "amount") {
        valueA = Number(a.amount || 0);
        valueB = Number(b.amount || 0);
      } else if (sortField === "description") {
        valueA = (
          a.description || ""
        ).toLowerCase();

        valueB = (
          b.description || ""
        ).toLowerCase();
      } else {
        valueA = new Date(
          a.expense_date || 0
        ).getTime();

        valueB = new Date(
          b.expense_date || 0
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

    return result;
  }, [
    filteredExpenses,
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
      sortedExpenses.length / itemsPerPage
    )
  );

  const paginatedExpenses =
    sortedExpenses.slice(
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
    const total = expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount || 0),
      0
    );

    const paid = expenses
      .filter(
        (expense) => expense.status === "PAID"
      )
      .reduce(
        (sum, expense) =>
          sum + Number(expense.amount || 0),
        0
      );

    const thisMonth = expenses
      .filter((expense) => {
        if (!expense.expense_date) {
          return false;
        }

        const date = new Date(
          expense.expense_date
        );

        const now = new Date();

        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() ===
            now.getFullYear()
        );
      })
      .reduce(
        (sum, expense) =>
          sum + Number(expense.amount || 0),
        0
      );

    const average =
      expenses.length > 0
        ? total / expenses.length
        : 0;

    return {
      total,
      paid,
      thisMonth,
      average,
      count: expenses.length,
    };
  }, [expenses]);

  /*
  |--------------------------------------------------------------------------
  | Sort
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
    setStatusFilter("ALL");
    setPaymentFilter("ALL");
    setDateFilter("ALL");
    setCurrentPage(1);
  };

  const hasFilters =
    search ||
    statusFilter !== "ALL" ||
    paymentFilter !== "ALL" ||
    dateFilter !== "ALL";

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
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">

          <div className="h-10 w-64 rounded-xl bg-slate-200" />

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

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <Receipt className="h-3.5 w-3.5" />
              Financial Records
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Expenses
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              View, search and monitor recorded
              expenses.
            </p>

          </div>

          <button
            type="button"
            onClick={() => fetchExpenses(true)}
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

            <div className="flex-1">

              <p className="font-semibold text-red-800">
                Unable to load expenses
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <button
                onClick={() =>
                  fetchExpenses()
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
            title="Total Expenses"
            value={formatCurrency(
              statistics.total
            )}
            subtitle={`${statistics.count} recorded transactions`}
            icon={Wallet}
            color="emerald"
          />

          <StatCard
            title="Paid Expenses"
            value={formatCurrency(
              statistics.paid
            )}
            subtitle="Successfully paid"
            icon={CheckCircle2}
            color="blue"
          />

          <StatCard
            title="This Month"
            value={formatCurrency(
              statistics.thisMonth
            )}
            subtitle="Current month spending"
            icon={TrendingUp}
            color="violet"
          />

          <StatCard
            title="Average Expense"
            value={formatCurrency(
              statistics.average
            )}
            subtitle="Average per transaction"
            icon={Receipt}
            color="orange"
          />

        </div>

        {/* Main */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Toolbar */}

          <div className="border-b border-slate-200 p-4 sm:p-5">

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto]">

              {/* Search */}

              <div className="relative">

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
                  placeholder="Search description, reference..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

              </div>

              {/* Status */}

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(
                    event.target.value
                  );
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="ALL">
                  All statuses
                </option>

                <option value="PAID">
                  Paid
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>

                <option value="FAILED">
                  Failed
                </option>
              </select>

              {/* Payment */}

              <select
                value={paymentFilter}
                onChange={(event) => {
                  setPaymentFilter(
                    event.target.value
                  );
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="ALL">
                  All payment methods
                </option>

                {paymentMethods
                  .filter(
                    (method) => method !== "ALL"
                  )
                  .map((method) => (
                    <option
                      key={method}
                      value={method}
                    >
                      {method}
                    </option>
                  ))}
              </select>

              {/* Date */}

              <select
                value={dateFilter}
                onChange={(event) => {
                  setDateFilter(
                    event.target.value
                  );
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="ALL">
                  All dates
                </option>

                <option value="TODAY">
                  Today
                </option>

                <option value="WEEK">
                  Last 7 days
                </option>

                <option value="MONTH">
                  Last 30 days
                </option>
              </select>

            </div>

            {hasFilters && (
              <div className="mt-4 flex items-center justify-between">

                <p className="text-xs text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {sortedExpenses.length}
                  </span>{" "}
                  matching expense
                  {sortedExpenses.length === 1
                    ? ""
                    : "s"}
                </p>

                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear filters
                </button>

              </div>
            )}

          </div>

          {/* Desktop */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50/70">

                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() =>
                        handleSort(
                          "description"
                        )
                      }
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      Expense
                      <SortIcon field="description" />
                    </button>
                  </th>

                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Payment
                    </span>
                  </th>

                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() =>
                        handleSort(
                          "expense_date"
                        )
                      }
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      Date
                      <SortIcon field="expense_date" />
                    </button>
                  </th>

                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </span>
                  </th>

                  <th className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        handleSort("amount")
                      }
                      className="ml-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      Amount
                      <SortIcon field="amount" />
                    </button>
                  </th>

                  <th className="w-16 px-6 py-4" />

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {paginatedExpenses.map(
                  (expense) => (
                    <ExpenseRow
                      key={expense.id}
                      expense={expense}
                      onView={() =>
                        setSelectedExpense(
                          expense
                        )
                      }
                    />
                  )
                )}

              </tbody>

            </table>

            {paginatedExpenses.length === 0 && (
              <EmptyState
                hasFilters={hasFilters}
                onClear={clearFilters}
              />
            )}

          </div>

          {/* Mobile */}

          <div className="md:hidden">

            {paginatedExpenses.length > 0 ? (
              <div className="divide-y divide-slate-100">

                {paginatedExpenses.map(
                  (expense) => (
                    <MobileExpenseCard
                      key={expense.id}
                      expense={expense}
                      onView={() =>
                        setSelectedExpense(
                          expense
                        )
                      }
                    />
                  )
                )}

              </div>
            ) : (
              <EmptyState
                hasFilters={hasFilters}
                onClear={clearFilters}
              />
            )}

          </div>

          {/* Pagination */}

          {sortedExpenses.length > 0 && (
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
                    sortedExpenses.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {sortedExpenses.length}
                </span>
              </p>

              <div className="flex items-center justify-end gap-2">

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

                <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  {currentPage} /{" "}
                  {totalPages}
                </span>

                <button
                  disabled={
                    currentPage ===
                    totalPages
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
      </div>

      {/* Details Modal */}

      {selectedExpense && (
        <ExpenseDetailsModal
          expense={selectedExpense}
          onClose={() =>
            setSelectedExpense(null)
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
  color,
}) => {
  const colors = {
    emerald:
      "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    violet:
      "bg-violet-50 text-violet-600",
    orange:
      "bg-orange-50 text-orange-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div className="min-w-0">

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>

        </div>

        <div
          className={`rounded-xl p-3 ${colors[color]}`}
        >
          <Icon className="h-5 w-5" />
        </div>

      </div>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Desktop Expense Row
|--------------------------------------------------------------------------
*/

const ExpenseRow = ({
  expense,
  onView,
}) => {
  return (
    <tr className="group transition hover:bg-slate-50/80">

      {/* Expense */}

      <td className="px-6 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Receipt className="h-4 w-4" />
          </div>

          <div className="min-w-0">

            <p className="max-w-xs truncate text-sm font-semibold text-slate-900">
              {expense.description}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Expense #{expense.id}
            </p>

          </div>

        </div>

      </td>

      {/* Payment */}

      <td className="px-6 py-4">
        <PaymentMethodBadge
          method={
            expense.payment_method
          }
        />

        {expense.reference && (
          <p className="mt-1 max-w-[150px] truncate text-xs text-slate-400">
            {expense.reference}
          </p>
        )}
      </td>

      {/* Date */}

      <td className="whitespace-nowrap px-6 py-4">

        <div className="flex items-center gap-2 text-sm text-slate-600">

          <CalendarDays className="h-4 w-4 text-slate-400" />

          {formatDate(
            expense.expense_date
          )}

        </div>

      </td>

      {/* Status */}

      <td className="px-6 py-4">
        <StatusBadge
          status={expense.status}
        />
      </td>

      {/* Amount */}

      <td className="whitespace-nowrap px-6 py-4 text-right">

        <span className="text-sm font-bold text-slate-900">
          {formatCurrency(
            expense.amount
          )}
        </span>

      </td>

      {/* Action */}

      <td className="px-6 py-4">

        <button
          type="button"
          onClick={onView}
          title="View expense"
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

const MobileExpenseCard = ({
  expense,
  onView,
}) => {
  return (
    <button
      type="button"
      onClick={onView}
      className="block w-full text-left transition hover:bg-slate-50"
    >
      <div className="p-4">

        <div className="flex items-start justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Receipt className="h-4 w-4" />
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold text-slate-900">
                {expense.description}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Expense #{expense.id}
              </p>

            </div>

          </div>

          <p className="shrink-0 text-sm font-bold text-slate-900">
            {formatCurrency(
              expense.amount
            )}
          </p>

        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">

          <StatusBadge
            status={expense.status}
          />

          <PaymentMethodBadge
            method={
              expense.payment_method
            }
          />

        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">

          <CalendarDays className="h-3.5 w-3.5" />

          {formatDate(
            expense.expense_date
          )}

        </div>

        {expense.reference && (
          <p className="mt-2 truncate text-xs text-slate-400">
            Reference: {expense.reference}
          </p>
        )}

      </div>
    </button>
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
        <Receipt className="h-7 w-7 text-slate-400" />
      </div>

      <h3 className="text-base font-semibold text-slate-900">
        No expenses found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        {hasFilters
          ? "Try changing your search or filters."
          : "There are no recorded expenses yet."}
      </p>

      {hasFilters && (
        <button
          type="button"
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
| Expense Details Modal
|--------------------------------------------------------------------------
*/

const ExpenseDetailsModal = ({
  expense,
  onClose,
}) => {
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

            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Expense details
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Expense #{expense.id}
            </h2>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Amount */}

        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white px-5 py-8 text-center sm:px-6">

          <p className="text-sm font-medium text-emerald-700">
            Expense amount
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {formatCurrency(
              expense.amount
            )}
          </p>

          <div className="mt-3">
            <StatusBadge
              status={expense.status}
            />
          </div>

        </div>

        {/* Details */}

        <div className="space-y-1 px-5 py-5 sm:px-6">

          <DetailRow
            label="Description"
            value={expense.description}
          />

          <DetailRow
            label="Expense date"
            value={formatDate(
              expense.expense_date
            )}
          />

          <DetailRow
            label="Payment method"
            value={
              expense.payment_method
            }
          />

          <DetailRow
            label="Reference"
            value={
              expense.reference || "—"
            }
          />

          <DetailRow
            label="Recorded by"
            value={
              expense.recorded_by
                ? `User #${expense.recorded_by}`
                : "—"
            }
          />

          <DetailRow
            label="Created"
            value={formatDateTime(
              expense.created_at
            )}
          />

          <DetailRow
            label="Last updated"
            value={formatDateTime(
              expense.updated_at
            )}
          />

        </div>

        {/* Footer */}

        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">

          <button
            type="button"
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
}) => {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl px-3 py-3 hover:bg-slate-50">

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="max-w-[65%] break-words text-right text-sm font-semibold text-slate-800">
        {value}
      </span>

    </div>
  );
};

export default ViewExpenses;
