import express from "express";
import { login, logout, signup } from "../controllers/auth.controllers.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

export default userRouter;
