import React,{useEffect} from 'react'
import { useAuthStore } from '../store/useAuth.store.js';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const {isCheckingAuth,authUser} = useAuthStore()
  const navigate = useNavigate()
  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      navigate("/login", { replace: true });
    }
  }, [authUser, isCheckingAuth, navigate]);
  return (
    <div>Homepage</div>
  )
}

export default Homepage