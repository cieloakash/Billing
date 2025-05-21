import React, { useEffect } from "react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuth.store";
import { useNavigate } from "react-router-dom";


const Login = () => {

  const {isLoggingIn,login ,authUser} = useAuthStore()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const nvigator = useNavigate()

  const handleForm = (e) => {
    e.preventDefault();
    login(formData)
  };

  useEffect(()=>{
    if(authUser!== null){
      nvigator("/")
      
    }
  },[authUser])

  
  return (
    <div className="flex items-center justify-center flex-col bg-gray-100 min-h-screen">
         <h2 className="text-lg font-bold mb-4">Bill</h2>
      <div className="bg-white p-8 rounded shadow-md max-w-sm w-full">
       
        <form onSubmit={handleForm}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              UserName
            </label>
            <input
              type="text"
              placeholder="username"
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-300"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="password"
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-300"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
