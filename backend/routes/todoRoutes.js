const express = require("express");
const router = express.Router();
const { createTodo, getTodos, getTodoById, deleteTodo, updateTodo } = require("../controllers/todoController");

router.route("/")
    .get(getTodos)
    .post(createTodo);

router.route("/:id")
    .get(getTodoById)
    .put(updateTodo)
    .delete(deleteTodo);

module.exports = router;