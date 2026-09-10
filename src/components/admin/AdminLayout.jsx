import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 bg-white">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">

          {/* MOBILE HEADER */}
          <header className="md:hidden sticky top-0 z-30 h-16 bg-white border-b border-slate-200">

            <div className="h-full px-4 flex items-center">

              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center"
              >
                <i className="bi bi-list text-xl"></i>
              </button>

              <div className="ml-3">
                <h1 className="font-bold text-slate-800">
                  DC Finance
                </h1>

                <p className="text-xs text-slate-400">
                  Finance Management System
                </p>
              </div>

            </div>

          </header>

          {/* PAGE */}
          <main className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>

        </div>

      </div>

    </div>
  );
};

export default AdminLayout;