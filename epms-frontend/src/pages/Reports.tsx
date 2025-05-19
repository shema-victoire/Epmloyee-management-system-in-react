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
  TextField,
  MenuItem,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import axios from 'axios';

interface PayrollReport {
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  netSalary: number;
}

const Reports = () => {
  const [reports, setReports] = useState<PayrollReport[]>([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const generateReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/reports/payroll?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setReports(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['First Name', 'Last Name', 'Position', 'Department', 'Net Salary'];
    const csvContent = [
      headers.join(','),
      ...reports.map(
        (report) =>
          `${report.firstName},${report.lastName},${report.position},${report.department},${report.netSalary}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `payroll_report_${month}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Payroll Reports
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            select
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            sx={{ minWidth: 200 }}
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
            label="Year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{ minWidth: 120 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={generateReport}
            disabled={!month || !year}
          >
            Generate Report
          </Button>

          {reports.length > 0 && (
            <Button variant="outlined" color="primary" onClick={exportToCSV}>
              Export to CSV
            </Button>
          )}
        </Box>
      </Paper>

      {reports.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Department</TableCell>
                <TableCell align="right">Net Salary</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report, index) => (
                <TableRow key={index}>
                  <TableCell>{report.firstName}</TableCell>
                  <TableCell>{report.lastName}</TableCell>
                  <TableCell>{report.position}</TableCell>
                  <TableCell>{report.department}</TableCell>
                  <TableCell align="right">
                    ${report.netSalary.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Reports; 