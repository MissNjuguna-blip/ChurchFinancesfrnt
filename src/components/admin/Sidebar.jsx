import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {

  const linkClass = ({ isActive }) =>
    `group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-black text-white border-l-4 border-emerald-500 shadow-lg shadow-black/20"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <>

      {/* ================================= */}
      {/* MOBILE OVERLAY */}
      {/* ================================= */}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="
            fixed
            inset-0
            bg-black/60
            backdrop-blur-sm
            z-40
            md:hidden
          "
        />
      )}


      {/* ================================= */}
      {/* SIDEBAR */}
      {/* ================================= */}

      <aside
        className={`
          z-50
          min-h-screen
          w-64
          flex-shrink-0

          bg-slate-950

          text-white
          shadow-2xl

          flex
          flex-col

          transition-transform
          duration-300

          ${
            isOpen
              ? "fixed inset-y-0 left-0 translate-x-0"
              : "fixed inset-y-0 left-0 -translate-x-full"
          }

          md:static
          md:translate-x-0
        `}
      >


        {/* ================================= */}
        {/* BRAND */}
        {/* ================================= */}

        <div className="px-5 py-6 border-b border-white/10">

          <div className="flex items-center gap-3">

            {/* Logo */}

            <div
              className="
                w-11
                h-11
                rounded-xl

                bg-gradient-to-br
                from-emerald-400
                to-emerald-600

                flex
                items-center
                justify-center

                shadow-lg
                shadow-emerald-500/20

                flex-shrink-0
              "
            >

              <span className="text-lg font-black text-white">
                DC
              </span>

            </div>


            {/* Brand */}

            <div>

              <h2 className="text-xl font-bold tracking-tight text-white">
                DC Finance
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Financial Management
              </p>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* NAVIGATION */}
        {/* ================================= */}

        <div className="flex-1 px-4 py-6 overflow-y-auto">

          {/* Menu title */}

          <p
            className="
              px-3
              mb-3

              text-[11px]
              font-semibold
              uppercase
              tracking-widest

              text-slate-600
            "
          >
            Main Menu
          </p>


          <nav className="space-y-2">


            {/* =================================
                DASHBOARD
            ================================= */}

            <NavLink
              to="/admin-dashboard"
              end
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >

              <span
                className="
                  w-9
                  h-9
                  rounded-lg

                  flex
                  items-center
                  justify-center

                  bg-white/5

                  text-slate-400

                  group-hover:bg-emerald-500/10
                  group-hover:text-emerald-400
                "
              >

                <i className="bi bi-grid-1x2-fill"></i>

              </span>


              <span className="font-medium">
                Dashboard
              </span>

            </NavLink>


            {/* =================================
                REGISTER MEMBERS
            ================================= */}

            <NavLink
              to="/admin-dashboard/register-contributions"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >

              <span
                className="
                  w-9
                  h-9
                  rounded-lg

                  flex
                  items-center
                  justify-center

                  bg-white/5

                  text-slate-400

                  group-hover:bg-emerald-500/10
                  group-hover:text-emerald-400
                "
              >

                <i className="bi bi-clipboard-plus-fill"></i>

              </span>


              <span className="font-medium">
                Contributions
              </span>

            </NavLink>


            {/* =================================
                REGISTER PAYMENTS
            ================================= */}

            <NavLink
              to="/admin-dashboard/view-contributions"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >

              <span
                className="
                  w-9
                  h-9
                  rounded-lg

                  flex
                  items-center
                  justify-center

                  bg-white/5

                  text-slate-400

                  group-hover:bg-emerald-500/10
                  group-hover:text-emerald-400
                "
              >
                <i className="bi bi-cash-coin"></i>
              </span>
              <span className="font-medium">
                View Contributions
              </span>

            </NavLink>
            {/* =================================
                VIEW MEMBERS
            ================================= */}

            <NavLink
              to="/admin-dashboard/register-expenses"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >

              <span
                className="
                  w-9
                  h-9
                  rounded-lg

                  flex
                  items-center
                  justify-center

                  bg-white/5

                  text-slate-400

                  group-hover:bg-emerald-500/10
                  group-hover:text-emerald-400
                "
              >
                <i className="bi bi-file-earmark-plus-fill"></i>
              </span>
              <span className="font-medium">
                Expenses
              </span>
            </NavLink>
            {/* =================================
                VIEW PAYMENTS
            ================================= */}

            <NavLink
              to="/admin-dashboard/view-expenses"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >

              <span
                className="
                  w-9
                  h-9
                  rounded-lg

                  flex
                  items-center
                  justify-center

                  bg-white/5

                  text-slate-400

                  group-hover:bg-emerald-500/10
                  group-hover:text-emerald-400
                "
              >

                <i className="bi bi-list-check"></i>

              </span>


              <span className="font-medium">
                View Expenses
              </span>

            </NavLink>
            <div className="border-t border-white/10 my-5"></div>
            
            <NavLink
              to="/admin-dashboard/view-auditlogs"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              <span
                className="
                  w-9
                  h-9
                  rounded-lg

                  flex
                  items-center
                  justify-center

                  bg-white/5

                  text-slate-400

                  group-hover:bg-emerald-500/10
                  group-hover:text-emerald-400
                "
              >

                <i className="bi bi-journal-bookmark-fill"></i>

              </span>


              <span className="font-medium">
                Records
              </span>

            </NavLink>

          </nav>

        </div>


        {/* ================================= */}
        {/* ADMIN FOOTER */}
        {/* ================================= */}

        <div className="p-4 border-t border-white/10">

          <div
            className="
              flex
              items-center
              gap-3

              px-3
              py-3

              rounded-xl

              bg-white/5

              border
              border-white/5
            "
          >

            {/* Avatar */}

            <div
              className="
                w-9
                h-9
                rounded-full
                bg-emerald-500
                flex
                items-center
                justify-center
                shadow-md
                shadow-emerald-500/20
                flex-shrink-0
              "
            >
              <i className="bi bi-person-fill"></i>
            </div>
            {/* User */}
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-white">
                Administrator
              </p>
              <p className="text-xs text-slate-500">
                Admin account
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
