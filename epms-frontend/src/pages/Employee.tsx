import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import axios from 'axios';

interface Employee {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  position: string;
  address: string;
  telephone: string;
  gender: string;
  hiredDate: string;
  departmentCode: string;
}

interface Department {
  departmentCode: string;
  departmentName: string;
}

const Employee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/employees', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/departments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleOpen = (employee?: Employee) => {
    if (employee) {
      setSelectedEmployee(employee);
      setFormData(employee);
    } else {
      setSelectedEmployee(null);
      setFormData({});
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if all required fields are filled
      const requiredFields = ['employeeNumber', 'firstName', 'lastName', 'position', 'address', 'telephone', 'gender', 'hiredDate', 'departmentCode'] as const;
      const missingFields = requiredFields.filter(field => !formData[field as keyof Employee]);
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      console.log('Form data being submitted:', formData);

      const token = localStorage.getItem('token');
      
      // Configure axios with common headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (selectedEmployee) {
        console.log('Updating employee:', selectedEmployee.employeeNumber);
        const response = await axios.put(
          `http://localhost:5000/api/employees/${selectedEmployee.employeeNumber}`,
          formData
        );
        console.log('Update response:', response.data);
      } else {
        console.log('Creating new employee');
        const response = await axios.post('http://localhost:5000/api/employees', formData);
        console.log('Create response:', response.data);
      }
      handleClose();
      fetchEmployees();
    } catch (error: any) {
      console.error('Error saving employee:', error);
      // Log more detailed error information
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status code:', error.response.status);
        alert(`Server error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        alert('No response from server. Check your connection.');
      } else {
        console.error('Error message:', error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleDelete = async (employeeNumber: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/employees/${employeeNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Employee Management</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Employee
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Telephone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.employeeNumber}>
                <TableCell>{employee.employeeNumber}</TableCell>
                <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                  {departments.find((d) => d.departmentCode === employee.departmentCode)?.departmentName}
                </TableCell>
                <TableCell>{employee.telephone}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => handleOpen(employee)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(employee.employeeNumber)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEmployee ? 'Edit Employee' : 'Add Employee'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Employee Number"
              value={formData.employeeNumber || ''}
              onChange={(e) =>
                setFormData({ ...formData, employeeNumber: e.target.value })
              }
              margin="normal"
              required
              disabled={!!selectedEmployee}
            />
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName || ''}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName || ''}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Position"
              value={formData.position || ''}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Address"
              value={formData.address || ''}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Telephone"
              value={formData.telephone || ''}
              onChange={(e) =>
                setFormData({ ...formData, telephone: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Gender"
              value={formData.gender || ''}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              margin="normal"
              required
            >
              <MenuItem value="M">Male</MenuItem>
              <MenuItem value="F">Female</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Hired Date"
              type="date"
              value={formData.hiredDate || ''}
              onChange={(e) =>
                setFormData({ ...formData, hiredDate: e.target.value })
              }
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              select
              label="Department"
              value={formData.departmentCode || ''}
              onChange={(e) =>
                setFormData({ ...formData, departmentCode: e.target.value })
              }
              margin="normal"
              required
            >
              {departments.map((department) => (
                <MenuItem key={department.departmentCode} value={department.departmentCode}>
                  {department.departmentName}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={(e) => {
              console.log('Add/Update button clicked');
              handleSubmit(e as React.FormEvent);
            }}
            variant="contained"
            color="primary"
            type="button"
          >
            {selectedEmployee ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Employee; 