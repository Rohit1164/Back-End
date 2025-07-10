import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  renderCreateTodoForm,
  updateTodo,
} from "../controller/addTask.controller.js";
import { isAuthenticated } from "../middleware/isAuthentic.middleware.js";

const router = express.Router();

router.get("/add-task", renderCreateTodoForm); // Static
router.post("/addTask", isAuthenticated, createTodo); // Static

router.get("/", getTodos); // Static root

router.get("/:id", getTodo); // Dynamic — must come after static
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
