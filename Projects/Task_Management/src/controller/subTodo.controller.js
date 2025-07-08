import { SubTodo } from "../models/sub_Todo.models.js";

// Create SubTodo
export const createSubTodo = async (req, res) => {
  try {
    const { title, createdBy } = req.body;
    const subTodo = await SubTodo.create({ title, createdBy });
    res.status(201).json({ message: "SubTodo created", subTodo });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating SubTodo", error: err.message });
  }
};

// Get all SubTodos
export const getAllSubTodos = async (req, res) => {
  try {
    const subTodos = await SubTodo.find().populate("createdBy", "name email");
    res.status(200).json(subTodos);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching SubTodos", error: err.message });
  }
};

// Update SubTodo
export const updateSubTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await SubTodo.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Updated", updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating SubTodo", error: err.message });
  }
};

// Delete SubTodo
export const deleteSubTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await SubTodo.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting SubTodo", error: err.message });
  }
};
