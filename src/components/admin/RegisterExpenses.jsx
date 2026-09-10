import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  X,
  Save,
  WalletCards,
  CalendarDays,
  User,
  ChevronDown,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Banknote,
  FileText,
  Receipt,
} from "lucide-react";

import api from "../context/api/api";
import { AuthContext } from "../context/AuthContext";

const RegisterExpenses = () => {
  const { user } = useContext(AuthContext);

  const getToday = () =>
    new Date().toISOString().split("T")[0];

  const initialFormData = {
    description: "",
    amount: "",
    expense_date: getToday(),
    payment_method: "CASH",
    reference: "",
    status: "PAID",
  };

  const [formData, setFormData] =
    useState(initialFormData);

  const [expenses, setExpenses] = useState([]);
  const [dashboard, setDashboard] = useState(null);


  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

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

  const statuses = [
    {
      value: "PAID",
      label: "Paid",
    },
    {
      value: "PENDING",
      label: "Pending",
    },
    {
      value: "CANCELLED",
      label: "Cancelled",
    },
  ];

  // =====================================================
  // LOAD EXPENSES
  // =====================================================

  useEffect(() => {
    loadExpenses();
    loadDashboard();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "expenses/expenses/"
      );

      console.log(
        "EXPENSES RESPONSE:",
        response.data
      );    

      const data =
        response.data?.results ||
        response.data?.expenses ||
        response.data ||
        [];

      setExpenses(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Failed to load expenses:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load expenses."
      );
    } finally {
      setLoading(false);
    }
  };
  const loadDashboard = async () => {
  try {
    const response = await api.get("core/admin-dashboard");
    setDashboard(response.data);
  } catch (err) {
    console.error("Failed to load dashboard:", err);
  }
};


  // =====================================================
  // FORM
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      return "Please enter the expense description.";
    }

    if (!formData.amount) {
      return "Please enter the expense amount.";
    }

    if (Number(formData.amount) <= 0) {
      return "Amount must be greater than zero.";
    }

    if (!formData.expense_date) {
      return "Please select the expense date.";
    }

    if (!formData.payment_method) {
      return "Please select a payment method.";
    }

    if (!formData.status) {
      return "Please select the expense status.";
    }

    return null;
  };

  // =====================================================
  // SAVE EXPENSE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const response = await api.post(
        "expenses/expenses/",
        {
          description:
            formData.description.trim(),

          amount: Number(
            formData.amount
          ).toFixed(2),

          expense_date:
            formData.expense_date,

          payment_method:
            formData.payment_method,

          reference:
            formData.reference.trim(),

          status:
            formData.status,
        }
      );

      const newExpense =
        response.data;

      setExpenses((prev) => [
        newExpense,
        ...prev,
      ]);

      setSuccess(
        "Expense recorded successfully."
      );

      setFormData({
        ...initialFormData,
        expense_date: getToday(),
      });

      setShowForm(false);
    } catch (err) {
      console.error(
        "Failed to save expense:",
        err
      );

      const backendError =
        err.response?.data;

      if (
        backendError &&
        typeof backendError === "object"
      ) {
        const firstError =
          Object.values(
            backendError
          )[0];

        if (Array.isArray(firstError)) {
          setError(
            firstError[0]
          );
        } else {
          setError(
            String(firstError)
          );
        }
      } else {
        setError(
          "Unable to save expense. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (
    expenseId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this expense?"
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(expenseId);
    setError("");

    try {
      await api.delete(
        `expenses/expenses/${expenseId}/`
      );

      setExpenses((prev) =>
        prev.filter(
          (expense) =>
            expense.id !== expenseId
        )
      );

      setSuccess(
        "Expense deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete expense error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to delete expense."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // TOTAL
  // =====================================================

  const totalAmount = useMemo(() => {
    return expenses
      .reduce(
        (total, expense) =>
          total +
          Number(
            expense.amount || 0
          ),
        0
      )
      .toLocaleString(
        "en-KE",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      );
  }, [expenses]);

  const totalContributions = useMemo(() => {
    return Number(
        dashboard?.summary?.total_contributions || 0
    );
    }, [dashboard]);

    const paidExpensesTotal = useMemo(() => {
    return expenses
        .filter(
        (expense) => expense.status === "PAID"
        )
        .reduce(
        (total, expense) =>
            total + Number(expense.amount || 0),
        0
        );
    }, [expenses]);

    const currentBalance = useMemo(() => {
    return totalContributions - paidExpensesTotal;
    }, [
    totalContributions,
    paidExpensesTotal,
    ]);

    const expenseBeingEntered = Number(
    formData.amount || 0
    );

    const projectedBalance = useMemo(() => {
    if (formData.status !== "PAID") {
        return currentBalance;
    }

    return currentBalance - expenseBeingEntered;
    }, [
    currentBalance,
    expenseBeingEntered,
    formData.status,
    ]);


  // =====================================================
  // FORMATTERS
  // =====================================================

  const formatAmount = (
    amount
  ) => {
    return Number(
      amount || 0
    ).toLocaleString(
      "en-KE",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-KE",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getRecorderName = (
    expense
  ) => {
    if (
      user &&
      Number(expense.recorded_by) ===
        Number(user.id)
    ) {
      return (
        `${user.first_name || ""} ${
          user.last_name || ""
        }`
      ).trim() || "Administrator";
    }

    if (
      expense.recorded_by_details
    ) {
      return (
        `${
          expense.recorded_by_details
            .first_name || ""
        } ${
          expense.recorded_by_details
            .last_name || ""
        }`
      ).trim();
    }

    return "Administrator";
  };

  const getPaymentMethodLabel = (
    value
  ) => {
    const method =
      paymentMethods.find(
        (item) =>
          item.value === value
      );

    return (
      method?.label || value
    );
  };

  const getStatusLabel = (
    value
  ) => {
    const status =
      statuses.find(
        (item) =>
          item.value === value
      );

    return (
      status?.label || value
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-red-600">
              Finance
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Register Expenses
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Record and manage church expenses.
            </p>
          </div>

          {/* ADD EXPENSE BUTTON */}

          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setError("");
              setSuccess("");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20"
          >
            <Plus size={18} />

            Add Expense
          </button>
        </div>

        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>
              {error}
            </span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>
              {success}
            </span>
          </div>
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Expenses
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  KES {totalAmount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Banknote size={21} />
              </div>
            </div>
          </div>

          {/* COUNT */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Expenses Recorded
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {expenses.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Receipt size={21} />
              </div>
            </div>
          </div>

          {/* PAID */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Paid Expenses
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {
                    expenses.filter(
                      (expense) =>
                        expense.status ===
                        "PAID"
                    ).length
                  }
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            RECORDED EXPENSES
        ================================================= */}

        <div>

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Expenses
              </h2>

              <p className="text-sm text-slate-500">
                Expenses recorded in the system.
              </p>
            </div>

            <button
              type="button"
              onClick={loadExpenses}
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              title="Refresh"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-64 animate-pulse rounded-2xl bg-white"
                  />
                )
              )}

            </div>
          ) : expenses.length === 0 ? (

            /* EMPTY */

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Receipt size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No expenses yet
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Start by adding the first expense using the button above.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowForm(true)
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                <Plus size={17} />
                Add Expense
              </button>
            </div>

          ) : (

            /* EXPENSE CARDS */

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {expenses.map(
                (expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    recorderName={getRecorderName(
                      expense
                    )}
                    formatAmount={
                      formatAmount
                    }
                    formatDate={
                      formatDate
                    }
                    paymentMethodLabel={getPaymentMethodLabel(
                      expense.payment_method
                    )}
                    statusLabel={getStatusLabel(
                      expense.status
                    )}
                    onDelete={
                      handleDelete
                    }
                    deleting={
                      deletingId ===
                      expense.id
                    }
                  />
                )
              )}

            </div>
          )}
        </div>
      </div>

      {/* =================================================
          POPUP MODAL
      ================================================= */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

          <div
            className="absolute inset-0"
            onClick={() => {
              if (!saving) {
                setShowForm(false);
              }
            }}
          />

          <div className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-5 sm:px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Plus size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    New Expense
                  </h2>

                  <p className="text-sm text-slate-500">
                    Enter the expense details below.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!saving) {
                    setShowForm(false);
                  }
                }}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-6"
            >
            {/* =================================================
                AVAILABLE BALANCE
            ================================================= */}

            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    Available Balance
                    </p>

                    <p className="mt-1 text-2xl font-bold text-emerald-800">
                    KES{" "}
                    {formatAmount(
                        currentBalance
                    )}
                    </p>

                    <p className="mt-1 text-xs text-emerald-600">
                    Total contributions less paid expenses
                    </p>
                </div>

                {expenseBeingEntered > 0 && (
                    <div className="rounded-xl border border-red-200 bg-white px-4 py-3">

                    <p className="text-xs font-medium text-slate-400">
                        After this expense
                    </p>

                    <p
                        className={`mt-1 text-xl font-bold ${
                        projectedBalance < 0
                            ? "text-red-600"
                            : "text-slate-900"
                        }`}
                    >
                        KES{" "}
                        {formatAmount(
                        projectedBalance
                        )}
                    </p>

                    </div>
                )}

                </div>

                {/* LIVE CALCULATION */}

                {expenseBeingEntered > 0 && (
                <div className="mt-4 border-t border-emerald-200 pt-3">

                    <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                        Current balance
                    </span>

                    <span className="font-semibold text-slate-700">
                        KES{" "}
                        {formatAmount(
                        currentBalance
                        )}
                    </span>

                    </div>

                    <div className="mt-1 flex items-center justify-between text-sm">

                    <span className="text-red-500">
                        This expense
                    </span>

                    <span className="font-semibold text-red-600">
                        - KES{" "}
                        {formatAmount(
                        expenseBeingEntered
                        )}
                    </span>

                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-emerald-200 pt-2">

                    <span className="font-semibold text-slate-700">
                        Remaining balance
                    </span>

                    <span
                        className={`font-bold ${
                        projectedBalance < 0
                            ? "text-red-600"
                            : "text-emerald-700"
                        }`}
                    >
                        KES{" "}
                        {formatAmount(
                        projectedBalance
                        )}
                    </span>

                    </div>

                </div>
                )}

                {/* INSUFFICIENT BALANCE */}

                {projectedBalance < 0 &&
                expenseBeingEntered > 0 && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">

                    <AlertCircle size={16} />

                    This expense exceeds the available balance.

                    </div>
                )}

            </div>


              <div className="grid gap-5 md:grid-cols-2">

                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>

                  <div className="relative">

                    <FileText
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="description"
                      name="description"
                      type="text"
                      placeholder="e.g. Church chairs"
                      value={
                        formData.description
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />

                  </div>
                </div>

                {/* AMOUNT */}

                <div>

                  <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Amount
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                      KES
                    </span>

                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      value={
                        formData.amount
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-14 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />

                  </div>
                </div>

                {/* DATE */}

                <div>

                  <label
                    htmlFor="expense_date"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Expense Date
                  </label>

                  <div className="relative">

                    <CalendarDays
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="expense_date"
                      name="expense_date"
                      type="date"
                      value={
                        formData.expense_date
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />

                  </div>
                </div>

                {/* PAYMENT METHOD */}

                <div>

                  <label
                    htmlFor="payment_method"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Payment Method
                  </label>

                  <div className="relative">

                    <select
                      id="payment_method"
                      name="payment_method"
                      value={
                        formData.payment_method
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    >

                      {paymentMethods.map(
                        (method) => (
                          <option
                            key={
                              method.value
                            }
                            value={
                              method.value
                            }
                          >
                            {
                              method.label
                            }
                          </option>
                        )
                      )}

                    </select>

                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                  </div>
                </div>

                {/* STATUS */}

                <div>

                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Status
                  </label>

                  <div className="relative">

                    <select
                      id="status"
                      name="status"
                      value={
                        formData.status
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    >

                      {statuses.map(
                        (status) => (
                          <option
                            key={
                              status.value
                            }
                            value={
                              status.value
                            }
                          >
                            {
                              status.label
                            }
                          </option>
                        )
                      )}

                    </select>

                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                  </div>
                </div>

                {/* REFERENCE */}

                <div className="md:col-span-2">

                  <label
                    htmlFor="reference"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Reference
                    <span className="ml-1 font-normal text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="reference"
                    name="reference"
                    type="text"
                    placeholder="e.g. MPESA-ABC123"
                    value={
                      formData.reference
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  />

                </div>

              </div>

              {/* PREVIEW */}

              {formData.amount && (
                <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Expense Preview
                  </p>

                  <div className="mt-2 flex items-center justify-between">

                    <span className="text-sm text-slate-600">
                      {formData.description ||
                        "New expense"}
                    </span>

                    <span className="text-lg font-bold text-slate-900">
                      KES{" "}
                      {formatAmount(
                        formData.amount
                      )}
                    </span>

                  </div>
                </div>
              )}

              {/* BUTTONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                        <button
                type="submit"
                disabled={
                saving ||
                (
                formData.status === "PAID" &&
                expenseBeingEntered > currentBalance
                )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Expense
                    </>
                  )}

                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// EXPENSE CARD
// =====================================================

const ExpenseCard = ({
  expense,
  recorderName,
  formatAmount,
  formatDate,
  paymentMethodLabel,
  statusLabel,
  onDelete,
  deleting,
}) => {
  const statusStyles = {
    PAID:
      "bg-emerald-50 text-emerald-700",
    PENDING:
      "bg-amber-50 text-amber-700",
    CANCELLED:
      "bg-red-50 text-red-700",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      {/* TOP ACCENT */}

      <div className="absolute left-0 top-0 h-1 w-full bg-red-500" />

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Receipt size={21} />
          </div>

          <div>

            <p className="text-sm font-semibold text-slate-900">
              {expense.description}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              #{expense.id}
            </p>

          </div>
        </div>

        {/* DELETE */}

        <button
          type="button"
          onClick={() =>
            onDelete(
              expense.id
            )
          }
          disabled={deleting}
          className="rounded-lg p-2 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 disabled:opacity-50"
          title="Delete expense"
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
            expense.amount
          )}
        </p>

      </div>

      {/* DETAILS */}

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">

        {/* DATE */}

        <div className="flex items-center gap-3">

          <CalendarDays
            size={16}
            className="text-slate-400"
          />

          <div>

            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Expense date
            </p>

            <p className="text-sm font-medium text-slate-700">
              {formatDate(
                expense.expense_date
              )}
            </p>

          </div>
        </div>

        {/* PAYMENT METHOD */}

        <div className="flex items-center gap-3">

          <WalletCards
            size={16}
            className="text-slate-400"
          />

          <div>

            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Payment method
            </p>

            <p className="text-sm font-medium text-slate-700">
              {paymentMethodLabel}
            </p>

          </div>
        </div>

        {/* REFERENCE */}

        {expense.reference && (
          <div className="flex items-center gap-3">

            <FileText
              size={16}
              className="text-slate-400"
            />

            <div className="min-w-0">

              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Reference
              </p>

              <p className="truncate text-sm font-medium text-slate-700">
                {expense.reference}
              </p>

            </div>
          </div>
        )}

        {/* RECORDED BY */}

        <div className="flex items-center gap-3">

          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <User size={14} />
          </div>

          <div>

            <p className="text-[11px] uppercase tracking-wide text-slate-300">
              Recorded by
            </p>

            <p className="text-xs text-slate-400">
              {recorderName}
            </p>

          </div>
        </div>
      </div>

      {/* FOOTER */}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[
              expense.status
            ] ||
            "bg-slate-100 text-slate-500"
          }`}
        >
          {statusLabel}
        </span>

        <span className="text-xs text-slate-300">
          Created{" "}
          {formatDate(
            expense.created_at?.split(
              "T"
            )[0]
          )}
        </span>

      </div>
    </div>
  );
};

export default RegisterExpenses;
