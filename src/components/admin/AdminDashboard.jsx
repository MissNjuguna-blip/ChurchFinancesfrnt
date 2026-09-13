import React from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  ClipboardPlus,
  FilePlus2,
  FileText,
  Grid2X2,
  ListChecks,
  Plus,
  ShieldCheck,
  Users,
  Wallet,
  Activity,
  ChevronRight,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Intent Cards
|--------------------------------------------------------------------------
*/

const intents = [
  {
    title: "Dashboard",
    description:
      "View your financial overview, balances, recent activity, and system statistics.",
    path: "/admin-dashboard",
    icon: Grid2X2,
    iconClass: "bg-emerald-100 text-emerald-600",
    accent: "from-emerald-500 to-emerald-600",
    label: "Overview",
  },
  {
    title: "Contributions",
    description:
      "Register new member contributions and record incoming payments.",
    path: "/admin-dashboard/register-contributions",
    icon: ClipboardPlus,
    iconClass: "bg-blue-100 text-blue-600",
    accent: "from-blue-500 to-blue-600",
    label: "Record contribution",
  },
  {
    title: "View Contributions",
    description:
      "Review, search, and manage previously recorded member contributions.",
    path: "/admin-dashboard/view-contributions",
    icon: ArrowUpRight,
    iconClass: "bg-cyan-100 text-cyan-600",
    accent: "from-cyan-500 to-cyan-600",
    label: "View records",
  },
  {
    title: "Expenses",
    description:
      "Record organizational expenses and capture payment information.",
    path: "/admin-dashboard/register-expenses",
    icon: FilePlus2,
    iconClass: "bg-orange-100 text-orange-600",
    accent: "from-orange-500 to-orange-600",
    label: "Record expense",
  },
  {
    title: "View Expenses",
    description:
      "Review and manage all recorded expenses and their payment status.",
    path: "/admin-dashboard/view-expenses",
    icon: ArrowDownRight,
    iconClass: "bg-red-100 text-red-600",
    accent: "from-red-500 to-red-600",
    label: "View records",
  },
  {
    title: "Records",
    description:
      "Review system activity and audit records for administrative actions.",
    path: "/admin-dashboard/view-auditlogs",
    icon: FileText,
    iconClass: "bg-violet-100 text-violet-600",
    accent: "from-violet-500 to-violet-600",
    label: "View audit logs",
  },
];

/*
|--------------------------------------------------------------------------
| Quick Actions
|--------------------------------------------------------------------------
*/

const quickActions = [
  {
    title: "Record Contribution",
    description: "Add a new contribution",
    path: "/admin-dashboard/register-contributions",
    icon: Plus,
    className:
      "bg-emerald-600 text-white hover:bg-emerald-700",
  },
  {
    title: "Record Expense",
    description: "Add a new expense",
    path: "/admin-dashboard/register-expenses",
    icon: Plus,
    className:
      "bg-slate-900 text-white hover:bg-slate-800",
  },
];

/*
|--------------------------------------------------------------------------
| Main Dashboard
|--------------------------------------------------------------------------
*/

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="mb-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <div className="rounded-xl bg-emerald-100 p-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>

                <span className="text-sm font-semibold text-emerald-600">
                  Administration
                </span>

              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage your financial records, contributions,
                expenses, and administrative activity from one
                place.
              </p>

            </div>

            {/* Quick actions */}

            <div className="flex flex-col gap-2 sm:flex-row">

              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <NavLink
                    key={action.path}
                    to={action.path}
                    className={`group flex items-center gap-3 rounded-xl px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${action.className}`}
                  >

                    <div className="rounded-lg bg-white/15 p-1.5">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-semibold">
                        {action.title}
                      </p>

                      <p className="text-[11px] opacity-70">
                        {action.description}
                      </p>
                    </div>

                  </NavLink>
                );
              })}

            </div>

          </div>

        </header>

        {/* =====================================================
            WELCOME PANEL
        ====================================================== */}

        <section className="mb-8 overflow-hidden rounded-3xl bg-slate-950 shadow-xl">

          <div className="relative px-6 py-8 sm:px-8 lg:px-10">

            {/* Decorative background */}

            <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div className="max-w-2xl">

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">

                  <Activity className="h-3.5 w-3.5 text-emerald-400" />

                  <span className="text-xs font-medium text-slate-300">
                    Financial Management System
                  </span>

                </div>

                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  What would you like to manage?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Select an area below to go directly to the
                  page you need.
                </p>

              </div>

              <div className="hidden shrink-0 md:block">

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">

                  <Wallet className="h-9 w-9 text-emerald-400" />

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            INTENT CARDS
        ====================================================== */}

        <section>

          <div className="mb-5 flex items-end justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Management Areas
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose an area to continue.
              </p>
            </div>

            <span className="hidden text-xs font-medium text-slate-400 sm:block">
              {intents.length} available areas
            </span>

          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {intents.map((intent) => (
              <IntentCard
                key={intent.path}
                {...intent}
              />
            ))}

          </div>

        </section>

        {/* =====================================================
            FOOTER INFORMATION
        ====================================================== */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

                <Users className="h-5 w-5 text-slate-500" />

              </div>

              <div>

                <p className="text-sm font-semibold text-slate-800">
                  Administration tools
                </p>

                <p className="text-xs text-slate-500">
                  Use the navigation cards above to manage
                  your organization's financial records.
                </p>

              </div>

            </div>

            <NavLink
              to="/admin-dashboard/view-auditlogs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
            >
              View system records
              <ChevronRight className="h-4 w-4" />
            </NavLink>

          </div>

        </section>

      </div>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Intent Card
|--------------------------------------------------------------------------
*/

const IntentCard = ({
  title,
  description,
  path,
  icon: Icon,
  iconClass,
  accent,
  label,
}) => {
  return (
    <NavLink
      to={path}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
    >

      {/* Accent line */}

      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`}
      />

      <div className="flex items-start justify-between gap-4">

        {/* Icon */}

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass} transition-transform duration-200 group-hover:scale-105`}
        >
          <Icon className="h-6 w-6" />
        </div>

        {/* Arrow */}

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-200 group-hover:bg-slate-900 group-hover:text-white">

          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />

        </div>

      </div>

      {/* Content */}

      <div className="mt-5">

        <h3 className="text-lg font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
          {description}
        </p>

      </div>

      {/* Intent */}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

        <span className="text-xs font-semibold text-slate-400 transition-colors group-hover:text-emerald-600">
          {label}
        </span>

        <span className="text-xs font-medium text-slate-300 group-hover:text-slate-400">
          Open
        </span>

      </div>

    </NavLink>
  );
};

export default AdminDashboard;
