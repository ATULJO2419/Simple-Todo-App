import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { BiTask } from "react-icons/bi"; // Import an icon (you can choose your preferred icon library)

import TodoList from "./TodoList";
import AddTodo from "./AddTodo";

function App() {
  const [key, setKey] = useState(0);

  const handleAddTodo = () => {
    // Increment the key to force a re-render of TodoList
    setKey((prevKey) => prevKey + 1);
  };

  return (
    <Container
      className="mt-5"
      style={{ backgroundColor: "#f0f0f0", minHeight: "100vh" }}
    >
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="mb-4">
                <BiTask className="mr-2" /> Your ToDo App
              </Card.Title>
              <AddTodo handleAddTodo={handleAddTodo} />
            </Card.Body>
          </Card>

          <Card className="mt-4 p-3">
            <Card.Body>
              <Card.Title>Todo List</Card.Title>
              {/* Pass the key prop to force a re-render */}
              <TodoList key={key} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
