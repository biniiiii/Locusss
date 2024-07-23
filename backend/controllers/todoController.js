const Todo = require("../models/todoModel");

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json(todo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createTodo = async (req, res) => {
    const todo = new Todo({
        title: req.body.title,
        description: req.body.description,
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json(todo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json({ message: "Todo deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
};