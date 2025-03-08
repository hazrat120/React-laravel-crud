import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../student.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import StudentModal from "../components/StudentModal";

export default function Student() {
  const [students, setStudents] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleOpenModal = (student = null) => {
    setSelectedStudent(student);
    setModalShow(true);
  };

  // Handle add/edit student
  const saveStudent = async (formData) => {
    try {
      if (selectedStudent) {
        // ✅ Update Student
        await axios.put(
          `http://127.0.0.1:8000/api/students/${selectedStudent.id}`,
          formData
        );
      } else {
        // ✅ Add Student
        await axios.post("http://127.0.0.1:8000/api/students", formData);
      }

      setModalShow(false); // Close Modal after Save
      fetchStudents(); // Refresh Student List
    } catch (error) {
      console.error(
        "Error saving student:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="card shadow-sm student-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Student List</h4>
              <Button variant="primary" onClick={() => handleOpenModal()}>
                Add Student
              </Button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Course</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length > 0 ? (
                      students.map((student) => (
                        <tr key={student.id}>
                          <td>{student.student_id}</td>
                          <td>{student.name}</td>
                          <td>{student.course}</td>
                          <td>{student.email}</td>
                          <td>(+008) {student.phone}</td>
                          <td>
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => handleOpenModal(student)}
                            >
                              Edit
                            </Button>
                          </td>
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => deleteStudent(student.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No students found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Modal */}
      <StudentModal
        show={modalShow}
        handleClose={() => setModalShow(false)}
        student={selectedStudent}
        saveStudent={saveStudent}
      />
    </div>
  );
}
