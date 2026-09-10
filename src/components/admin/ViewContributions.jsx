import React, { useEffect, useMemo, useState } from "react";
import {
  WalletCards,
  Banknote,
  Users,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  CalendarDays,
  User,
  CreditCard,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import api from "../context/api/api";

// import api from "../context/api/api";

const ViewContributions = () => {
  const [contributions, setContributions] = useState([]);
  const [contributionTypes, setContributionTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const paymentMethods = [
    {
      value: "CASH",
      label: "Cash",
    },
    {
      value: "MPESA",
      label: "M-Pesa",
    },
    {
      value: "BANK",
      label: "Bank",
    },
    {
      value: "CARD",
      label: "Card",
    },
    {
      value: "OTHER",
      label: "Other",
    },
  ];

  useEffect(() => {
    loadContributions();
  }, []);

  const loadContributions = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        contributionsResponse,
        typesResponse,
      ] = await Promise.all([
        api.get("finances/contributions/"),
        api.get("finances/contribution-types/"),
      ]);

      const contributionsData =
        contributionsResponse.data?.results ||
        contributionsResponse.data?.contributions ||
        contributionsResponse.data ||
        [];

      const typesData =
        typesResponse.data?.results ||
        typesResponse.data?.contribution_types ||
        typesResponse.data ||
        [];

      setContributions(
        Array.isArray(contributionsData)
          ? contributionsData
          : []
      );

      setContributionTypes(
        Array.isArray(typesData)
          ? typesData
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load contributions:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to load contributions."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-KE",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredContributions = useMemo(() => {
    return contributions.filter(
      (contribution) => {
        const memberName =
          contribution.member_name || "";

        const contributionType =
          contribution.contribution_type_name ||
          "";

        const searchValue =
          search.toLowerCase().trim();

        const matchesSearch =
          !searchValue ||
          memberName
            .toLowerCase()
            .includes(searchValue) ||
          contributionType
            .toLowerCase()
            .includes(searchValue) ||
          String(contribution.id).includes(
            searchValue
          );

        const matchesType =
          !typeFilter ||
          Number(
            contribution.contribution_type
          ) === Number(typeFilter);

        const matchesPayment =
          !paymentFilter ||
          contribution.payment_method ===
            paymentFilter;

        return (
          matchesSearch &&
          matchesType &&
          matchesPayment
        );
      }
    );
  }, [
    contributions,
    search,
    typeFilter,
    paymentFilter,
  ]);

  const totalAmount = useMemo(() => {
    return filteredContributions.reduce(
      (total, contribution) =>
        total +
        Number(contribution.amount || 0),
      0
    );
  }, [filteredContributions]);

  const uniqueMembers = useMemo(() => {
    return new Set(
      contributions.map(
        (contribution) =>
          contribution.member
      )
    ).size;
  }, [contributions]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contribution?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      await api.delete(
        `finances/contributions/${id}/`
      );

      setContributions((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

      setSuccess(
        "Contribution deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete contribution error:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to delete contribution."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setPaymentFilter("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Finance
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              View Contributions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View, search and manage recorded contributions.
            </p>
          </div>

          <button
            type="button"
            onClick={loadContributions}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>{success}</span>
          </div>
        )}

        {/* SUMMARY */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* TOTAL */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Contributions
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  KES{" "}
                  {formatAmount(totalAmount)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Banknote size={21} />
              </div>
            </div>
          </div>

          {/* COUNT */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Contributions
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {filteredContributions.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <WalletCards size={21} />
              </div>
            </div>
          </div>

          {/* MEMBERS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Members Contributing
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {uniqueMembers}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Users size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Filter
              size={18}
              className="text-slate-500"
            />

            <h2 className="text-sm font-semibold text-slate-800">
              Filter Contributions
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">

            {/* SEARCH */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search member or type..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* TYPE */}
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            >
              <option value="">
                All contribution types
              </option>

              {contributionTypes.map(
                (type) => (
                  <option
                    key={type.id}
                    value={type.id}
                  >
                    {type.name}
                  </option>
                )
              )}
            </select>

            {/* PAYMENT */}
            <select
              value={paymentFilter}
              onChange={(e) =>
                setPaymentFilter(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            >
              <option value="">
                All payment methods
              </option>

              {paymentMethods.map(
                (method) => (
                  <option
                    key={method.value}
                    value={method.value}
                  >
                    {method.label}
                  </option>
                )
              )}
            </select>

            {/* CLEAR */}
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <X size={17} />
              Clear filters
            </button>
          </div>
        </div>

        {/* CONTRIBUTIONS */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl bg-white"
                />
              )
            )}
          </div>
        ) : filteredContributions.length ===
          0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <WalletCards size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No contributions found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredContributions.map(
              (contribution) => (
                <ContributionCard
                  key={contribution.id}
                  contribution={contribution}
                  formatAmount={formatAmount}
                  formatDate={formatDate}
                  onDelete={handleDelete}
                  deleting={
                    deletingId ===
                    contribution.id
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ContributionCard = ({
  contribution,
  formatAmount,
  formatDate,
  onDelete,
  deleting,
}) => {
  const paymentLabels = {
    CASH: "Cash",
    MPESA: "M-Pesa",
    BANK: "Bank",
    CARD: "Card",
    OTHER: "Other",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      {/* ACCENT */}
      <div className="absolute left-0 top-0 h-1 w-full bg-emerald-500" />

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <WalletCards size={21} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              {contribution.contribution_type_name ||
                "Contribution"}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              Contribution #{contribution.id}
            </p>
          </div>
        </div>

        {/* DELETE */}
        <button
          type="button"
          onClick={() =>
            onDelete(contribution.id)
          }
          disabled={deleting}
          className="rounded-lg p-2 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 disabled:opacity-50"
          title="Delete contribution"
        >
          {deleting ? (
            <RefreshCw
              size={16}
              className="animate-spin"
            />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>

      {/* AMOUNT */}
      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Amount
        </p>

        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          KES{" "}
          {formatAmount(
            contribution.amount
          )}
        </p>
      </div>

      {/* MEMBER */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3">
          <User
            size={16}
            className="text-slate-400"
          />

          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Member
            </p>

            <p className="text-sm font-medium text-slate-700">
              {contribution.member_name ||
                "Unknown member"}
            </p>
          </div>
        </div>
      </div>

      {/* DATE */}
      <div className="mt-4 flex items-center gap-3">
        <CalendarDays
          size={16}
          className="text-slate-400"
        />

        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            Contribution date
          </p>

          <p className="text-sm font-medium text-slate-700">
            {formatDate(
              contribution.contribution_date
            )}
          </p>
        </div>
      </div>

      {/* PAYMENT */}
      <div className="mt-4 flex items-center gap-3">
        <CreditCard
          size={16}
          className="text-slate-400"
        />

        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            Payment method
          </p>

          <p className="text-sm font-medium text-slate-700">
            {paymentLabels[
              contribution.payment_method
            ] ||
              contribution.payment_method}
          </p>
        </div>
      </div>

      {/* RECORDED BY */}
      <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <User size={14} />
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-300">
            Recorded by
          </p>

          <p className="text-xs text-slate-400">
            {contribution.recorded_by_name ||
              "Unknown"}
          </p>
        </div>
      </div>

      {/* CREATED */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          {paymentLabels[
            contribution.payment_method
          ] ||
            contribution.payment_method}
        </span>

        <span className="text-xs text-slate-300">
          Created{" "}
          {formatDate(
            contribution.created_at?.split(
              "T"
            )[0]
          )}
        </span>
      </div>
    </div>
  );
};

export default ViewContributions;
