import { useEffect, useState } from "react";

export default function UserManagement({ API, token }) {
  const [users, setUsers] = useState([]);

  async function loadUsers() {
    const res = await fetch(`${API}/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (Array.isArray(data)) {
        setUsers(data);
    } else {
        console.error(data);
        setUsers([]);
    }
  }

  async function updateRole(id, role) {
    const res = await fetch(`${API}/api/users/${id}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ role })
    });

    if (res.ok) {
      loadUsers();
    } else {
      alert("Failed to update role");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="admin-form-card">
      <h3>👥 User Management</h3>

      <table style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u._id, e.target.value)}
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}