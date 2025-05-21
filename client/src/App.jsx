import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "./App.css";
import AppLayout from "./component/AppLayout.jsx";
import Login from "./pages/Login.jsx";
import { useAuthStore } from "./store/useAuth.store.js";
import { Loader } from "lucide-react";
import Homepage from "./pages/Homepage.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  const [authenticated , setauthenticated]=useState(false);

  useEffect(() => {
    console.log("uf")
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }


  const routerDom = createBrowserRouter([
    {
      element: <AppLayout />,
      errorElement: <div>Something went wrong!</div>, 
      children: [
        {
          path: "/",
          element: authUser ? <Homepage /> : <Navigate to="/login" />,
        },
        {
          path: "/login",
          element: !authUser ? <Login /> : <Navigate to="/"  />,
        },
        {
          path: "*",
          element: <Navigate to={authUser ? "/" : "/login"} replace />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routerDom} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;