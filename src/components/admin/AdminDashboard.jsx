import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";
import api from "../context/api/api";
import { NavLink } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatCurrency = (amount) => {
  const value = Number(amount || 0);

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(value);
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

const formatMonth = (month) => {
  if (!month) return "";

  const date = new Date(`${month}-01T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return month;
  }

  return new Intl.DateTimeFormat("en-KE", {
    month: "short",
    year: "numeric",
  }).format(date);
};

const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";

  return `${first}${last}`.toUpperCase() || "?";
};

/*
|--------------------------------------------------------------------------
| Main Component
|--------------------------------------------------------------------------
*/

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch Dashboard
  |--------------------------------------------------------------------------
  */

  const fetchDashboard = async ({ refresh = false } = {}) => {
    try {
      setError("");

      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get(
        "core/admin-dashboard"
      );

      setDashboard(response.data);
    } catch (err) {
      console.error(
        "Admin dashboard fetch error:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "You are not authenticated. Please sign in again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to access the admin dashboard."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to load the admin dashboard."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Derived Data
  |--------------------------------------------------------------------------
  */

  const summary = dashboard?.summary || {};

  const recentContributions =
    dashboard?.recent_contributions || [];

  const recentExpenses =
    dashboard?.recent_expenses || [];

  const recentMembers =
    dashboard?.recent_members || [];

  const monthlyContributions =
    dashboard?.monthly_contributions || [];

  const monthlyExpenses =
    dashboard?.monthly_expenses || [];

  /*
  |--------------------------------------------------------------------------
  | Chart Data
  |--------------------------------------------------------------------------
  */

  const chartData = useMemo(() => {
    const months = new Set();

    monthlyContributions.forEach((item) => {
      months.add(item.month);
    });

    monthlyExpenses.forEach((item) => {
      months.add(item.month);
    });

    return [...months]
      .sort()
      .map((month) => {
        const contribution =
          monthlyContributions.find(
            (item) => item.month === month
          );

        const expense =
          monthlyExpenses.find(
            (item) => item.month === month
          );

        return {
          month,
          contribution: Number(
            contribution?.total || 0
          ),
          expense: Number(
            expense?.total || 0
          ),
        };
      });
  }, [
    monthlyContributions,
    monthlyExpenses,
  ]);

  const maxChartValue = useMemo(() => {
    const values = chartData.flatMap(
      (item) => [
        item.contribution,
        item.expense,
      ]
    );

    return Math.max(...values, 1);
  }, [chartData]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <DashboardLoading />
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

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">

              <div className="rounded-xl bg-emerald-100 p-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>

              <span className="text-sm font-semibold text-emerald-600">
                Administration
              </span>

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Overview of your members, finances, and
              recent system activity.
            </p>
          </div>

          <div className="flex items-center gap-3">

            {dashboard?.user && (
              <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm sm:flex">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {getInitials(
                    dashboard.user.first_name,
                    dashboard.user.last_name
                  )}
                </div>

                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-slate-800">
                    {dashboard.user.first_name}{" "}
                    {dashboard.user.last_name}
                  </p>

                  <p className="text-xs text-slate-400">
                    Administrator
                  </p>
                </div>

              </div>
            )}

            <button
              type="button"
              onClick={() =>
                fetchDashboard({
                  refresh: true,
                })
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}

              {refreshing
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>

        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

            <div className="flex-1">

              <p className="font-semibold text-red-800">
                Unable to load dashboard
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  fetchDashboard()
                }
                className="mt-3 text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>

            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 text-red-400 hover:bg-red-100 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>

          </div>
        )}

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

    <DashboardStatCard
        title="Total Members"
        value={
        summary.total_members || 0
        }
        subtitle="Registered members"
        icon={Users}
        iconClass="bg-emerald-100 text-emerald-600"
        path="/admin-dashboard/register-contributions"
    />

    <DashboardStatCard
        title="Contributions"
        value={formatCurrency(
        summary.total_contributions
        )}
        subtitle={`${summary.contribution_count || 0} recorded contributions`}
        icon={ArrowUpRight}
        iconClass="bg-blue-100 text-blue-600"
        path="/admin-dashboard/view-contributions"
    />

    <DashboardStatCard
        title="Expenses"
        value={formatCurrency(
        summary.total_expenses
        )}
        subtitle={`${summary.expense_count || 0} paid expenses`}
        icon={ArrowDownRight}
        iconClass="bg-red-100 text-red-600"
        path="/admin-dashboard/view-expenses"
    />

    <DashboardStatCard
        title="Current Balance"
        value={formatCurrency(
        summary.current_balance
        )}
        subtitle="Contributions minus expenses"
        icon={Wallet}
        iconClass="bg-violet-100 text-violet-600"
        path="/admin-dashboard/view-contributions"
    />

    </div>


        {/* =====================================================
            FINANCIAL OVERVIEW + QUICK STATS
        ====================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Financial Chart */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <TrendingUp className="h-5 w-5 text-emerald-600" />

                  <h2 className="text-base font-bold text-slate-900">
                    Financial Overview
                  </h2>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Monthly contributions compared with paid expenses.
                </p>

              </div>

              <div className="flex items-center gap-4 text-xs font-medium">

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Contributions
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  Expenses
                </div>

              </div>

            </div>

            {chartData.length > 0 ? (
            <div className="w-full">
                <div className="relative h-[260px] w-full sm:h-[280px]">
                {/* Chart bars */}
                <div className="absolute inset-x-0 bottom-8 top-0 flex items-end justify-between gap-1 px-1 sm:gap-3 sm:px-2">
                    {chartData.map((item) => {
                    const contributionHeight =
                        item.contribution > 0
                        ? Math.max(
                            (item.contribution / maxChartValue) * 210,
                            8
                            )
                        : 0;

                    const expenseHeight =
                        item.expense > 0
                        ? Math.max(
                            (item.expense / maxChartValue) * 210,
                            8
                            )
                        : 0;

                    return (
                        <div
                        key={item.month}
                        className="flex h-full min-w-0 flex-1 items-end justify-center"
                        >
                        <div className="flex h-full w-full items-end justify-center gap-0.5 sm:gap-1">

                            {/* Contribution */}
                            <div
                            title={`Contributions: ${formatCurrency(
                                item.contribution
                            )}`}
                            className="w-[calc(50%-2px)] max-w-7 rounded-t-md bg-emerald-500 transition-all duration-300 hover:bg-emerald-600 sm:w-7"
                            style={{
                                height: `${contributionHeight}px`,
                            }}
                            />

                            {/* Expense */}
                            <div
                            title={`Expenses: ${formatCurrency(
                                item.expense
                            )}`}
                            className="w-[calc(50%-2px)] max-w-7 rounded-t-md bg-red-400 transition-all duration-300 hover:bg-red-500 sm:w-7"
                            style={{
                                height: `${expenseHeight}px`,
                            }}
                            />

                        </div>
                        </div>
                    );
                    })}

                </div>

                {/* Month labels */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 px-1 sm:gap-3 sm:px-2">

                    {chartData.map((item) => (
                    <div
                        key={item.month}
                        className="min-w-0 flex-1 text-center"
                    >
                        <span className="block truncate text-[9px] font-medium text-slate-400 sm:text-[11px]">
                        {formatMonth(item.month)}
                        </span>
                    </div>
                    ))}

                </div>

                </div>
            </div>
            ) : (
            <EmptyChartState />
            )}
          </div>

          {/* Financial Statistics */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5">

              <div className="flex items-center gap-2">

                <Banknote className="h-5 w-5 text-emerald-600" />

                <h2 className="text-base font-bold text-slate-900">
                  Financial Statistics
                </h2>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Average transaction values.
              </p>

            </div>

            <div className="space-y-4">

              <FinancialStat
                label="Average Contribution"
                value={formatCurrency(
                  summary.average_contribution
                )}
                icon={ArrowUpRight}
                iconClass="bg-emerald-50 text-emerald-600"
              />

              <FinancialStat
                label="Average Expense"
                value={formatCurrency(
                  summary.average_expense
                )}
                icon={ArrowDownRight}
                iconClass="bg-red-50 text-red-600"
              />

              <FinancialStat
                label="Contribution Count"
                value={
                  summary.contribution_count || 0
                }
                icon={Activity}
                iconClass="bg-blue-50 text-blue-600"
              />

              <FinancialStat
                label="Expense Count"
                value={
                  summary.expense_count || 0
                }
                icon={TrendingDown}
                iconClass="bg-orange-50 text-orange-600"
              />

            </div>

            <div className="mt-5 rounded-xl bg-emerald-50 p-4">

              <div className="flex items-center gap-2">

                <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                <span className="text-xs font-semibold text-emerald-700">
                  Current Balance
                </span>

              </div>

              <p className="mt-2 text-xl font-bold text-emerald-800">
                {formatCurrency(
                  summary.current_balance
                )}
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            RECENT CONTRIBUTIONS
        ====================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

          <RecentContributions
            contributions={recentContributions}
          />

          <RecentExpenses
            expenses={recentExpenses}
          />

        </div>

        {/* =====================================================
            RECENT MEMBERS
        ====================================================== */}

        <RecentMembers
          members={recentMembers}
        />

      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Dashboard Stat Card
|--------------------------------------------------------------------------
*/

const DashboardStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  path,
}) => {
  return (
    <NavLink
      to={path}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>

        </div>

        <div
          className={`shrink-0 rounded-xl p-3 transition-transform group-hover:scale-105 ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </NavLink>
  );
};


/*
|--------------------------------------------------------------------------
| Financial Stat
|--------------------------------------------------------------------------
*/

const FinancialStat = ({
  label,
  value,
  icon: Icon,
  iconClass,
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">

      <div className="flex items-center gap-3">

        <div
          className={`rounded-lg p-2 ${iconClass}`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-sm text-slate-500">
          {label}
        </span>

      </div>

      <span className="text-sm font-bold text-slate-800">
        {typeof value === "number"
          ? value.toLocaleString()
          : value}
      </span>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Recent Contributions
|--------------------------------------------------------------------------
*/

const RecentContributions = ({
  contributions,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">

        <div>

          <div className="flex items-center gap-2">

            <ArrowUpRight className="h-5 w-5 text-emerald-600" />

            <h2 className="text-base font-bold text-slate-900">
              Recent Contributions
            </h2>

          </div>

          <p className="mt-1 text-xs text-slate-500">
            Latest recorded contributions
          </p>

        </div>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {contributions.length}
        </span>

      </div>

      {contributions.length > 0 ? (
        <div className="divide-y divide-slate-100">

          {contributions.map(
            (contribution) => (
              <div
                key={contribution.id}
                className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6"
              >

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <DollarSign className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-slate-800">
                      {contribution.member_name ||
                        "Unknown member"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {contribution.contribution_type ||
                        "Contribution"}{" "}
                      ·{" "}
                      {contribution.payment_method ||
                        "Payment"}
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {formatDate(
                        contribution.contribution_date
                      )}
                    </p>

                  </div>

                </div>

                <div className="shrink-0 text-right">

                  <p className="text-sm font-bold text-emerald-600">
                    +{formatCurrency(
                      contribution.amount
                    )}
                  </p>

                  {contribution.recorded_by && (
                    <p className="mt-1 text-[11px] text-slate-400">
                      By{" "}
                      {contribution.recorded_by.name ||
                        "Unknown"}
                    </p>
                  )}

                </div>

              </div>
            )
          )}

        </div>
      ) : (
        <SmallEmptyState
          icon={Banknote}
          message="No contributions recorded yet."
        />
      )}

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Recent Expenses
|--------------------------------------------------------------------------
*/

const RecentExpenses = ({
  expenses,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">

        <div>

          <div className="flex items-center gap-2">

            <ArrowDownRight className="h-5 w-5 text-red-500" />

            <h2 className="text-base font-bold text-slate-900">
              Recent Expenses
            </h2>

          </div>

          <p className="mt-1 text-xs text-slate-500">
            Latest recorded expenses
          </p>

        </div>

        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
          {expenses.length}
        </span>

      </div>

      {expenses.length > 0 ? (
        <div className="divide-y divide-slate-100">

          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6"
            >

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <TrendingDown className="h-5 w-5" />
                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-slate-800">
                    {expense.description ||
                      "Expense"}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {expense.payment_method ||
                      "Payment method"}
                    {expense.reference
                      ? ` · ${expense.reference}`
                      : ""}
                  </p>

                  <div className="mt-1 flex items-center gap-2">

                    <span className="text-[11px] text-slate-400">
                      {formatDate(
                        expense.expense_date
                      )}
                    </span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        expense.status === "PAID"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {expense.status ||
                        "Unknown"}
                    </span>

                  </div>

                </div>

              </div>

              <div className="shrink-0 text-right">

                <p className="text-sm font-bold text-red-500">
                  -{formatCurrency(
                    expense.amount
                  )}
                </p>

                {expense.recorded_by && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    By{" "}
                    {expense.recorded_by.name ||
                      "Unknown"}
                  </p>
                )}

              </div>

            </div>
          ))}

        </div>
      ) : (
        <SmallEmptyState
          icon={Wallet}
          message="No expenses recorded yet."
        />
      )}

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Recent Members
|--------------------------------------------------------------------------
*/

const RecentMembers = ({
  members,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

        <div>

          <div className="flex items-center gap-2">

            <UserPlus className="h-5 w-5 text-emerald-600" />

            <h2 className="text-base font-bold text-slate-900">
              Recent Members
            </h2>

          </div>

          <p className="mt-1 text-xs text-slate-500">
            Most recently registered members
          </p>

        </div>

        <span className="text-xs font-medium text-slate-400">
          {members.length} recent members
        </span>

      </div>

      {members.length > 0 ? (
        <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3 xl:grid-cols-5">

          {members.slice(0, 10).map(
            (member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-4 transition hover:bg-slate-50"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {getInitials(
                    member.first_name,
                    member.last_name
                  )}
                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-slate-800">
                    {member.full_name ||
                      `${member.first_name || ""} ${
                        member.last_name || ""
                      }`.trim() ||
                      "Unknown member"}
                  </p>

                  <div className="mt-1 flex items-center gap-1">

                    <Calendar className="h-3 w-3 text-slate-400" />

                    <span className="text-[11px] text-slate-400">
                      Joined{" "}
                      {formatDate(
                        member.created_at
                      )}
                    </span>

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      ) : (
        <SmallEmptyState
          icon={Users}
          message="No members have been registered yet."
        />
      )}

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Empty States
|--------------------------------------------------------------------------
*/

const SmallEmptyState = ({
  icon: Icon,
  message,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

      <div className="mb-3 rounded-xl bg-slate-100 p-3">
        <Icon className="h-5 w-5 text-slate-400" />
      </div>

      <p className="text-sm text-slate-500">
        {message}
      </p>

    </div>
  );
};

const EmptyChartState = () => {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center text-center">

      <div className="mb-3 rounded-xl bg-slate-100 p-3">
        <TrendingUp className="h-5 w-5 text-slate-400" />
      </div>

      <p className="text-sm font-medium text-slate-600">
        No financial activity yet
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Monthly data will appear here once
        contributions or expenses are recorded.
      </p>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Loading State
|--------------------------------------------------------------------------
*/

const DashboardLoading = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">

        <div className="animate-pulse space-y-6">

          {/* Header */}

          <div className="flex items-center justify-between">

            <div className="space-y-3">

              <div className="h-4 w-32 rounded bg-slate-200" />

              <div className="h-8 w-56 rounded-lg bg-slate-200" />

              <div className="h-4 w-80 rounded bg-slate-200" />

            </div>

            <div className="hidden h-10 w-28 rounded-xl bg-slate-200 sm:block" />

          </div>

          {/* Stats */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl bg-white"
                />
              )
            )}

          </div>

          {/* Chart */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            <div className="h-[380px] rounded-2xl bg-white xl:col-span-2" />

            <div className="h-[380px] rounded-2xl bg-white" />

          </div>

          {/* Recent */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

            <div className="h-[400px] rounded-2xl bg-white" />

            <div className="h-[400px] rounded-2xl bg-white" />

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
