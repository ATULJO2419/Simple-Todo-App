import React, { useState, useEffect } from "react";
import { Card, Button, ListGroup } from "react-bootstrap";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = () => {
    // Fetch todos from the Flask API
    fetch("http://localhost:5000/api/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTodos();
  }, []); // Run once when the component mounts

  const handleUpdateTodo = (id) => {
    // Communicate with the Flask API to update a todo
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    setTodos(updatedTodos);

    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !todos.find((todo) => todo.id === id).completed,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Todo updated:", data))
      .catch((error) => console.error("Error updating todo:", error));
  };

  const handleDeleteTodo = (id) => {
    // Communicate with the Flask API to delete a todo
    const updatedTodos = todos.filter((todo) => todo.id !== id);

    setTodos(updatedTodos);

    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => console.log("Todo deleted:", data))
      .catch((error) => console.error("Error deleting todo:", error));
  };

  const handleUpdatePriority = (id) => {
    const newPriority = prompt("Enter new priority (High/Medium/Low):");

    if (newPriority && ["High", "Medium", "Low"].includes(newPriority)) {
      // Update the local state directly
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, priority: newPriority };
          }
          return todo;
        });
      });

      // Communicate with the Flask API to update the priority
      fetch(`http://localhost:5000/api/todos/${id}/priority`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priority: newPriority }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data.message))
        .catch((error) => console.error("Error updating priority:", error));
    } else {
      alert("Invalid priority. Please enter correct priority");
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Todo List</Card.Title>
        {loading && <p>Loading todos...</p>}
        {error && <p>Error loading todos: {error.message}</p>}
        {!loading && !error && (
          <>
            {todos.length === 0 ? (
              <p>No todos available. Add a new one!</p>
            ) : (
              <ListGroup>
                {todos.map((todo) => (
                  <ListGroup.Item
                    key={todo.id}
                    className="d-flex justify-content-between align-items-center mb-2"
                    style={{
                      backgroundColor: todo.completed ? "#f8d7da" : "#d4edda",
                      border: "1px solid #c3e6cb",
                    }}
                  >
                    <div className="todo-item">
                      <div className="status-container">
                        <Button
                          variant={
                            todo.completed
                              ? "outline-warning"
                              : "outline-success"
                          }
                          size="sm"
                          onClick={() => handleUpdateTodo(todo.id)}
                        >
                          {todo.completed ? "Pending" : "Completed"}
                        </Button>
                      </div>
                      <div className="todo-details">
                        <strong>{todo.text}</strong>
                        <div className="status"></div>
                        <div className="additional-info">
                          Priority: {todo.priority} - Due Date: {todo.due_date}
                        </div>
                      </div>
                      <div className="actions">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteTodo(todo.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleUpdatePriority(todo.id)}
                        >
                          Update Priority
                        </Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default TodoList;
