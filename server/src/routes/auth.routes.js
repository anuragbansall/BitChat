import express from "express";
import {
  getProfile,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/profile", authenticate, getProfile);

export default authRouter;
