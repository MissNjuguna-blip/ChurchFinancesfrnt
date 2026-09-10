import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  WalletCards,
  Users,
  CheckCircle2,
  UserPlus,
} from "lucide-react";
import api from "./context/api/api";

// import api from "../api"; // adjust path if needed


const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =====================================================
  // HANDLE INPUT CHANGE
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
  // VALIDATION
  // =====================================================

  const validateForm = () => {

    if (!formData.first_name.trim()) {
      return "First name is required.";
    }

    if (!formData.last_name.trim()) {
      return "Last name is required.";
    }

    if (!formData.phone_number.trim()) {
      return "Phone number is required.";
    }
    if (!formData.password) {
      return "Password is required.";
    }

    if (formData.password !== formData.confirm_password) {
      return "Passwords do not match.";
    }

    return null;
  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    // Validate
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {

      // =================================================
      // SEND REQUEST THROUGH AXIOS INSTANCE
      // =================================================

      const response = await api.post(
        "core/auth/register/",
        {
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          phone_number: formData.phone_number.trim(),
          password: formData.password,
        }
      );


      // =================================================
      // SUCCESS
      // =================================================

      console.log(
        "Registration response:",
        response.data
      );

      setSuccess(
        response.data?.message ||
        "Account created successfully!"
      );


      // =================================================
      // CLEAR FORM
      // =================================================

      setFormData({
        first_name: "",
        last_name: "",
        phone_number: "",
        password: "",
        confirm_password: "",
      });


      // =================================================
      // REDIRECT TO LOGIN
      // =================================================

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1000);

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );
      if (error.response) {
        const data = error.response.data;
        setError(
          data?.error ||
          data?.detail ||
          "Registration failed. Please try again."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to the server. Please check your connection."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950">
        {/* Decorative background */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <WalletCards size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                DC Toll
              </h1>
              <p className="text-xs text-slate-400">
                Financial Management
              </p>
            </div>
          </div>
          {/* MAIN CONTENT */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-300 backdrop-blur">
              <ShieldCheck size={16} />
              Secure financial management
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-white">
              Manage your finances with
              <span className="text-emerald-400">
                {" "}clarity.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Keep track of members, contributions and
              expenses from one simple and secure dashboard.
            </p>
            {/* FEATURES */}
            <div className="mt-10 space-y-5">
              <Feature
                icon={<WalletCards size={19} />}
                title="Track contributions"
                description="Know exactly how much has been collected."
              />
              <Feature
                icon={<Users size={19} />}
                title="Manage members"
                description="Keep your membership information organized."
              />
              <Feature
                icon={<ShieldCheck size={19} />}
                title="Secure access"
                description="Your financial data stays protected."
              />
            </div>
          </div>
          {/* FOOTER */}
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} FundFlow.
            All rights reserved.
          </p>
        </div>
      </div>
      {/* =====================================================
          RIGHT FORM SECTION
      ====================================================== */}
      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* MOBILE LOGO */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <WalletCards size={21} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">
                FundFlow
              </h1>
              <p className="text-xs text-slate-500">
                Financial Management
              </p>
            </div>
          </div>
          {/* HEADER */}
          <div className="mb-8">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <UserPlus size={20} />
            </div>
            <p className="mb-2 text-sm font-semibold text-emerald-600">
              GET STARTED
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create an administrator account to manage
              your organization.
            </p>

          </div>


          {/* =================================================
              ERROR
          ================================================== */}

          {error && (

            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

              {error}

            </div>

          )}


          {/* =================================================
              SUCCESS
          ================================================== */}

          {success && (

            <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">

              <CheckCircle2 size={18} />

              {success}

            </div>

          )}


          {/* =================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >


            {/* NAMES */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <Input
                label="First name"
                name="first_name"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                autoComplete="given-name"
              />

              <Input
                label="Last name"
                name="last_name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                autoComplete="family-name"
              />

            </div>


            {/* PHONE */}

            <div>

              <label
                htmlFor="phone_number"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Phone number
              </label>


              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">

                <div className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600">

                  🇰🇪 +254

                </div>


                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="0712345678"
                  value={formData.phone_number}
                  onChange={handleChange}
                  autoComplete="tel"
                  className="w-full border-0 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />

              </div>


              <p className="mt-1.5 text-xs text-slate-400">
                Example: 0712345678
              </p>

            </div>


            {/* PASSWORD */}

            <PasswordInput
              label="Password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />


            {/* CONFIRM PASSWORD */}

            <PasswordInput
              label="Confirm password"
              name="confirm_password"
              placeholder="Repeat your password"
              value={formData.confirm_password}
              onChange={handleChange}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
            />


            {/* PASSWORD REQUIREMENTS */}

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">

                Password requirements

              </p>


              <div className="grid grid-cols-2 gap-2 text-xs">

                <PasswordRequirement
                  valid={formData.password.length >= 8}
                  text="8+ characters"
                />

                <PasswordRequirement
                  valid={/[A-Z]/.test(formData.password)}
                  text="Uppercase letter"
                />

                <PasswordRequirement
                  valid={/[0-9]/.test(formData.password)}
                  text="Number"
                />

                <PasswordRequirement
                  valid={
                    formData.password.length > 0 &&
                    formData.password ===
                      formData.confirm_password
                  }
                  text="Passwords match"
                />

              </div>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (

                <>

                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Creating account...

                </>

              ) : (

                <>

                  Create account

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </>

              )}

            </button>

          </form>


          {/* LOGIN */}

          <p className="mt-8 text-center text-sm text-slate-500">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Sign in
            </Link>

          </p>


          {/* SECURITY */}

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">

            <ShieldCheck size={15} />

            Your information is securely protected

          </div>

        </div>

      </div>

    </div>
  );
};


/* =========================================================
   INPUT
========================================================= */

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
}) => {

  return (

    <div>

      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>


      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      />

    </div>

  );
};


/* =========================================================
   PASSWORD INPUT
========================================================= */

const PasswordInput = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  showPassword,
  setShowPassword,
}) => {

  return (

    <div>

      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>


      <div className="relative">

        <input
          id={name}
          name={name}
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />


        <button
          type="button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >

          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}

        </button>

      </div>

    </div>

  );
};


/* =========================================================
   PASSWORD REQUIREMENT
========================================================= */

const PasswordRequirement = ({
  valid,
  text,
}) => {

  return (

    <div
      className={`flex items-center gap-2 ${
        valid
          ? "text-emerald-600"
          : "text-slate-400"
      }`}
    >

      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full ${
          valid
            ? "bg-emerald-100"
            : "bg-slate-200"
        }`}
      >

        {valid && (
          <CheckCircle2 size={12} />
        )}

      </div>

      {text}

    </div>

  );
};


/* =========================================================
   FEATURE
========================================================= */

const Feature = ({
  icon,
  title,
  description,
}) => {

  return (

    <div className="flex gap-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-emerald-400">

        {icon}

      </div>


      <div>

        <h3 className="font-medium text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>

      </div>

    </div>

  );
};


export default SignUp;
