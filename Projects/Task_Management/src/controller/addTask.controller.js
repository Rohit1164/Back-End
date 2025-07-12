import { Todo } from "../models/Todo.models.js";

//Create a new Todo
export const createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const createdBy = req.session.user?._id;

    if (!title || !description || !priority) {
      return res
        .status(400)
        .send("Title, description and priority are required");
    }

    await Todo.create({
      title,
      description,
      priority,
      dueDate,
      createdBy,
    });

    res.redirect("/task");
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
};

//Get all Todos
export const getTodos = async (req, res) => {
  try {
    const user = req.session?.user;

    if (!user || !user._id) {
      return res.status(401).render("todos", {
        message: "Please log in to view your tasks",
        todos: [],
      });
    }

    const todos = await Todo.find({ createdBy: user._id })
      .populate("createdBy", "username email")
      .populate("subTodos");

    return res.status(200).render("todos", {
      todos,
      message: null,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return res.status(500).render("todos", {
      message: "Server error: " + error.message,
      todos: [],
    });
  }
};

//Get single Todo by ID
export const getTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
      .populate("createdBy")
      .populate("subTodos");

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.status(200).render("todo", { todo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Update Todo
export const updateTodo = async (req, res) => {
  try {
    const { title, description, complete } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, complete },
      { new: true }
    );

    if (!updatedTodo)
      return res.status(404).json({ message: "Todo not found" });

    res.status(200).redirect("/task");
    // json(updatedTodo);
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

    res.status(200).redirect("/");
    // json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const editTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  res.render("editTodo", { todo });
};
export const renderCreateTodoForm = (req, res) => {
  res.render("createTodo");
};
