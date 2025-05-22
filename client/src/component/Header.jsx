import React, { useState, useEffect } from "react";

import { CiFilter } from "react-icons/ci";
import { CiSquarePlus } from "react-icons/ci";
import { IoMenu, IoCloseSharp } from "react-icons/io5";
import { FiUserPlus } from "react-icons/fi";
// import { IoCloseSharp } from "react-icons/io5";
import { useFormStore } from "../store/useForm.store.js";
import { useAuthStore } from "../store/useAuth.store.js";
import { useNavigate } from "react-router-dom";

const Status = ["all", "draft", "paid", "pending"];

const Header = () => {
  const navigate = useNavigate();
  const { toggleForm, invoices, filter } = useFormStore();
  const { authUser, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = async () => {
    const success = await logout();
    if (success.status === 200) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="bg-slate-700 p-3 md:rounded-lg sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Left Side - Always Visible */}
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-red-400 flex-shrink-0"></div>
          <h3 className="ml-2 px-3 py-1 bg-violet-500 rounded-full text-white">
            {authUser?.username || "User"}
          </h3>
        </div>

        {/* Right Side - Hamburger and Actions */}
        <div className="flex items-center">
          {/* Desktop Actions (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-3">
            {authUser?.role === "admin" ? (
              <button
                type="button"
                className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 flex items-center space-x-2 rounded-full transition-all duration-200 hover:scale-105"
              >
                <div className="bg-white rounded-full p-1.5">
                  <FiUserPlus size={16} className="text-black" />
                </div>
                <span>Create User</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={toggleForm}
                className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 flex items-center space-x-2 rounded-full transition-all duration-200 hover:scale-105"
              >
                <div className="bg-white rounded-full p-1.5">
                  <CiSquarePlus size={16} className="text-black" />
                </div>
                <span>New Invoice</span>
              </button>
            )}
            {authUser && (
              <button
                type="button"
                onClick={handleLogout}
                className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Hamburger (visible on mobile) */}
          <button
            className="md:hidden ml-3 text-white p-1 rounded-md hover:bg-slate-600 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? <IoCloseSharp size={24} /> : <IoMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (appears below header) */}
      {menuOpen && (
        <div className="md:hidden bg-slate-700 mt-2 p-3 md:rounded-lg space-y-2">
          {authUser?.role === "admin" ? (
            <button
              type="button"
              className="w-full bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 flex items-center space-x-2 rounded-full transition-all duration-200"
            >
              <div className="bg-white rounded-full p-1.5">
                <FiUserPlus size={16} className="text-black" />
              </div>
              <span>Create User</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleForm}
              className="w-full bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 flex items-center justify-center space-x-2 rounded-full transition-all duration-200"
            >
              <div className="bg-white rounded-full p-1.5">
                <CiSquarePlus size={16} className="text-black" />
              </div>
              <span>New Invoice</span>
            </button>
          )}
          {authUser && (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-full transition-all duration-200"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
