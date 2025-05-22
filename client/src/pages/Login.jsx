import React, { useEffect } from "react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuth.store";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { Loader2, EyeOff, Eye } from "lucide-react";

const Login = () => {
  const { isLoggingIn, login, authUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigator = useNavigate();

  const handleForm = (e) => {
    e.preventDefault();
    login(formData);
  };

  useEffect(() => {
    if (authUser !== null) {
      navigator("/");
    }
  }, [authUser]);

  return (
    <div className="flex items-center justify-center flex-col bg-gray-100 min-h-screen">
      <h2 className="text-lg font-bold mb-4">Bill</h2>
      <div className="bg-white p-8 rounded shadow-md max-w-sm w-full">
        <form onSubmit={handleForm}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              <span className="label-text font-medium">Username</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 pl-3 flex items-center left-0 pointer-events-none">
                <FiUser size={24} />
              </div>
              <input
                type="text"
                placeholder="username"
                className="mt-1 pl-10 p-2 w-full border rounded-md focus:ring focus:ring-blue-300"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 pl-3 flex items-center left-0 pointer-events-none">
                <RiLockPasswordLine size={24} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="......"
                className="mt-1 pl-10 p-2 w-full border rounded-md focus:ring focus:ring-blue-300"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="h-5 w-5 text-base-content/40" />
                ) : (
                  <EyeOff className="h-5 w-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            {isLoggingIn ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading....
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
