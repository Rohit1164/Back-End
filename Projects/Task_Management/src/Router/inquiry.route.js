import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  return res.render("home");
});

router.get("/privacy", (req, res) => {
  return res.render("privacy");
});

router.get("/about", (req, res) => {
  return res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact", { successMessage: null });
});

router.post("/contact", (req, res) => {
  const { to_email, from_email, message } = req.body;

  res.render("contact", {
    successMessage: "Form submitted successfully!",
  });
});

export default router;
