import express from "express"
import { register,login, logout,checkAuth } from "../controller/auth.controller.js"
import { protectedRoute } from "../middleware/auth.middleware.js"
// "admin", "sales", "logistic"],
const authRoute = express.Router()

authRoute.post('/register',register)
authRoute.post('/login',login)
authRoute.post('/logout',logout)

authRoute.get('/check',protectedRoute(["admin", "sales", "logistic"]),checkAuth)
export default authRoute



