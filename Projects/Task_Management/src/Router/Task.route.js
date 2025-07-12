import express from "express";
import {
  createTodo,
  deleteTodo,
  editTodo,
  getTodo,
  getTodos,
  renderCreateTodoForm,
  updateTodo,
} from "../controller/addTask.controller.js";
import { isAuthenticated } from "../middleware/isAuthentic.middleware.js";

const router = express.Router();

router.get("/add-task", renderCreateTodoForm);
router.post("/addTask", isAuthenticated, createTodo);

router.get("/", getTodos);
router.get("/:id", getTodo);
router.get("/edit/:id", editTodo);

router.post("/update/:id", updateTodo);
router.post("/delete/:id", deleteTodo);

export default router;
