import React from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Church,
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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-slate-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">

          {/* LOGO */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white shadow-lg shadow-red-600/20 sm:h-10 sm:w-10 sm:rounded-xl">
              <Church size={19} className="sm:h-[21px] sm:w-[21px]" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-tight text-slate-900 sm:text-base">
                Church<span className="text-red-600">Flow</span>
              </p>

              <p className="hidden text-[10px] font-medium uppercase tracking-widest text-slate-400 sm:block">
                Church Management
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-6 md:flex lg:gap-8">

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

          <div className="hidden items-center gap-2 md:flex lg:gap-3">

            <Link
              to="/login"
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 lg:px-4"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 lg:px-5"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>

          </div>

          {/* MOBILE BUTTON */}

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() =>
              setMobileMenuOpen((prev) => !prev)
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 md:hidden"
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
          <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg md:hidden">

            <nav className="flex flex-col gap-1">

              <a
                href="#features"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Features
              </a>

              <a
                href="#about"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Why ChurchFlow
              </a>

              <a
                href="#security"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Security
              </a>

            </nav>

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">

              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="rounded-xl bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Get Started
              </Link>

            </div>

          </div>
        )}

      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <main>

        <section className="relative overflow-hidden bg-slate-950 pt-24 sm:pt-28 lg:pt-32">

          {/* BACKGROUND EFFECTS */}

          <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-red-600/20 blur-3xl sm:-left-40 sm:top-20 sm:h-96 sm:w-96" />

          <div className="absolute -right-32 top-32 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl sm:-right-40 sm:top-40 sm:h-96 sm:w-96" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_35%)]" />

          <div className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8 lg:pb-28">

            <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">

              {/* HERO COPY */}

              <div className="text-center lg:text-left">

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-red-300 backdrop-blur sm:text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  MODERN CHURCH MANAGEMENT
                </div>

                <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:mx-0 lg:text-6xl">

                  Manage your church

                  <span className="block text-red-500">
                    with clarity.
                  </span>

                </h1>

                <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-400 sm:mt-6 sm:text-lg sm:leading-7 lg:mx-0">
                  One simple platform for managing
                  members, contributions, expenses,
                  finances, and church operations —
                  all in one place.
                </p>

                <div className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:mt-8 sm:flex-row lg:mx-0">

                  <Link
                    to="/register"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-red-600/20 transition hover:bg-red-500 sm:w-auto"
                  >
                    Get Started
                    <ArrowRight size={17} />
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                  >
                    Sign in
                    <ChevronRight size={17} />
                  </Link>

                </div>

                <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-3 text-[11px] text-slate-500 sm:mt-8 sm:gap-x-6 sm:text-xs lg:justify-start">

                  <span className="flex items-center gap-2">
                    <CheckCircle2
                      size={14}
                      className="text-emerald-400"
                    />
                    Simple to use
                  </span>

                  <span className="flex items-center gap-2">
                    <CheckCircle2
                      size={14}
                      className="text-emerald-400"
                    />
                    Financial visibility
                  </span>

                  <span className="flex items-center gap-2">
                    <CheckCircle2
                      size={14}
                      className="text-emerald-400"
                    />
                    Built for churches
                  </span>

                </div>

              </div>

              {/* DASHBOARD PREVIEW */}

              <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">

                <div className="absolute -inset-3 rounded-[2rem] bg-red-500/10 blur-2xl sm:-inset-5" />

                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white p-2 shadow-2xl shadow-black/40 sm:rounded-2xl sm:p-3">

                  {/* WINDOW */}

                  <div className="overflow-hidden rounded-lg bg-slate-50 sm:rounded-xl">

                    {/* MOCK HEADER */}

                    <div className="flex h-10 items-center justify-between border-b border-slate-200 bg-white px-3 sm:h-12 sm:px-4">

                      <div className="flex items-center gap-2">

                        <div className="flex gap-1">

                          <span className="h-2 w-2 rounded-full bg-red-400 sm:h-2.5 sm:w-2.5" />

                          <span className="h-2 w-2 rounded-full bg-amber-400 sm:h-2.5 sm:w-2.5" />

                          <span className="h-2 w-2 rounded-full bg-emerald-400 sm:h-2.5 sm:w-2.5" />

                        </div>

                      </div>

                      <div className="h-1.5 w-16 rounded-full bg-slate-100 sm:h-2 sm:w-24" />

                    </div>

                    <div className="grid grid-cols-[52px_1fr] sm:grid-cols-[72px_1fr]">

                      {/* MOCK SIDEBAR */}

                      <div className="hidden min-h-[300px] border-r border-slate-200 bg-white p-2 sm:block sm:min-h-[430px] sm:p-3">

                        <div className="mb-5 flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white sm:mb-7 sm:h-8 sm:w-8">
                          <Church size={14} className="sm:h-4 sm:w-4" />
                        </div>

                        <div className="space-y-2 sm:space-y-3">

                          {[1, 2, 3, 4, 5].map(
                            (item) => (
                              <div
                                key={item}
                                className={`h-7 rounded-lg sm:h-8 ${
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

                      <div className="min-w-0 p-3 sm:p-6">

                        <div className="flex items-center justify-between gap-3">

                          <div className="min-w-0">
                            <div className="h-2.5 w-24 rounded bg-slate-200 sm:h-3 sm:w-28" />
                            <div className="mt-2 h-2 w-32 rounded bg-slate-100 sm:w-40" />
                          </div>

                          <div className="h-7 w-14 shrink-0 rounded-lg bg-red-600 sm:h-8 sm:w-20" />

                        </div>

                        {/* CARDS */}

                        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3">

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

                        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 sm:mt-4 sm:rounded-xl sm:p-4">

                          <div className="flex items-center justify-between gap-2">

                            <div>
                              <p className="text-[8px] font-medium uppercase tracking-wide text-slate-400 sm:text-[10px]">
                                Financial Overview
                              </p>

                              <p className="mt-1 text-xs font-bold text-slate-800 sm:text-sm">
                                Cash flow
                              </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 px-1.5 py-1 text-[7px] text-slate-400 sm:px-2 sm:text-[9px]">
                              This year
                            </div>

                          </div>

                          <div className="mt-4 flex h-20 items-end gap-1 sm:mt-5 sm:h-28 sm:gap-2">

                            {[35, 52, 42, 68, 58, 82, 70, 92, 78, 100, 88, 105].map(
                              (height, index) => (
                                <div
                                  key={index}
                                  className="flex h-full flex-1 items-end"
                                >
                                  <div
                                    style={{
                                      height: `${height}%`,
                                    }}
                                    className={`w-full rounded-t-sm sm:rounded-t-md ${
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

                        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 sm:mt-4 sm:rounded-xl sm:p-4">

                          <div className="mb-2.5 flex items-center justify-between sm:mb-3">

                            <p className="text-[10px] font-semibold text-slate-700 sm:text-xs">
                              Recent activity
                            </p>

                            <span className="text-[8px] text-red-500 sm:text-[9px]">
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

                <div className="absolute -bottom-4 left-2 hidden rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-2xl sm:-bottom-5 sm:-left-5 sm:block sm:p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 sm:h-10 sm:w-10">
                      <TrendingUp size={17} />
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-500 sm:text-[10px]">
                        Available balance
                      </p>

                      <p className="text-xs font-bold text-white sm:text-sm">
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

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">

            <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:justify-between">

              <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:text-xs">
                Everything your church needs
              </p>

              <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-3 lg:w-auto">

                <span className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
                  <Users size={15} />
                  Members
                </span>

                <span className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
                  <WalletCards size={15} />
                  Contributions
                </span>

                <span className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
                  <Receipt size={15} />
                  Expenses
                </span>

                <span className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
                  <BarChart3 size={15} />
                  Reports
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section
          id="features"
          className="scroll-mt-16 bg-slate-50 py-16 sm:scroll-mt-20 sm:py-24"
        >

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-xs font-bold uppercase tracking-widest text-red-600 sm:text-sm">
                Powerful features
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:mt-3 sm:text-4xl">
                Everything in one place.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:mt-4 sm:text-base sm:leading-7">
                Spend less time managing spreadsheets
                and paperwork, and more time focusing
                on your ministry.
              </p>

            </div>

            <div className="mt-9 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">

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
          className="scroll-mt-16 overflow-hidden bg-white py-16 sm:scroll-mt-20 sm:py-28"
        >

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-2">

              {/* FINANCE VISUAL */}

              <div className="relative order-2 lg:order-1">

                <div className="absolute inset-6 rounded-full bg-red-100 blur-3xl sm:inset-10" />

                <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-xl sm:rounded-3xl sm:p-7">

                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:rounded-2xl sm:p-5">

                    <div className="flex items-center justify-between gap-4">

                      <div>
                        <p className="text-[10px] font-medium text-slate-400 sm:text-xs">
                          Financial position
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                          KES 817,200
                        </p>
                      </div>

                      <div className="shrink-0 rounded-xl bg-emerald-50 p-2 text-emerald-600 sm:p-2.5">
                        <TrendingUp size={18} className="sm:h-5 sm:w-5" />
                      </div>

                    </div>

                    <div className="mt-5 space-y-4 sm:mt-6">

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

                    <div className="mt-5 border-t border-slate-100 pt-4 sm:mt-6 sm:pt-5">

                      <div className="flex items-center justify-between gap-3">

                        <span className="text-xs font-medium text-slate-500 sm:text-sm">
                          Available balance
                        </span>

                        <span className="text-base font-bold text-emerald-600 sm:text-lg">
                          KES 817,200
                        </span>

                      </div>

                    </div>

                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4">

                    <div className="rounded-xl border border-slate-200 bg-white p-3 sm:rounded-2xl sm:p-4">

                      <p className="text-[10px] text-slate-400 sm:text-xs">
                        Paid expenses
                      </p>

                      <p className="mt-1.5 text-lg font-bold text-slate-900 sm:mt-2">
                        24
                      </p>

                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3 sm:rounded-2xl sm:p-4">

                      <p className="text-[10px] text-slate-400 sm:text-xs">
                        Members
                      </p>

                      <p className="mt-1.5 text-lg font-bold text-slate-900 sm:mt-2">
                        486
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* COPY */}

              <div className="order-1 lg:order-2">

                <p className="text-xs font-bold uppercase tracking-widest text-red-600 sm:text-sm">
                  Financial clarity
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:mt-3 sm:text-4xl">
                  Know where your church stands financially.
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-500 sm:mt-5 sm:text-base sm:leading-7">
                  ChurchFlow gives your team a clear,
                  real-time view of contributions,
                  expenses, and available funds.
                </p>

                <div className="mt-7 space-y-5 sm:mt-8">

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

        <section className="bg-slate-950 py-12 sm:py-16">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

              {stats.map(
                (stat) => (
                  <div
                    key={stat.label}
                    className="text-center"
                  >

                    <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      {stat.value}
                    </p>

                    <p className="mt-1.5 text-xs text-slate-500 sm:mt-2 sm:text-sm">
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
          className="scroll-mt-16 bg-white py-16 sm:scroll-mt-20 sm:py-24"
        >

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="rounded-2xl bg-slate-50 p-5 sm:rounded-3xl sm:p-12 lg:p-16">

              <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-10">

                <div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 sm:h-12 sm:w-12 sm:rounded-2xl">
                    <ShieldCheck size={22} className="sm:h-6 sm:w-6" />
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:mt-5 sm:text-3xl">
                    Built around trust and accountability.
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:mt-4 sm:text-base">
                    Your church's financial and member
                    information deserves to be handled
                    responsibly. ChurchFlow keeps your
                    records organized while giving
                    authorized users the visibility they
                    need.
                  </p>

                </div>

                <div className="flex flex-wrap gap-2.5 lg:max-w-xs lg:justify-end">

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

        <section className="relative overflow-hidden bg-red-600 py-16 sm:py-24">

          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-white/10 blur-3xl sm:h-80 sm:w-80" />

          <div className="absolute -bottom-40 -left-20 h-64 w-64 rounded-full bg-red-900/20 blur-3xl sm:h-80 sm:w-80" />

          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">

            <p className="text-xs font-bold uppercase tracking-widest text-red-100 sm:text-sm">
              Get started today
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:mt-3 sm:text-4xl">
              Give your church a simpler way to manage.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-red-100 sm:mt-5 sm:text-base sm:leading-7">
              Bring your members, contributions,
              expenses, and financial records together
              in one modern platform.
            </p>

            <div className="mx-auto mt-7 flex max-w-md flex-col justify-center gap-3 sm:mt-8 sm:flex-row">

              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-red-600 shadow-xl transition hover:bg-red-50 sm:w-auto"
              >
                Get Started
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15 sm:w-auto"
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

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white sm:h-10 sm:w-10">
                <Church size={18} className="sm:h-5 sm:w-5" />
              </div>

              <div>

                <p className="text-sm font-bold text-white sm:text-base">
                  Church<span className="text-red-500">
                    Flow
                  </span>
                </p>

                <p className="text-[10px] text-slate-500 sm:text-xs">
                  Modern church management
                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-500 sm:gap-6 sm:text-sm">

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

          <div className="mt-8 border-t border-white/10 pt-5 sm:mt-10 sm:pt-6">

            <p className="text-[10px] text-slate-600 sm:text-xs">
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
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div
      className={`min-w-0 rounded-lg border border-slate-200 bg-white p-2.5 sm:rounded-xl sm:p-3 ${className}`}
    >

      <div className="flex items-start justify-between gap-1">

        <div className="min-w-0">

          <p className="truncate text-[8px] font-medium text-slate-400 sm:text-[9px]">
            {label}
          </p>

          <p className="mt-1 truncate text-xs font-bold text-slate-800 sm:text-sm">
            {value}
          </p>

        </div>

        <div
          className={`shrink-0 rounded-md p-1 sm:rounded-lg sm:p-1.5 ${colors[color]}`}
        >
          <Icon size={11} className="sm:h-[13px] sm:w-[13px]" />
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
  <div className="flex min-w-0 items-center justify-between gap-2 border-t border-slate-50 py-2 sm:py-2.5">

    <div className="flex min-w-0 items-center gap-2">

      <div
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          positive
            ? "bg-emerald-500"
            : "bg-red-500"
        }`}
      />

      <span className="truncate text-[9px] text-slate-500 sm:text-[10px]">
        {title}
      </span>

    </div>

    <span
      className={`shrink-0 text-[8px] font-semibold sm:text-[10px] ${
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
    red: "bg-red-50 text-red-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${styles[color]}`}
      >
        <Icon size={19} className="sm:h-[21px] sm:w-[21px]" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-900 sm:mt-5">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-slate-400 transition group-hover:text-red-600 sm:mt-5 sm:text-xs">
        Learn more
        <ArrowRight size={12} />
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

      <div className="flex items-center justify-between gap-3">

        <span className="min-w-0 truncate text-[10px] text-slate-500 sm:text-xs">
          {label}
        </span>

        <span className="shrink-0 text-[10px] font-bold text-slate-800 sm:text-xs">
          {amount}
        </span>

      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 sm:h-2">

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
  <div className="flex gap-3 sm:gap-4">

    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
      <CheckCircle2 size={14} />
    </div>

    <div className="min-w-0">

      <h3 className="text-xs font-bold text-slate-900 sm:text-sm">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
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
  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-600 sm:text-xs">
    <CheckCircle2
      size={13}
      className="shrink-0 text-emerald-500"
    />
    {text}
  </div>
);
export default LandingPage;
