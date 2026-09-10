import React from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Church,
  CreditCard,
  FileText,
  Menu,
  ShieldCheck,
  Users,
  WalletCards,
  X,
  TrendingUp,
  Receipt,
  HeartHandshake,
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] =
    React.useState(false);

  const features = [
    {
      icon: Users,
      title: "Member Management",
      description:
        "Keep your church member records organized, accessible, and up to date.",
      color: "red",
    },
    {
      icon: HeartHandshake,
      title: "Contributions",
      description:
        "Record offerings, tithes, donations, and other contributions with ease.",
      color: "emerald",
    },
    {
      icon: Receipt,
      title: "Expense Management",
      description:
        "Track church expenses and instantly see how they affect your available balance.",
      color: "orange",
    },
    {
      icon: BarChart3,
      title: "Financial Insights",
      description:
        "Get a clear picture of your church's financial position through useful reports.",
      color: "blue",
    },
    {
      icon: FileText,
      title: "Reports",
      description:
        "Generate organized financial and membership reports whenever you need them.",
      color: "purple",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Reliable",
      description:
        "Keep important church information protected with secure access controls.",
      color: "slate",
    },
  ];

  const stats = [
    {
      value: "100%",
      label: "Financial visibility",
    },
    {
      value: "24/7",
      label: "Access to your records",
    },
    {
      value: "1",
      label: "Centralized platform",
    },
    {
      value: "∞",
      label: "Room to grow",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

          {/* LOGO */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/20">
              <Church size={21} />
            </div>

            <div>
              <p className="text-base font-bold tracking-tight text-slate-900">
                Church<span className="text-red-600">Flow</span>
              </p>

              <p className="hidden text-[10px] font-medium uppercase tracking-widest text-slate-400 sm:block">
                Church Management
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-red-600"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-slate-600 transition hover:text-red-600"
            >
              Why ChurchFlow
            </a>

            <a
              href="#security"
              className="text-sm font-medium text-slate-600 transition hover:text-red-600"
            >
              Security
            </a>
          </nav>

          {/* DESKTOP ACTIONS */}

          <div className="hidden items-center gap-3 md:flex">

            <Link
              to="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>

          </div>

          {/* MOBILE BUTTON */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            className="rounded-xl p-2 text-slate-600 md:hidden"
          >
            {mobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>

        {/* MOBILE MENU */}

        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-5 py-5 md:hidden">

            <div className="flex flex-col gap-2">

              <a
                href="#features"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Features
              </a>

              <a
                href="#about"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Why ChurchFlow
              </a>

              <a
                href="#security"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Security
              </a>

              <div className="mt-2 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">

                <Link
                  to="/login"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Get Started
                </Link>

              </div>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <main>

        <section className="relative overflow-hidden bg-slate-950 pt-32">

          {/* BACKGROUND EFFECTS */}

          <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-red-600/20 blur-3xl" />

          <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_35%)]" />

          <div className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8 lg:pb-28">

            <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">

              {/* HERO COPY */}

              <div>

                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-red-300 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  MODERN CHURCH MANAGEMENT
                </div>

                <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">

                  Manage your church
                  <span className="block text-red-500">
                    with clarity.
                  </span>

                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                  One simple platform for managing
                  members, contributions, expenses,
                  finances, and church operations —
                  all in one place.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-red-600/20 transition hover:bg-red-500"
                  >
                    Get Started
                    <ArrowRight size={17} />
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Sign in
                    <ChevronRight size={17} />
                  </Link>

                </div>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500">

                  <span className="flex items-center gap-2">
                    <CheckCircle2
                      size={15}
                      className="text-emerald-400"
                    />
                    Simple to use
                  </span>

                  <span className="flex items-center gap-2">
                    <CheckCircle2
                      size={15}
                      className="text-emerald-400"
                    />
                    Financial visibility
                  </span>

                  <span className="flex items-center gap-2">
                    <CheckCircle2
                      size={15}
                      className="text-emerald-400"
                    />
                    Built for churches
                  </span>

                </div>

              </div>

              {/* DASHBOARD PREVIEW */}

              <div className="relative">

                <div className="absolute -inset-5 rounded-[2rem] bg-red-500/10 blur-2xl" />

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white p-3 shadow-2xl shadow-black/40">

                  {/* WINDOW */}

                  <div className="overflow-hidden rounded-xl bg-slate-50">

                    {/* MOCK HEADER */}

                    <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4">

                      <div className="flex items-center gap-2">

                        <div className="flex gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        </div>

                      </div>

                      <div className="h-2 w-24 rounded-full bg-slate-100" />

                    </div>

                    <div className="grid grid-cols-[72px_1fr]">

                      {/* MOCK SIDEBAR */}

                      <div className="hidden min-h-[430px] border-r border-slate-200 bg-white p-3 sm:block">

                        <div className="mb-7 flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
                          <Church size={16} />
                        </div>

                        <div className="space-y-3">

                          {[1, 2, 3, 4, 5].map(
                            (item) => (
                              <div
                                key={item}
                                className={`h-8 rounded-lg ${
                                  item === 1
                                    ? "bg-red-50"
                                    : "bg-slate-50"
                                }`}
                              />
                            )
                          )}

                        </div>

                      </div>

                      {/* MOCK CONTENT */}

                      <div className="p-5 sm:p-6">

                        <div className="flex items-center justify-between">

                          <div>
                            <div className="h-3 w-28 rounded bg-slate-200" />
                            <div className="mt-2 h-2 w-40 rounded bg-slate-100" />
                          </div>

                          <div className="h-8 w-20 rounded-lg bg-red-600" />

                        </div>

                        {/* CARDS */}

                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">

                          <DashboardCard
                            label="Contributions"
                            value="KES 1.24M"
                            icon={TrendingUp}
                            color="emerald"
                          />

                          <DashboardCard
                            label="Expenses"
                            value="KES 428K"
                            icon={Receipt}
                            color="red"
                          />

                          <DashboardCard
                            label="Balance"
                            value="KES 817K"
                            icon={WalletCards}
                            color="blue"
                            className="col-span-2 sm:col-span-1"
                          />

                        </div>

                        {/* CHART */}

                        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">

                          <div className="flex items-center justify-between">

                            <div>
                              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                Financial Overview
                              </p>

                              <p className="mt-1 text-sm font-bold text-slate-800">
                                Cash flow
                              </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 px-2 py-1 text-[9px] text-slate-400">
                              This year
                            </div>

                          </div>

                          <div className="mt-5 flex h-28 items-end gap-2">

                            {[35, 52, 42, 68, 58, 82, 70, 92, 78, 100, 88, 105].map(
                              (height, index) => (
                                <div
                                  key={index}
                                  className="flex flex-1 items-end"
                                >
                                  <div
                                    style={{
                                      height: `${height}%`,
                                    }}
                                    className={`w-full rounded-t-md ${
                                      index > 7
                                        ? "bg-red-500"
                                        : "bg-slate-200"
                                    }`}
                                  />
                                </div>
                              )
                            )}

                          </div>

                        </div>

                        {/* RECENT TRANSACTIONS */}

                        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">

                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-700">
                              Recent activity
                            </p>

                            <span className="text-[9px] text-red-500">
                              View all
                            </span>
                          </div>

                          <MiniTransaction
                            title="Sunday Offering"
                            amount="+ KES 45,000"
                            positive
                          />

                          <MiniTransaction
                            title="Church Utilities"
                            amount="- KES 8,500"
                          />

                          <MiniTransaction
                            title="Tithe"
                            amount="+ KES 32,000"
                            positive
                          />

                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                {/* FLOATING BALANCE */}

                <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl sm:block">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <TrendingUp size={18} />
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-500">
                        Available balance
                      </p>

                      <p className="text-sm font-bold text-white">
                        KES 817,200
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            TRUST BAR
        ===================================================== */}

        <section className="border-b border-slate-100 bg-white">

          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-5 py-7 text-center sm:px-6 lg:justify-between lg:px-8">

            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Everything your church needs
            </p>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">

              <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Users size={16} />
                Members
              </span>

              <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <WalletCards size={16} />
                Contributions
              </span>

              <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Receipt size={16} />
                Expenses
              </span>

              <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <BarChart3 size={16} />
                Reports
              </span>

            </div>

          </div>
        </section>

        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section
          id="features"
          className="bg-slate-50 py-20 sm:py-24"
        >

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-sm font-bold uppercase tracking-widest text-red-600">
                Powerful features
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything in one place.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-500">
                Spend less time managing spreadsheets
                and paperwork, and more time focusing
                on your ministry.
              </p>

            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {features.map(
                (feature) => (
                  <FeatureCard
                    key={feature.title}
                    {...feature}
                  />
                )
              )}

            </div>

          </div>
        </section>

        {/* =====================================================
            FINANCE SECTION
        ===================================================== */}

        <section
          id="about"
          className="overflow-hidden bg-white py-20 sm:py-28"
        >

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

            <div className="grid items-center gap-14 lg:grid-cols-2">

              {/* FINANCE VISUAL */}

              <div className="relative order-2 lg:order-1">

                <div className="absolute inset-10 rounded-full bg-red-100 blur-3xl" />

                <div className="relative rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-xl sm:p-7">

                  <div className="rounded-2xl border border-slate-200 bg-white p-5">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Financial position
                        </p>

                        <p className="mt-1 text-xl font-bold text-slate-900">
                          KES 817,200
                        </p>
                      </div>

                      <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                        <TrendingUp size={20} />
                      </div>

                    </div>

                    <div className="mt-6 space-y-4">

                      <FinanceRow
                        label="Total Contributions"
                        amount="KES 1,245,500"
                        color="emerald"
                        width="100%"
                      />

                      <FinanceRow
                        label="Paid Expenses"
                        amount="KES 428,300"
                        color="red"
                        width="35%"
                      />

                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-5">

                      <div className="flex items-center justify-between">

                        <span className="text-sm font-medium text-slate-500">
                          Available balance
                        </span>

                        <span className="text-lg font-bold text-emerald-600">
                          KES 817,200
                        </span>

                      </div>

                    </div>

                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs text-slate-400">
                        Paid expenses
                      </p>

                      <p className="mt-2 text-lg font-bold text-slate-900">
                        24
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs text-slate-400">
                        Members
                      </p>

                      <p className="mt-2 text-lg font-bold text-slate-900">
                        486
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              {/* COPY */}

              <div className="order-1 lg:order-2">

                <p className="text-sm font-bold uppercase tracking-widest text-red-600">
                  Financial clarity
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Know where your church stands financially.
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-500">
                  ChurchFlow gives your team a clear,
                  real-time view of contributions,
                  expenses, and available funds.
                </p>

                <div className="mt-8 space-y-5">

                  <Benefit
                    title="See your available balance"
                    description="Understand how much remains after paid expenses."
                  />

                  <Benefit
                    title="Track every expense"
                    description="Record exactly what was spent, when, and how."
                  />

                  <Benefit
                    title="Make better decisions"
                    description="Use accurate financial information to plan confidently."
                  />

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="bg-slate-950 py-16">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

              {stats.map(
                (stat) => (
                  <div
                    key={stat.label}
                    className="text-center"
                  >
                    <p className="text-4xl font-bold tracking-tight text-white">
                      {stat.value}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                )
              )}

            </div>

          </div>
        </section>

        {/* =====================================================
            SECURITY
        ===================================================== */}

        <section
          id="security"
          className="bg-white py-20 sm:py-24"
        >

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

            <div className="rounded-3xl bg-slate-50 p-8 sm:p-12 lg:p-16">

              <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">

                <div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <ShieldCheck size={24} />
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Built around trust and accountability.
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                    Your church's financial and member
                    information deserves to be handled
                    responsibly. ChurchFlow keeps your
                    records organized while giving
                    authorized users the visibility they
                    need.
                  </p>

                </div>

                <div className="flex flex-wrap gap-3 lg:max-w-xs lg:justify-end">

                  <SecurityBadge text="Secure access" />

                  <SecurityBadge text="Organized records" />

                  <SecurityBadge text="Financial visibility" />

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="relative overflow-hidden bg-red-600 py-20 sm:py-24">

          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-red-900/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-6">

            <p className="text-sm font-bold uppercase tracking-widest text-red-100">
              Get started today
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Give your church a simpler way to manage.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-red-100">
              Bring your members, contributions,
              expenses, and financial records together
              in one modern platform.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-red-600 shadow-xl transition hover:bg-red-50"
              >
                Get Started
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Sign in
              </Link>

            </div>

          </div>
        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-slate-950">

        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
                <Church size={20} />
              </div>

              <div>
                <p className="font-bold text-white">
                  Church<span className="text-red-500">
                    Flow
                  </span>
                </p>

                <p className="text-xs text-slate-500">
                  Modern church management
                </p>
              </div>

            </div>

            <div className="flex flex-wrap gap-6 text-sm text-slate-500">

              <a
                href="#features"
                className="transition hover:text-white"
              >
                Features
              </a>

              <a
                href="#about"
                className="transition hover:text-white"
              >
                About
              </a>

              <a
                href="#security"
                className="transition hover:text-white"
              >
                Security
              </a>

              <Link
                to="/login"
                className="transition hover:text-white"
              >
                Sign in
              </Link>

            </div>

          </div>

          <div className="mt-10 border-t border-white/10 pt-6">

            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} ChurchFlow.
              All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
};


/* ============================================================
   DASHBOARD CARD
============================================================ */

const DashboardCard = ({
  label,
  value,
  icon: Icon,
  color,
  className = "",
}) => {

  const colors = {
    emerald:
      "bg-emerald-50 text-emerald-600",
    red:
      "bg-red-50 text-red-600",
    blue:
      "bg-blue-50 text-blue-600",
  };

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-3 ${className}`}
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[9px] font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {value}
          </p>

        </div>

        <div
          className={`rounded-lg p-1.5 ${colors[color]}`}
        >
          <Icon size={13} />
        </div>

      </div>

    </div>
  );
};


/* ============================================================
   MINI TRANSACTION
============================================================ */

const MiniTransaction = ({
  title,
  amount,
  positive = false,
}) => (
  <div className="flex items-center justify-between border-t border-slate-50 py-2.5">

    <div className="flex items-center gap-2">

      <div
        className={`h-1.5 w-1.5 rounded-full ${
          positive
            ? "bg-emerald-500"
            : "bg-red-500"
        }`}
      />

      <span className="text-[10px] text-slate-500">
        {title}
      </span>

    </div>

    <span
      className={`text-[10px] font-semibold ${
        positive
          ? "text-emerald-600"
          : "text-red-500"
      }`}
    >
      {amount}
    </span>

  </div>
);


/* ============================================================
   FEATURE CARD
============================================================ */

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color,
}) => {

  const styles = {
    red:
      "bg-red-50 text-red-600",
    emerald:
      "bg-emerald-50 text-emerald-600",
    orange:
      "bg-orange-50 text-orange-600",
    blue:
      "bg-blue-50 text-blue-600",
    purple:
      "bg-purple-50 text-purple-600",
    slate:
      "bg-slate-100 text-slate-600",
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles[color]}`}
      >
        <Icon size={21} />
      </div>

      <h3 className="mt-5 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-slate-400 transition group-hover:text-red-600">
        Learn more
        <ArrowRight size={13} />
      </div>

    </div>
  );
};


/* ============================================================
   FINANCE ROW
============================================================ */

const FinanceRow = ({
  label,
  amount,
  color,
  width,
}) => {

  const barColor =
    color === "emerald"
      ? "bg-emerald-500"
      : "bg-red-500";

  return (
    <div>

      <div className="flex items-center justify-between">

        <span className="text-xs text-slate-500">
          {label}
        </span>

        <span className="text-xs font-bold text-slate-800">
          {amount}
        </span>

      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width }}
        />

      </div>

    </div>
  );
};


/* ============================================================
   BENEFIT
============================================================ */

const Benefit = ({
  title,
  description,
}) => (
  <div className="flex gap-4">

    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
      <CheckCircle2 size={15} />
    </div>

    <div>

      <h3 className="text-sm font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>

  </div>
);


/* ============================================================
   SECURITY BADGE
============================================================ */

const SecurityBadge = ({
  text,
}) => (
  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">

    <CheckCircle2
      size={14}
      className="text-emerald-500"
    />

    {text}

  </div>
);
export default LandingPage;
