

type InsuredDataType = {
  id?: number;
  full_name: string;
  role: string;
  has_house?: boolean;
  has_motor?: boolean;
};

type Props = {
  loggedInUser?: InsuredDataType | null;
};


function InsuredPage({ loggedInUser }: Props) {
  if (!loggedInUser) {
    return <div>Please login to see your policies.</div>;
  }

  const { full_name, has_house, has_motor } = loggedInUser;

  return (
    <div style={{ padding: 16 }}>
      <h3>Hi {full_name}</h3>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        {has_house ? (
          <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, minWidth: 200 }}>
            <h4 style={{ margin: '0 0 8px 0' }}>House policy</h4>
            <p style={{ margin: 0, color: '#555' }}>You have an active house policy.</p>
          </div>
        ) : null}
        {has_motor ? (
          <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, minWidth: 200 }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Motor policy</h4>
            <p style={{ margin: 0, color: '#555' }}>You have an active motor policy.</p>
          </div>
        ) : null}
        {!has_house && !has_motor ? (
          <div style={{ color: '#666' }}>No active policies found for this user.</div>
        ) : null}
      </div>
    </div>
  );
}

export default InsuredPage;