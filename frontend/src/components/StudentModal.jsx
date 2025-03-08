import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function StudentModal({
  show,
  handleClose,
  student,
  saveStudent,
}) {
  const [formData, setFormData] = useState({
    student_id: "",
    name: "",
    course: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (show) {
      if (student) {
        setFormData({
          student_id: student.student_id || "",
          name: student.name || "",
          course: student.course || "",
          email: student.email || "",
          phone: student.phone || "",
        });
      } else {
        setFormData({
          student_id: "",
          name: "",
          course: "",
          email: "",
          phone: "",
        });
      }
    }
  }, [show, student]);

  // Update state when the user types in the input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // On form submit, call saveStudent and then close the modal
  const handleSubmit = (e) => {
    e.preventDefault();
    saveStudent(formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{student ? "Edit Student" : "Add Student"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Student ID</Form.Label>
            <Form.Control
              type="number"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Course</Form.Label>
            <Form.Control
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            style={{ margin: "0 auto", display: "flex" }}
          >
            {student ? "Update" : "Add"} Student
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
