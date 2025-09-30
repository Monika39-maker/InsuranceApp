import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


const UserLogin = () => {
    return (
      <Card sx={{ maxWidth: 345, margin: 'auto', marginTop: '100px', borderTop: '5px solid #34cceb',
       }}>
        <CardContent>
          <TextField id="username" label="Username" variant="outlined" sx={{border: '0.1px solid #34cceb', marginBottom:'10px', width:'100%'}}/>
          <TextField id="password" label="Password" variant="outlined" sx={{border: '0.1px solid #34cceb', width:'100%'}}/>
        </CardContent>
        <CardActions>
          <Button size="small">Login</Button>
        </CardActions>
     </Card>
    )
}

export default UserLogin;