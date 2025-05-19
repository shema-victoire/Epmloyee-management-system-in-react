import React, { useState, useEffect } from 'react';
import {
  Container,
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
  IconButton,
  Card,
  CardContent,
  Chip,
  Divider,
  Avatar,
  Tooltip,
  TablePagination,
  InputAdornment,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Stack
} from '@mui/material';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WcIcon from '@mui/icons-material/Wc';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
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
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
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
    setLoading(true);
    setError(null);
    
    try {
      // Check if all required fields are filled
      const requiredFields = ['firstName', 'lastName', 'position', 'address', 'telephone', 'gender', 'hiredDate', 'departmentCode'] as const;
      const missingFields = requiredFields.filter(field => !formData[field as keyof Employee]);
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setLoading(false);
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
        setError(`Server error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('No response from server. Check your connection.');
      } else {
        console.error('Error message:', error.message);
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeNumber: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setLoading(true);
      try {
        console.log('Deleting employee:', employeeNumber);
        const token = localStorage.getItem('token');
        
        // Set Authorization header for this specific request
        const response = await axios.delete(`http://localhost:5000/api/employees/${employeeNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Delete response:', response.data);
        fetchEmployees();
      } catch (error: any) {
        console.error('Error deleting employee:', error);
        // Log more detailed error information
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Status code:', error.response.status);
          setError(`Server error: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          console.error('Error request:', error.request);
          setError('No response from server. Check your connection.');
        } else {
          console.error('Error message:', error.message);
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => 
    employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    departments.find(d => d.departmentCode === employee.departmentCode)?.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const paginatedEmployees = filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="lg">
      <Card elevation={0} sx={{ mb: 4, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
        <CardContent sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { xs: 'flex-start', md: 'center' } }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Employee Management
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                View, add, edit, and manage your employees
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
                sx={{ borderRadius: 2, px: 3, py: 1 }}
              >
                Add Employee
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search employees..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery('')} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: 'background.paper' }}
            />
          </Box>

          {loading && employees.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredEmployees.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No employees found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or add a new employee
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedEmployees.map((employee) => {
                      const departmentName = departments.find(
                        (d) => d.departmentCode === employee.departmentCode
                      )?.departmentName || 'Unknown';
                      
                      return (
                        <TableRow key={employee.employeeNumber} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: employee.gender === 'M' ? 'primary.light' : 'secondary.light',
                                  color: employee.gender === 'M' ? 'primary.dark' : 'secondary.dark',
                                  mr: 2 
                                }}
                              >
                                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">
                                  {`${employee.firstName} ${employee.lastName}`}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {employee.employeeNumber}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              icon={<WorkIcon fontSize="small" />} 
                              label={employee.position} 
                              size="small" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              icon={<BusinessIcon fontSize="small" />} 
                              label={departmentName} 
                              size="small"
                              color="primary"
                              variant="outlined" 
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{employee.telephone}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit">
                              <IconButton 
                                onClick={() => handleOpen(employee)}
                                color="primary"
                                size="small"
                                sx={{ mr: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                onClick={() => handleDelete(employee.employeeNumber)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredEmployees.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" component="div" fontWeight="bold">
              {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="First Name"
                    value={formData.firstName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Last Name"
                    value={formData.lastName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Stack>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Position"
                    value={formData.position || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    select
                    label="Department"
                    value={formData.departmentCode || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, departmentCode: e.target.value })
                    }
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  >
                    {departments.map((department) => (
                      <MenuItem key={department.departmentCode} value={department.departmentCode}>
                        {department.departmentName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Stack>
              
              <Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Address"
                  value={formData.address || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Telephone"
                    value={formData.telephone || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, telephone: e.target.value })
                    }
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    select
                    label="Gender"
                    value={formData.gender || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WcIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  >
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                  </TextField>
                </Box>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Hired Date"
                    type="date"
                    value={formData.hiredDate || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, hiredDate: e.target.value })
                    }
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : selectedEmployee ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Employee; 