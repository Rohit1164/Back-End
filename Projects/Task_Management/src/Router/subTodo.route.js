import express from "express";
import {
  createSubTodo,
  getAllSubTodos,
  updateSubTodo,
  deleteSubTodo,
} from "../controller/subTodo.controller.js";

const router = express.Router();

// Routes
router.post("/", createSubTodo);
router.get("/", getAllSubTodos);
router.put("/:id", updateSubTodo);
router.delete("/:id", deleteSubTodo);

export default router;
