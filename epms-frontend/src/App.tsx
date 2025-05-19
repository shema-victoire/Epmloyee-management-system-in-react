import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Employee from './pages/Employee';
import Department from './pages/Department';
import Salary from './pages/Salary';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/employees" replace />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            } 
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/employees" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/employees"
            element={
              isAuthenticated ? (
                <Employee />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/departments"
            element={
              isAuthenticated ? (
                <Department />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/salary"
            element={
              isAuthenticated ? (
                <Salary />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/reports"
            element={
              isAuthenticated ? (
                <Reports />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
