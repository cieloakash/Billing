import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const BASE_URL = "https://billing-rp6k.onrender.com";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  login:async(data)=>{
    set({isLoggingIn:true});
    try {
      const res = await axiosInstance.post("/auth/login",data);
      set({ authUser: res.data });
      toast.success("Logged in sucessfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }finally {
      set({ isLoggingIn: false });
    }
  }
}));
