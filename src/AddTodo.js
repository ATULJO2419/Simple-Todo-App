import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";

function AddTodo({ handleAddTodo }) {
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };
  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };
  const handleDueDateChange = (event) => {
    setDueDate(event.target.value);
  };

  const handleAddTodoClick = () => {
    if (!newTodo || !priority || !dueDate) {
      alert("Please enter todo text, select priority, and a due date");
      return;
    }

    handleAddTodo({
      text: newTodo,
      completed: false,
      priority: priority,
      due_date: dueDate,
    });

    // Clear the input fields after adding a new todo
    setNewTodo("");
    setPriority("Medium");
    setDueDate("");

    // Communicate with the Flask API to add a new todo
    fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
        completed: false,
        priority: priority,
        due_date: dueDate,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("New todo added:", data);
        // Call the handleAddTodo function in TodoList to update the state
        handleAddTodo(data);
        // Clear the input field after adding a new todo
        setNewTodo("");
      })
      .catch((error) => console.error("Error adding todo:", error));
  };

  return (
    <Card>
      <Card.Body>
        <Form>
          <Form.Group controlId="formTodo">
            <Form.Control
              type="text"
              placeholder="Enter todo text"
              value={newTodo}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formPriority">
            <br />
            <Form.Label>Priority</Form.Label>

            <br />
            <Form.Check
              type="radio"
              label="High"
              value="High"
              checked={priority === "High"}
              onChange={handlePriorityChange}
              inline
            />

            <Form.Check
              type="radio"
              label="Medium"
              value="Medium"
              checked={priority === "Medium"}
              onChange={handlePriorityChange}
              inline
            />

            <Form.Check
              type="radio"
              label="Low"
              value="Low"
              checked={priority === "Low"}
              onChange={handlePriorityChange}
              inline
            />
          </Form.Group>

          <br />
          <Form.Group controlId="formDueDate">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={dueDate}
              onChange={handleDueDateChange}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleAddTodoClick}>
            Add Todo
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default AddTodo;
