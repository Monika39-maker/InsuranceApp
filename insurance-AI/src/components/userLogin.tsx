import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useRef, useState, useEffect, use } from 'react';  
import InsuredPage from './InsuredPage';   

type dataType = {
    id?: number;
    full_name: string;
    role: string;
    has_house?: boolean;
    has_motor?: boolean;
  };  

const UserLogin = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usersList, setUsersList] = useState<dataType[]>([]);
  const [activeUser, setActiveUser] = useState<dataType | null>(null);

  const fetchUsersWithPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/users-with-policies');
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data: Array<dataType> = await res.json();

      // const underwriterDashboardData = data.filter(u => u.role === 'insured');

      // Use local data for immediate logging/logic
      console.log('Underwriter fetched users-with-policies (fetched):', data);

      // Update state for rendering
      setUsersList(data || []);
    } catch (err) {
      console.error('Underwriter error fetching users-with-policies:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsersWithPolicies();
  }, []);


  const usernameRef = useRef<HTMLInputElement>(null);


  function handleUserLogin() {
    const name = usernameRef.current?.value ?? '';
    const loggedInUser = usersList.find(u => u.full_name === name);
    if (loggedInUser) {
      setActiveUser(loggedInUser);
      console.log('Logged in user:', loggedInUser);
    }

  }

  return (
    <>
      <Card sx={{ maxWidth: 345, margin: 'auto', marginTop: '100px', borderTop: '5px solid #34cceb' }}>
        <CardContent>
          <TextField id="username" label="Username" variant="outlined" sx={{ border: '0.1px solid #34cceb', marginBottom: '10px', width: '100%' }} inputRef={usernameRef} />
          <TextField id="password" label="Password" variant="outlined" sx={{ border: '0.1px solid #34cceb', width: '100%' }} />
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleUserLogin}>Login</Button>
        </CardActions>
      </Card>

      <InsuredPage loggedInUser={activeUser} />
    </>
  );
}

export default UserLogin;