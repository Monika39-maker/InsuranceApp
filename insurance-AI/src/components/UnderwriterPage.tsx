import { useEffect, useState } from "react";

type InsuredDataType = {
  id?: number;
  full_name: string;
  role: string;
  has_house?: boolean;
  has_motor?: boolean;
};

function UnderwriterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insuredUsersList, setInsuredUSersList] = useState<InsuredDataType[]>([]);

  useEffect(() => {
     fetchUsersWithPolicies();
  }, []);

  const fetchUsersWithPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/users-with-policies');
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data: Array<InsuredDataType> = await res.json();
      // Filter only insured users
      const underwriterDashboardData = data.filter(u => u.role === 'insured');
      setInsuredUSersList(underwriterDashboardData || []);
      console.log('Underwriter fetched users-with-policies:', data);
    } catch (err) {
      console.error('Underwriter error fetching users-with-policies:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>User full name</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Role</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Policies</th>
            </tr>
          </thead>
          <tbody>
            {insuredUsersList.map((u, idx) => {
              const key = u.id ?? idx;
              return (
                <tr key={key}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{u.full_name}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{u.role}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                    {u.has_house ? <svg width="18" height="18" viewBox="0 0 24 24" aria-label="house" style={{ marginRight: 8 }}>
                      <path d="M12 3l9 8h-3v7h-4v-5H10v5H6v-7H3z" fill="currentColor" />
                    </svg> : null}
                    {u.has_motor ? <svg width="18" height="18" viewBox="0 0 24 24" aria-label="motor">
                      <path d="M3 13v4h2a2 2 0 0 0 4 0h6a2 2 0 0 0 4 0h2v-4L20 8H4zM6.5 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor" />
                    </svg> : null}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                    <button>View Policies</button>
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                  </td>
                </tr>
              );
            })}
            {insuredUsersList.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: 12 }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UnderwriterPage;