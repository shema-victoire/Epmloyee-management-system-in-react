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
  Typography,
  Box,
} from '@mui/material';
import axios from 'axios';

interface Department {
  departmentCode: string;
  departmentName: string;
  grossSalary: number;
}

const Department = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<Partial<Department>>({});

  useEffect(() => {
    fetchDepartments();
  }, []);

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

  const handleOpen = (department?: Department) => {
    if (department) {
      setSelectedDepartment(department);
      setFormData(department);
    } else {
      setSelectedDepartment(null);
      setFormData({});
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDepartment(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if all required fields are filled
      const requiredFields = ['departmentCode', 'departmentName', 'grossSalary'] as const;
      const missingFields = requiredFields.filter(field => !formData[field as keyof Department]);
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      console.log('Form data being submitted:', formData);
      
      const token = localStorage.getItem('token');
      
      // Configure axios with common headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (selectedDepartment) {
        console.log('Updating department:', selectedDepartment.departmentCode);
        const response = await axios.put(
          `http://localhost:5000/api/departments/${selectedDepartment.departmentCode}`,
          formData
        );
        console.log('Update response:', response.data);
      } else {
        console.log('Creating new department');
        const response = await axios.post('http://localhost:5000/api/departments', formData);
        console.log('Create response:', response.data);
      }
      handleClose();
      fetchDepartments();
    } catch (error: any) {
      console.error('Error saving department:', error);
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

  const handleDelete = async (departmentCode: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/departments/${departmentCode}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchDepartments();
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Department Management</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Department
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Department Code</TableCell>
              <TableCell>Department Name</TableCell>
              <TableCell>Gross Salary</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.departmentCode}>
                <TableCell>{department.departmentCode}</TableCell>
                <TableCell>{department.departmentName}</TableCell>
                <TableCell>${department.grossSalary.toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => handleOpen(department)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(department.departmentCode)}
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
          {selectedDepartment ? 'Edit Department' : 'Add Department'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Department Code"
              value={formData.departmentCode || ''}
              onChange={(e) =>
                setFormData({ ...formData, departmentCode: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Department Name"
              value={formData.departmentName || ''}
              onChange={(e) =>
                setFormData({ ...formData, departmentName: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Gross Salary"
              type="number"
              value={formData.grossSalary || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  grossSalary: parseFloat(e.target.value),
                })
              }
              margin="normal"
              required
              InputProps={{
                startAdornment: '$',
              }}
            />
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
            {selectedDepartment ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Department; 