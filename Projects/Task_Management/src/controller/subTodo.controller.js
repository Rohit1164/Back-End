import { SubTodo } from "../models/sub_Todo.models.js";

// ✅ Create SubTodo
export const createSubTodo = async (req, res) => {
  try {
    const { title, createdBy } = req.body;

    if (!title || !createdBy) {
      return res.status(400).json({
        message: "Title and createdBy are required",
      });
    }

    if (!createdBy.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid createdBy ObjectId",
      });
    }

    // ✅ Create new subTodo
    const subTodos = await SubTodo.create({ title, createdBy });

    res.redirect("/subTodo", { user: req.user, subTodos });
  } catch (err) {
    res.status(500).json({
      message: "Error creating SubTodo",
      error: err.message,
    });
  }
};

// ✅ Get all SubTodos and render page
export const getAllSubTodos = async (req, res) => {
  try {
    const subTodos = await SubTodo.find()
      .populate("createdBy", "username email") // Use correct user fields
      .lean(); // Optimization for EJS

    res.render("subTodo", {
      user: req.user || null,
      subTodos,
    });
  } catch (err) {
    res.status(500).render("error", {
      message: "Error fetching SubTodos: " + err.message,
    });
  }
};

// ✅ Update SubTodo
export const updateSubTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await SubTodo.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.redirect("/subtodos");
  } catch (err) {
    res.status(500).json({
      message: "Error updating SubTodo",
      error: err.message,
    });
  }
};

// ✅ Delete SubTodo
export const deleteSubTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await SubTodo.findByIdAndDelete(id);

    res.redirect("/subtodos");
  } catch (err) {
    res.status(500).json({
      message: "Error deleting SubTodo",
      error: err.message,
    });
  }
};
