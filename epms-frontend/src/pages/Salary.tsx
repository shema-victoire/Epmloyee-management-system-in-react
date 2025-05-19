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
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import axios from 'axios';

interface Salary {
  salaryID: string;
  employeeNumber: string;
  grossSalary: number;
  totalDeduction: number;
  netSalary: number;
  month: string;
  year: string;
}

interface Employee {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  departmentCode: string;
}

const Salary = () => {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<Salary | null>(null);
  const [formData, setFormData] = useState<Partial<Salary>>({});
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const fetchSalaries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/salaries', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSalaries(response.data);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    }
  };

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

  const handleOpen = (salary?: Salary) => {
    if (salary) {
      setSelectedSalary(salary);
      setFormData(salary);
      setSelectedEmployee(salary.employeeNumber);
    } else {
      setSelectedSalary(null);
      setFormData({});
      setSelectedEmployee('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSalary(null);
    setFormData({});
    setSelectedEmployee('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        employeeNumber: selectedEmployee,
      };

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };

      if (selectedSalary) {
        await axios.put(
          `http://localhost:5000/api/salaries/${selectedSalary.salaryID}`,
          data,
          { headers }
        );
      } else {
        await axios.post('http://localhost:5000/api/salaries', data, { headers });
      }
      handleClose();
      fetchSalaries();
    } catch (error) {
      console.error('Error saving salary:', error);
    }
  };

  const handleDelete = async (salaryID: string) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/salaries/${salaryID}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchSalaries();
      } catch (error) {
        console.error('Error deleting salary:', error);
      }
    }
  };

  const getEmployeeName = (employeeNumber: string) => {
    const employee = employees.find((emp) => emp.employeeNumber === employeeNumber);
    return employee ? `${employee.firstName} ${employee.lastName}` : '';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Salary Management</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Salary Record
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Gross Salary</TableCell>
              <TableCell>Deductions</TableCell>
              <TableCell>Net Salary</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salaries.map((salary) => (
              <TableRow key={salary.salaryID}>
                <TableCell>{getEmployeeName(salary.employeeNumber)}</TableCell>
                <TableCell>{salary.month}</TableCell>
                <TableCell>{salary.year}</TableCell>
                <TableCell>${salary.grossSalary.toLocaleString()}</TableCell>
                <TableCell>${salary.totalDeduction.toLocaleString()}</TableCell>
                <TableCell>${salary.netSalary.toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => handleOpen(salary)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(salary.salaryID)}
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
          {selectedSalary ? 'Edit Salary Record' : 'Add Salary Record'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Employee</InputLabel>
              <Select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.employeeNumber} value={employee.employeeNumber}>
                    {`${employee.firstName} ${employee.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            <TextField
              fullWidth
              label="Total Deductions"
              type="number"
              value={formData.totalDeduction || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalDeduction: parseFloat(e.target.value),
                })
              }
              margin="normal"
              required
              InputProps={{
                startAdornment: '$',
              }}
            />
            <TextField
              fullWidth
              select
              label="Month"
              value={formData.month || ''}
              onChange={(e) =>
                setFormData({ ...formData, month: e.target.value })
              }
              margin="normal"
              required
            >
              {Array.from({ length: 12 }, (_, i) => {
                const month = new Date(0, i).toLocaleString('default', {
                  month: 'long',
                });
                return (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                );
              })}
            </TextField>
            <TextField
              fullWidth
              label="Year"
              type="number"
              value={formData.year || ''}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedSalary ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Salary; 