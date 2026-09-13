import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import api from "../context/api/api";
import { useNavigate } from "react-router-dom";
// import api from "../context/api/api";

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

const getInitials = (firstName, lastName) => {
  const first = firstName?.trim()?.charAt(0) || "";
  const last = lastName?.trim()?.charAt(0) || "";

  return `${first}${last}`.toUpperCase() || "?";
};

const getFullName = (member) => {
  const name = `${member.first_name || ""} ${
    member.last_name || ""
  }`.trim();

  return name || "Unnamed Member";
};

/*
|--------------------------------------------------------------------------
| Main Component
|--------------------------------------------------------------------------
*/

const ViewMembers = () => {
    const navigate = useNavigate();

  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch Members
  |--------------------------------------------------------------------------
  */

  const fetchMembers = async ({ refresh = false } = {}) => {
    try {
      setError("");

      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get(
        "members/members/"
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

      setMembers(data);
    } catch (err) {
      console.error(
        "Members fetch error:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "You are not authenticated. Please sign in again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to view members."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to load members."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial Fetch
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchMembers();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Filter Members
  |--------------------------------------------------------------------------
  */

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return members;
    }

    return members.filter((member) => {
      const firstName =
        member.first_name?.toLowerCase() || "";

      const lastName =
        member.last_name?.toLowerCase() || "";

      const fullName =
        `${firstName} ${lastName}`;

      return (
        firstName.includes(query) ||
        lastName.includes(query) ||
        fullName.includes(query)
      );
    });
  }, [members, search]);

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return <MembersLoading />;
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
              Members
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage registered members.
            </p>

          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            {/* Back to Dashboard */}

            <button
                type="button"
                onClick={() =>
                navigate("/admin-dashboard")
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            >
                <ArrowLeft className="h-4 w-4" />

                Back to Dashboard
            </button>

            {/* Refresh */}

            <button
                type="button"
                onClick={() =>
                fetchMembers({
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
                Unable to load members
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() => fetchMembers()}
                className="mt-3 text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>

            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>

          </div>
        )}

        {/* =====================================================
            SUMMARY
        ====================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Total Members */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Total Members
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {members.length}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Registered members
                </p>

              </div>

              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                <Users className="h-5 w-5" />
              </div>

            </div>

          </div>

          {/* Search Results */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Showing
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {filteredMembers.length}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Members matching your search
                </p>

              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Search className="h-5 w-5" />
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            MEMBERS CONTAINER
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* ===================================================
              TOOLBAR
          ==================================================== */}

          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h2 className="text-base font-bold text-slate-900">
                  Registered Members
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Browse all members registered in the system.
                </p>

              </div>

              {/* Search */}

              <div className="relative w-full lg:max-w-sm">

                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search members..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />

              </div>

            </div>

          </div>

          {/* ===================================================
              EMPTY STATE
          ==================================================== */}

          {filteredMembers.length === 0 ? (
            <MembersEmptyState
              hasSearch={Boolean(search.trim())}
            />
          ) : (
            <>
              {/* =================================================
                  DESKTOP TABLE
              ================================================== */}

              <div className="hidden overflow-x-auto md:block">

                <table className="w-full">

                  <thead className="bg-slate-50">

                    <tr className="border-b border-slate-200">

                      <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Member
                      </th>

                      <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Member ID
                      </th>

                      <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Registered
                      </th>

                      <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Last Updated
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {filteredMembers.map(
                      (member) => (
                        <MemberTableRow
                          key={member.id}
                          member={member}
                        />
                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* =================================================
                  MOBILE LIST
              ================================================== */}

              <div className="divide-y divide-slate-100 md:hidden">

                {filteredMembers.map(
                  (member) => (
                    <MemberMobileRow
                      key={member.id}
                      member={member}
                    />
                  )
                )}

              </div>
            </>
          )}

        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="mt-4 flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">

          <span>
            {filteredMembers.length} of{" "}
            {members.length} members
          </span>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-left font-medium text-emerald-600 hover:text-emerald-700 sm:text-right"
            >
              Clear search
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Desktop Member Row
|--------------------------------------------------------------------------
*/

const MemberTableRow = ({ member }) => {
  return (
    <tr className="group transition hover:bg-slate-50">

      {/* Member */}

      <td className="px-6 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
            {getInitials(
              member.first_name,
              member.last_name
            )}
          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-semibold text-slate-800">
              {getFullName(member)}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              Member
            </p>

          </div>

        </div>

      </td>

      {/* ID */}

      <td className="px-6 py-4">

        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          #{member.id}
        </span>

      </td>

      {/* Created */}

      <td className="px-6 py-4">

        <div className="flex items-center gap-2">

          <Calendar className="h-4 w-4 text-slate-400" />

          <div>

            <p className="text-sm font-medium text-slate-700">
              {formatDate(member.created_at)}
            </p>

            <p className="text-[11px] text-slate-400">
              Registered
            </p>

          </div>

        </div>

      </td>

      {/* Updated */}

      <td className="px-6 py-4 text-right">

        <p className="text-xs font-medium text-slate-500">
          {formatDateTime(member.updated_at)}
        </p>

        <div className="mt-1 flex justify-end">

          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
            Active
            <ChevronRight className="h-3 w-3" />
          </span>

        </div>

      </td>

    </tr>
  );
};

/*
|--------------------------------------------------------------------------
| Mobile Member Row
|--------------------------------------------------------------------------
*/

const MemberMobileRow = ({ member }) => {
  return (
    <div className="p-5 transition hover:bg-slate-50">

      <div className="flex items-start gap-3">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
          {getInitials(
            member.first_name,
            member.last_name
          )}
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <p className="truncate text-sm font-bold text-slate-800">
                {getFullName(member)}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Member #{member.id}
              </p>

            </div>

            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
              Active
            </span>

          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">

            <div className="rounded-xl bg-slate-50 p-3">

              <div className="flex items-center gap-1.5">

                <Calendar className="h-3.5 w-3.5 text-slate-400" />

                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Registered
                </span>

              </div>

              <p className="mt-1 text-xs font-medium text-slate-600">
                {formatDate(member.created_at)}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-3">

              <div className="flex items-center gap-1.5">

                <RefreshCw className="h-3.5 w-3.5 text-slate-400" />

                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Updated
                </span>

              </div>

              <p className="mt-1 text-xs font-medium text-slate-600">
                {formatDate(member.updated_at)}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

const MembersEmptyState = ({ hasSearch }) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

      <div className="mb-4 rounded-2xl bg-slate-100 p-4">

        {hasSearch ? (
          <Search className="h-6 w-6 text-slate-400" />
        ) : (
          <Users className="h-6 w-6 text-slate-400" />
        )}

      </div>

      <h3 className="text-sm font-semibold text-slate-700">

        {hasSearch
          ? "No members found"
          : "No members registered"}

      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">

        {hasSearch
          ? "Try adjusting your search to find the member you are looking for."
          : "Members registered in the system will appear here."}

      </p>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Loading State
|--------------------------------------------------------------------------
*/

const MembersLoading = () => {
  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        <div className="animate-pulse space-y-6">

          {/* Header */}

          <div className="flex items-center justify-between">

            <div className="space-y-3">

              <div className="h-4 w-32 rounded bg-slate-200" />

              <div className="h-8 w-48 rounded-lg bg-slate-200" />

              <div className="h-4 w-72 rounded bg-slate-200" />

            </div>

            <div className="hidden h-10 w-28 rounded-xl bg-slate-200 sm:block" />

          </div>

          {/* Summary */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="h-32 rounded-2xl bg-white" />

            <div className="h-32 rounded-2xl bg-white" />

          </div>

          {/* Members */}

          <div className="overflow-hidden rounded-2xl bg-white">

            <div className="h-20 border-b border-slate-100" />

            <div className="space-y-1 p-4">

              {[1, 2, 3, 4, 5].map(
                (item) => (
                  <div
                    key={item}
                    className="h-16 rounded-xl bg-slate-100"
                  />
                )
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ViewMembers;
