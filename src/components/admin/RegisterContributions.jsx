import React, { useContext, useEffect, useMemo, useState } from "react";
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
} from "lucide-react";

import api from "../context/api/api";
import { AuthContext } from "../context/AuthContext";

const RegisterContributions = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    member: "",
    contribution_type: "",
    amount: "",
    contribution_date: new Date().toISOString().split("T")[0],
    payment_method: "CASH",
  });

  const [members, setMembers] = useState([]);
  const [contributionTypes, setContributionTypes] = useState([]);
  const [contributions, setContributions] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const paymentMethods = [
    { value: "CASH", label: "Cash" },
    { value: "MPESA", label: "M-Pesa" },
    { value: "BANK", label: "Bank" },
    { value: "CARD", label: "Card" },
    { value: "OTHER", label: "Other" },
  ];

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        membersResponse,
        typesResponse,
        contributionsResponse,
      ] = await Promise.all([
        api.get("members/members/"),
        api.get("finances/contribution-types/"),
        api.get("finances/contributions/"),
      ]);

      console.log("MEMBERS:", membersResponse.data);
      console.log("CONTRIBUTION TYPES:", typesResponse.data);
      console.log("CONTRIBUTIONS:", contributionsResponse.data);

      const membersData =
        membersResponse.data?.results ||
        membersResponse.data?.members ||
        membersResponse.data ||
        [];

      const typesData =
        typesResponse.data?.results ||
        typesResponse.data?.contribution_types ||
        typesResponse.data ||
        [];

      const contributionsData =
        contributionsResponse.data?.results ||
        contributionsResponse.data?.contributions ||
        contributionsResponse.data ||
        [];

      setMembers(
        Array.isArray(membersData)
          ? membersData
          : []
      );

      setContributionTypes(
        Array.isArray(typesData)
          ? typesData
          : []
      );

      setContributions(
        Array.isArray(contributionsData)
          ? contributionsData
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load contribution data:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load contribution data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // GET MEMBER NAME
  // =====================================================

  const getMemberName = (memberId) => {
    if (!Array.isArray(members)) {
      return "Unknown member";
    }

    const member = members.find(
      (item) =>
        Number(item.id) === Number(memberId)
    );

    return member
      ? `${member.first_name || ""} ${
          member.last_name || ""
        }`.trim()
      : "Unknown member";
  };

  // =====================================================
  // CONTRIBUTION TYPE
  // =====================================================

  const getContributionTypeName = (typeId) => {
    if (!Array.isArray(contributionTypes)) {
      return "Unknown contribution";
    }

    const type = contributionTypes.find(
      (item) =>
        Number(item.id) === Number(typeId)
    );

    return type?.name || "Unknown contribution";
  };

  // =====================================================
  // RECORDER
  // =====================================================

  const getRecorderName = (contribution) => {
    if (
      user &&
      Number(contribution.recorded_by) ===
        Number(user.id)
    ) {
      return (
        `${user.first_name || ""} ${
          user.last_name || ""
        }`.trim() || "Administrator"
      );
    }

    if (contribution.recorded_by_details) {
      return (
        `${contribution.recorded_by_details.first_name || ""} ${
          contribution.recorded_by_details.last_name || ""
        }`.trim()
      );
    }

    return "Administrator";
  };

  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {
    if (!formData.first_name.trim()) {
      return "Please enter the member's first name.";
    }

    if (!formData.last_name.trim()) {
      return "Please enter the member's last name.";
    }

    if (!formData.contribution_type) {
      return "Please select a contribution type.";
    }

    if (!formData.amount) {
      return "Please enter the contribution amount.";
    }

    if (Number(formData.amount) <= 0) {
      return "Amount must be greater than zero.";
    }

    if (!formData.contribution_date) {
      return "Please select a contribution date.";
    }

    if (!formData.payment_method) {
      return "Please select a payment method.";
    }

    return null;
  };

  // =====================================================
  // CREATE MEMBER
  // =====================================================

  const createMember = async () => {
    const memberPayload = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
    };

    console.log(
      "CREATING MEMBER:",
      memberPayload
    );

    const response = await api.post(
      "members/members/",
      memberPayload
    );

    console.log(
      "MEMBER CREATED:",
      response.data
    );

    return response.data;
  };

  // =====================================================
  // SUBMIT CONTRIBUTION
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      /*
       * STEP 1
       * Create the member first.
       */
      const newMember = await createMember();

      /*
       * Django should return the created member
       * including its ID.
       */
      const memberId = newMember?.id;

      if (!memberId) {
        throw new Error(
          "Member was created but no member ID was returned."
        );
      }

      /*
       * Add the newly created member to our
       * local members list immediately.
       */
      setMembers((prev) => [
        newMember,
        ...prev,
      ]);

      /*
       * STEP 2
       * Create the contribution using
       * the new member ID.
       */
      const payload = {
        member: Number(memberId),

        contribution_type: Number(
          formData.contribution_type
        ),

        amount: Number(
          formData.amount
        ).toFixed(2),

        contribution_date:
          formData.contribution_date,

        payment_method:
          formData.payment_method,
      };

      console.log(
        "POSTING CONTRIBUTION:",
        payload
      );

      const response = await api.post(
        "finances/contributions/",
        payload
      );

      const newContribution =
        response.data;

      setContributions((prev) => [
        newContribution,
        ...prev,
      ]);

      setSuccess(
        `Contribution for ${formData.first_name} ${formData.last_name} recorded successfully.`
      );

      /*
       * Reset form.
       */
      setFormData({
        first_name: "",
        last_name: "",
        member: "",
        contribution_type: "",
        amount: "",
        contribution_date:
          new Date()
            .toISOString()
            .split("T")[0],
        payment_method: "CASH",
      });

      setShowForm(false);
    } catch (err) {
      console.error(
        "Failed to save contribution:",
        err
      );

      const backendError =
        err.response?.data;

      if (
        backendError &&
        typeof backendError === "object"
      ) {
        const errors = Object.values(
          backendError
        );

        if (errors.length > 0) {
          const firstError = errors[0];

          if (Array.isArray(firstError)) {
            setError(firstError[0]);
          } else if (
            typeof firstError === "object"
          ) {
            setError(
              JSON.stringify(firstError)
            );
          } else {
            setError(String(firstError));
          }
        } else {
          setError(
            "Unable to save contribution."
          );
        }
      } else {
        setError(
          err.message ||
            "Unable to save contribution. Please try again."
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
    contributionId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contribution?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(contributionId);
    setError("");

    try {
      await api.delete(
        `finances/contributions/${contributionId}/`
      );

      setContributions((prev) =>
        prev.filter(
          (item) =>
            item.id !== contributionId
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

  // =====================================================
  // FORM RESET
  // =====================================================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setError("");

    setFormData({
      first_name: "",
      last_name: "",
      member: "",
      contribution_type: "",
      amount: "",
      contribution_date:
        new Date()
          .toISOString()
          .split("T")[0],
      payment_method: "CASH",
    });
  };

  // =====================================================
  // FORMATTING
  // =====================================================

  const totalAmount = useMemo(() => {
    return contributions
      .reduce(
        (total, contribution) =>
          total +
          Number(
            contribution.amount || 0
          ),
        0
      )
      .toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  }, [contributions]);

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

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Finance
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Register Contributions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Record and manage member contributions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (showForm) {
                closeForm();
              } else {
                setShowForm(true);
                setError("");
                setSuccess("");
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            {showForm ? (
              <X size={18} />
            ) : (
              <Plus size={18} />
            )}

            {showForm
              ? "Close form"
              : "Add Contribution"}
          </button>
        </div>

        {/* ERROR */}
        {error && !showForm && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>{success}</span>
          </div>
        )}

        {/* STATISTICS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Contributions
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  KES {totalAmount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Banknote size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Contributions Recorded
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {contributions.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <WalletCards size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Registered Members
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {members.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <User size={21} />
              </div>
            </div>
          </div>

        </div>

        {/* =====================================================
            MODAL
        ===================================================== */}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">

            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeForm}
            />

            <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">

              {/* HEADER */}
              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Plus size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      New Contribution
                    </h2>

                    <p className="text-sm text-slate-500">
                      Add the member and contribution details.
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={20} />
                </button>

              </div>

              {/* ERROR */}
              {error && (
                <div className="mx-5 mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6">

                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{error}</span>

                </div>
              )}

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="p-5 sm:p-6"
              >

                <div className="grid gap-5 md:grid-cols-2">

                  {/* =================================================
                      NEW MEMBER
                  ================================================= */}

                  <div className="md:col-span-2">

                    <div className="mb-3 flex items-center gap-2">
                      <User
                        size={18}
                        className="text-emerald-600"
                      />

                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          Member Details
                        </h3>

                        <p className="text-xs text-slate-400">
                          Enter the member who is making this contribution.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      {/* FIRST NAME */}
                      <div>

                        <label
                          htmlFor="first_name"
                          className="mb-2 block text-sm font-medium text-slate-700"
                        >
                          First Name
                        </label>

                        <input
                          id="first_name"
                          name="first_name"
                          type="text"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="Enter first name"
                          autoComplete="given-name"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />

                      </div>

                      {/* LAST NAME */}
                      <div>

                        <label
                          htmlFor="last_name"
                          className="mb-2 block text-sm font-medium text-slate-700"
                        >
                          Last Name
                        </label>

                        <input
                          id="last_name"
                          name="last_name"
                          type="text"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Enter last name"
                          autoComplete="family-name"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />

                      </div>

                    </div>

                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
                      <CheckCircle2 size={16} />

                      <span>
                        A new member record will be created automatically when you save this contribution.
                      </span>
                    </div>

                  </div>

                  {/* CONTRIBUTION TYPE */}
                  <div>

                    <label
                      htmlFor="contribution_type"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Contribution Type
                    </label>

                    <div className="relative">

                      <select
                        id="contribution_type"
                        name="contribution_type"
                        value={
                          formData.contribution_type
                        }
                        onChange={handleChange}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      >
                        <option value="">
                          Select contribution type
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

                      <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-14 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />

                    </div>

                  </div>

                  {/* DATE */}
                  <div>

                    <label
                      htmlFor="contribution_date"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Contribution Date
                    </label>

                    <div className="relative">

                      <CalendarDays
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="contribution_date"
                        name="contribution_date"
                        type="date"
                        value={
                          formData.contribution_date
                        }
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
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
                        onChange={handleChange}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      >
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

                      <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                    </div>

                  </div>

                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
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
                        Save Contribution
                      </>
                    )}
                  </button>

                </div>

              </form>
            </div>
          </div>
        )}

        {/* =====================================================
            CONTRIBUTIONS
        ===================================================== */}

        <div>

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Contributions
              </h2>

              <p className="text-sm text-slate-500">
                Contributions recorded in the system.
              </p>
            </div>

            <button
              type="button"
              onClick={loadData}
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

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-52 animate-pulse rounded-2xl bg-white"
                />
              ))}

            </div>
          ) : contributions.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <WalletCards size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No contributions yet
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Start by adding the first contribution.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowForm(true)
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <Plus size={17} />
                Add Contribution
              </button>

            </div>

          ) : (

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {contributions.map(
                (contribution) => (
                  <ContributionCard
                    key={contribution.id}
                    contribution={contribution}
                    contributionType={getContributionTypeName(
                      contribution.contribution_type
                    )}
                    memberName={getMemberName(
                      contribution.member
                    )}
                    recorderName={getRecorderName(
                      contribution
                    )}
                    formatAmount={
                      formatAmount
                    }
                    formatDate={
                      formatDate
                    }
                    onDelete={
                      handleDelete
                    }
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
    </div>
  );
};


// =====================================================
// CONTRIBUTION CARD
// =====================================================

const ContributionCard = ({
  contribution,
  contributionType,
  memberName,
  recorderName,
  formatAmount,
  formatDate,
  onDelete,
  deleting,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="absolute left-0 top-0 h-1 w-full bg-emerald-500" />

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <WalletCards size={21} />
          </div>

          <div>

            <p className="text-sm font-semibold text-slate-900">
              {contributionType}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              #{contribution.id}
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            onDelete(contribution.id)
          }
          disabled={deleting}
          className="rounded-lg p-2 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
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

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">

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
              {memberName}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

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

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          {contribution.payment_method}
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

export default RegisterContributions;
