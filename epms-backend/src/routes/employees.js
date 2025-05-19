const express = require('express');
const { Employee, Department } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all employees
router.get('/', protect, async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [
        {
          model: Department,
          attributes: ['departmentName'],
        },
      ],
    });
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employee by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [
        {
          model: Department,
          attributes: ['departmentName'],
        },
      ],
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create employee
router.post('/', protect, async (req, res) => {
  try {
    // Generate employee number
    const employeeCount = await Employee.count();
    const employeeNumber = `EMP${String(employeeCount + 1).padStart(4, '0')}`;

    const newEmployee = await Employee.create({
      employeeNumber,
      ...req.body,
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update employee
router.put('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.update(req.body);

    res.status(200).json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete employee
router.delete('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.destroy();

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 