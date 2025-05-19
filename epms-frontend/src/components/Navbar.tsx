import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';

interface NavbarProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SmartPark EPMS
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<PeopleIcon />}
            onClick={() => navigate('/employees')}
          >
            Employees
          </Button>
          <Button
            color="inherit"
            startIcon={<BusinessIcon />}
            onClick={() => navigate('/departments')}
          >
            Departments
          </Button>
          <Button
            color="inherit"
            startIcon={<AttachMoneyIcon />}
            onClick={() => navigate('/salary')}
          >
            Salary
          </Button>
          <Button
            color="inherit"
            startIcon={<AssessmentIcon />}
            onClick={() => navigate('/reports')}
          >
            Reports
          </Button>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 