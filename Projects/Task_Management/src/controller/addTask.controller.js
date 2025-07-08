import { Todo } from "../models/Todo.models.js";

//Create a new Todo
export const createTodo = async (req, res) => {
  try {
    const { title, createdBy, description, dueDate, priority } = req.body;

    if (!title || !createdBy || !description || !priority) {
      return res
        .status(400)
        .json({ message: "Title , description and createdBy are required" });
    }

    const todo = await Todo.create({
      title,
      createdBy,
      description,
      priority,
      dueDate,
    });
    res.status(201).json({ todo, complete: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Get all Todos
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().populate("createdBy").populate("subTodos");
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Get single Todo by ID
export const getTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
      .populate("createdBy")
      .populate("subTodos");

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Update Todo
export const updateTodo = async (req, res) => {
  try {
    const { title, complete } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, complete },
      { new: true }
    );

    if (!updatedTodo)
      return res.status(404).json({ message: "Todo not found" });

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Delete Todo
export const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo)
      return res.status(404).json({ message: "Todo not found" });

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
