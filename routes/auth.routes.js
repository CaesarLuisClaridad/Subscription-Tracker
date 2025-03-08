import { Router } from "express";
import { Signin, Signup, Logout } from "../controller/auth.js";

const authRoutes = Router();

//Signup
authRoutes.post('/signup', Signup)

//Signin
authRoutes.post('/signin', Signin)

//Logout
authRoutes.post('/logout', Logout)

export default authRoutes;