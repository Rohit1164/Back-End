import { Router } from "express";
import {
  loginUser,
  logout,
  registerUser,
} from "../controller/user.controller.js";

const router = Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);

export default router;
