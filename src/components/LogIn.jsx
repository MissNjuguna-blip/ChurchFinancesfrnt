import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  WalletCards,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";

// import api from "../api";
import { AuthContext } from "../components/context/AuthContext";
import api from "./context/api/api";


const Login = () => {
  const navigate = useNavigate();

  const { setToken, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    phone_number: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // =====================================================
  // HANDLE INPUT
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
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {
    if (!formData.password) {
      return "Password is required.";
    }
    return null;
  };

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
      // LOGIN REQUEST
      // =================================================

      const response = await api.post(
        "core/login/",
        {
          phone_number: formData.phone_number.trim(),
          password: formData.password,
        }
      );


      const data = response.data;


      console.log(
        "Login response:",
        data
      );


      // =================================================
      // CHECK RESPONSE
      // =================================================

      if (!data.access_token) {
        throw new Error(
          "Login successful, but no access token was returned."
        );
      }


      // =================================================
      // SAVE AUTHENTICATION STATE
      // =================================================

      setToken(data.access_token);

      setUser(data.user);


      // =================================================
      // SAVE REFRESH TOKEN
      // =================================================

      localStorage.setItem(
        "refresh",
        data.refresh
      );


      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(
        data.message ||
        "Login successful!"
      );


      // =================================================
      // REDIRECT
      // =================================================

      setTimeout(() => {

        navigate("/admin-dashboard", {
          replace: true,
        });

      }, 700);


    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      // =================================================
      // DJANGO ERROR
      // =================================================

      if (error.response) {

        const data = error.response.data;

        setError(
          data?.error ||
          data?.detail ||
          "Invalid phone number or password."
        );

      }

      // =================================================
      // SERVER NOT REACHABLE
      // =================================================

      else if (error.request) {

        setError(
          "Unable to connect to the server. Please check your connection."
        );

      }

      // =================================================
      // OTHER ERROR
      // =================================================

      else {

        setError(
          error.message ||
          "Something went wrong. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="min-h-screen bg-slate-50 flex">


      {/* =====================================================
          LEFT BRANDING
      ====================================================== */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950">

        {/* Background decoration */}

        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />


        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">


          {/* =================================================
              LOGO
          ================================================== */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">

              <WalletCards size={24} />

            </div>


            <div>

              <h1 className="text-xl font-bold text-white">
                FundFlow
              </h1>

              <p className="text-xs text-slate-400">
                Financial Management
              </p>

            </div>

          </div>


          {/* =================================================
              MAIN MESSAGE
          ================================================== */}

          <div className="max-w-xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-300 backdrop-blur">

              <ShieldCheck size={16} />

              Secure financial management

            </div>


            <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-white">

              Welcome back.

              <span className="block text-emerald-400">
                Your finances await.
              </span>

            </h2>


            <p className="mt-6 text-lg leading-8 text-slate-400">

              Access your financial dashboard and
              stay on top of contributions, members
              and expenses.

            </p>


            {/* SECURITY CARD */}

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

              <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">

                  <LockKeyhole size={20} />

                </div>


                <div>

                  <h3 className="font-semibold text-white">
                    Secure access
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-400">

                    Your account is protected using
                    secure authentication and encrypted
                    access tokens.

                  </p>

                </div>

              </div>

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
          RIGHT LOGIN FORM
      ====================================================== */}

      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">

        <div className="w-full max-w-md">


          {/* =================================================
              MOBILE LOGO
          ================================================== */}

          <div className="mb-10 flex items-center gap-3 lg:hidden">

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


          {/* =================================================
              HEADER
          ================================================== */}

          <div className="mb-8">

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

              <LockKeyhole size={21} />

            </div>


            <p className="mb-2 text-sm font-semibold text-emerald-600">
              WELCOME BACK
            </p>


            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Sign in to your account
            </h2>


            <p className="mt-2 text-sm leading-6 text-slate-500">

              Enter your phone number and password
              to access your dashboard.

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


            {/* =================================================
                PHONE
            ================================================== */}

            <div>

              <label
                htmlFor="phone_number"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Phone number
              </label>


              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">


                {/* COUNTRY */}

                <div className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600">

                  🇰🇪 +254

                </div>


                {/* PHONE INPUT */}

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


            {/* =================================================
                PASSWORD
            ================================================== */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>


                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Forgot password?
                </Link>

              </div>


              <div className="relative">

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
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


            {/* =================================================
                REMEMBER ME
            ================================================== */}

            <div className="flex items-center">

              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">

                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />

                Remember me

              </label>

            </div>


            {/* =================================================
                LOGIN BUTTON
            ================================================== */}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-emerald-600/30 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (

                <>

                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Signing in...

                </>

              ) : (

                <>

                  Sign in

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </>

              )}

            </button>

          </form>


          {/* =================================================
              SIGN UP
          ================================================== */}

          <p className="mt-8 text-center text-sm text-slate-500">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Create an account
            </Link>

          </p>


          {/* =================================================
              SECURITY
          ================================================== */}

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">

            <ShieldCheck size={15} />

            Secure and encrypted authentication

          </div>

        </div>

      </div>

    </div>
  );
};


export default Login;
