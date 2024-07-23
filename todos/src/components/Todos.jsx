import { useState, useEffect } from "react";
import TodoStatusContainer from "./TodoStatusContainer";
import { FaCheck } from "react-icons/fa";
import { FaArrowRotateRight } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import DeleteConfirmation from "./Deleteconfirmation";
import Popup from "./Popup";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoFormData, setNewTodoFormData] = useState({
    title: "",
    description: "",
  });
  const [editTodoFormData, setEditTodoFormData] = useState({
    id: "",
    title: "",
    description: "",
    status: "",
  });
  const [isCreateTodoActive, setIsCreateTodoActive] = useState(false);
  const [isEditTodoActive, setIsEditTodoActive] = useState(false);
  const [deleteTodoID, setDeleteTodoID] = useState(null);
  const [deleteTaskConfirmation, setDeleteTaskConfirmation] = useState(false);

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  // Fetch todos from the backend when the component mounts
  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
      })
      .catch((error) => console.error("Error fetching todos:", error));
  }, [API_URL]);

  // Handler for creating a new todo
  const handleCreateTodo = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodoFormData),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos([...todos, data]);
        setNewTodoFormData({ title: "", description: "" });
        setIsCreateTodoActive(false);
      })
      .catch((error) => console.error("Error creating todo:", error));
  };

  // Handler for editing an existing todo
  const handleEditTodo = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/todos/${editTodoFormData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editTodoFormData),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedTodos = todos.map((todo) =>
          todo.id === editTodoFormData.id ? data : todo
        );
        setTodos(updatedTodos);
        setEditTodoFormData({ id: "", title: "", description: "", status: "" });
        setIsEditTodoActive(false);
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  // Handler for marking a todo as completed
  const handleCheckedTodo = (id) => {
    fetch(`${API_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "completed" }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedTodoList = todos.map((todo) =>
          todo.id === id ? data : todo
        );
        setTodos(updatedTodoList);
      })
      .catch((error) => console.error("Error updating todo status:", error));
  };

  // Handler for deleting a todo
  const handleDeleteTodo = () => {
    fetch(`${API_URL}/todos/${deleteTodoID}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedTodoList = todos.filter(
          (todo) => todo.id !== deleteTodoID
        );
        setTodos(updatedTodoList);
        setDeleteTodoID(null);
        setDeleteTaskConfirmation(false);
      })
      .catch((error) => console.error("Error deleting todo:", error));
  };

  // Function to show delete confirmation popup
  const showDeleteConfirmation = (id) => {
    setDeleteTodoID(id);
    setDeleteTaskConfirmation(true);
  };

  // Function to show edit todo popup
  const showEditTodo = (id) => {
    const selectedTodo = todos.find((todo) => todo.id === id);
    setEditTodoFormData(selectedTodo);
    setIsEditTodoActive(true);
  };

  return (
    <>
      <div id="title" className="text-stone-500 text-4xl font-black my-12">
        Organize your <span className="text-black">To-Dos</span>
      </div>
      <div className="flex space-x-16">
        <TodoStatusContainer
          title="Ongoing"
          todos={todos.filter((todo) => todo.status === "ongoing")}
          icon={
            <FaArrowRotateRight
              className="bg-yellow-400 text-white p-2 rounded-md"
              size={30}
            />
          }
          onDelete={showDeleteConfirmation}
          onChecked={handleCheckedTodo}
          onEdit={showEditTodo}
        />
        <TodoStatusContainer
          title="Completed"
          todos={todos.filter((todo) => todo.status === "completed")}
          icon={
            <FaCheck
              className="bg-green-500 text-white p-2 rounded-md"
              size={30}
            />
          }
          onDelete={showDeleteConfirmation}
          onChecked={handleCheckedTodo}
          onEdit={showEditTodo}
        />
      </div>
      <div className="flex justify-center items-center mt-16">
        <div
          className="bg-blue-500 text-white text-xl rounded-3xl p-8 py-3 font-semibold tracking-wide flex justify-center items-center gap-4 cursor-pointer shadow-2xl"
          onClick={() => setIsCreateTodoActive(true)}
        >
          Add a Task{" "}
          <IoIosAddCircle className="inline cursor-pointer" size={30} />
        </div>
      </div>

      {/* Create New Todo Popup */}
      {isCreateTodoActive && (
        <Popup
          title="Enter Task Details"
          onSubmit={handleCreateTodo}
          formData={newTodoFormData}
          setFormData={setNewTodoFormData}
          onClose={() => setIsCreateTodoActive(false)}
        />
      )}

      {/* Edit Todo Popup */}
      {isEditTodoActive && (
        <Popup
          title="Edit Task Details"
          onSubmit={handleEditTodo}
          formData={editTodoFormData}
          setFormData={setEditTodoFormData}
          onClose={() => setIsEditTodoActive(false)}
        />
      )}

      {/* Delete Confirmation Popup */}
      {deleteTaskConfirmation && (
        <DeleteConfirmation
          onConfirm={handleDeleteTodo}
          onCancel={() => setDeleteTaskConfirmation(false)}
        />
      )}
    </>
  );
};

export default Todos;
