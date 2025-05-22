import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuth.store.js";
import Header from "./Header.jsx";
import { useFormStore } from "../store/useForm.store.js";
import InvoiceForm from "./InvoiceForm.jsx";
const AppLayout = () => {
const {authUser} = useAuthStore()
const {isFormOpen} = useFormStore()

  return (
    <div className="min-h-screen">
      <div className="container md:px-6 md:py-4 mx-auto  ">
        {authUser && <Header/>}
      {isFormOpen && <InvoiceForm/>}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
