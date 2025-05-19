const express = require('express');
const { Salary, Employee, Department, Sequelize } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate payroll report
router.get('/payroll', protect, async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: 'Month and year are required for generating a payroll report',
      });
    }

    const salaries = await Salary.findAll({
      where: {
        month,
        year,
      },
      include: [
        {
          model: Employee,
          attributes: ['firstName', 'lastName', 'position', 'departmentCode'],
          include: [
            {
              model: Department,
              attributes: ['departmentName'],
            },
          ],
        },
      ],
    });

    // Transform data for report
    const reportData = salaries.map((salary) => ({
      firstName: salary.Employee.firstName,
      lastName: salary.Employee.lastName,
      position: salary.Employee.position,
      department: salary.Employee.Department.departmentName,
      netSalary: salary.netSalary,
    }));

    res.status(200).json(reportData);
  } catch (error) {
    console.error('Error generating payroll report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Summary report by department
router.get('/department-summary', protect, async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({
        message: 'Year is required for generating a department summary report',
      });
    }

    const departmentSummary = await Department.findAll({
      attributes: [
        'departmentCode',
        'departmentName',
        [Sequelize.fn('COUNT', Sequelize.col('Employees.employeeNumber')), 'employeeCount'],
        [Sequelize.fn('SUM', Sequelize.col('Employees.Salaries.grossSalary')), 'totalGrossSalary'],
        [Sequelize.fn('SUM', Sequelize.col('Employees.Salaries.netSalary')), 'totalNetSalary'],
      ],
      include: [
        {
          model: Employee,
          attributes: [],
          include: [
            {
              model: Salary,
              attributes: [],
              where: {
                year,
              },
              required: false,
            },
          ],
        },
      ],
      group: ['Department.departmentCode'],
    });

    res.status(200).json(departmentSummary);
  } catch (error) {
    console.error('Error generating department summary report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 