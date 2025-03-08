import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Container, Card, Table, Spinner, Alert } from "react-bootstrap";

function AdminDashboard() {
  const { api } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/users");
        setUsers(data);
      } catch (error) {
        setError("Failed to fetch users", error);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <Container className="py-4">
      <Card className="shadow-lg p-4">
        <h2 className="text-center mb-4">Admin Dashboard</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
}

export default AdminDashboard;
