import React, { useEffect, useState } from 'react';

type User = {
  id?: number;
  full_name: string;
  role: string;
};

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/users');
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      const adminDashboardData = data.filter((user: User) => user.role != 'admin');
      setUsers(adminDashboardData || []);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newUser.full_name.trim() || !newUser.role.trim()) {
      setError('Please enter full name and role');
      return;
    }

    // optimistic update
    const temp: User = { ...newUser };
    setUsers(prev => [temp, ...prev]);
    setShowForm(false);
    setNewUser({ full_name: '', role: '' });

    try {
      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: temp.full_name, role: temp.role, password: 'changeme' })
      });
      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }
      const created = await res.json();
      // replace optimistic entry if server returned an id
      if (created && created.id) {
        setUsers(prev => prev.map(u => (u === temp ? created : u)));
      }
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Segoe UI, Roboto, Arial' }}>
      <h2>Admin — Users</h2>

      <div style={{ position: 'relative', marginBottom: 8 }}>
        <div style={{ position: 'absolute', right: 0 }}>
          <button
            aria-label="add-user"
            onClick={() => setShowForm(s => !s)}
            style={{
              fontSize: 20,
              padding: '6px 10px',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            +
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
          <input
            name="full_name"
            value={newUser.full_name}
            onChange={handleChange}
            placeholder="Full name"
            style={{ padding: 8, flex: 1 }}
          />
          <input
            name="role"
            value={newUser.role}
            onChange={handleChange}
            placeholder="Role"
            style={{ padding: 8, width: 160 }}
          />
          <button type="submit" style={{ padding: '8px 12px' }}>Add</button>
        </form>
      )}

      {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>User full name</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u.id ?? idx}>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{u.full_name}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{u.role}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={2} style={{ padding: 12 }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
