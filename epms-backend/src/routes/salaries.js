const express = require('express');
const { Salary, Employee, Department } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all salaries
router.get('/', protect, async (req, res) => {
  try {
    const salaries = await Salary.findAll({
      include: [
        {
          model: Employee,
          attributes: ['firstName', 'lastName', 'position'],
          include: [
            {
              model: Department,
              attributes: ['departmentName'],
            },
          ],
        },
      ],
    });
    res.status(200).json(salaries);
  } catch (error) {
    console.error('Error fetching salaries:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get salary by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const salary = await Salary.findByPk(req.params.id, {
      include: [
        {
          model: Employee,
          attributes: ['firstName', 'lastName', 'position'],
          include: [
            {
              model: Department,
              attributes: ['departmentName'],
            },
          ],
        },
      ],
    });

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    res.status(200).json(salary);
  } catch (error) {
    console.error('Error fetching salary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create salary
router.post('/', protect, async (req, res) => {
  try {
    // Calculate net salary
    const grossSalary = parseFloat(req.body.grossSalary);
    const totalDeduction = parseFloat(req.body.totalDeduction || 0);
    const netSalary = grossSalary - totalDeduction;

    const newSalary = await Salary.create({
      ...req.body,
      netSalary,
    });

    res.status(201).json(newSalary);
  } catch (error) {
    console.error('Error creating salary record:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update salary
router.put('/:id', protect, async (req, res) => {
  try {
    const salary = await Salary.findByPk(req.params.id);

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    // Calculate net salary if gross or deduction changes
    if (req.body.grossSalary !== undefined || req.body.totalDeduction !== undefined) {
      const grossSalary = parseFloat(req.body.grossSalary || salary.grossSalary);
      const totalDeduction = parseFloat(req.body.totalDeduction || salary.totalDeduction);
      req.body.netSalary = grossSalary - totalDeduction;
    }

    await salary.update(req.body);

    res.status(200).json(salary);
  } catch (error) {
    console.error('Error updating salary record:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete salary
router.delete('/:id', protect, async (req, res) => {
  try {
    const salary = await Salary.findByPk(req.params.id);

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    await salary.destroy();

    res.status(200).json({ message: 'Salary record deleted successfully' });
  } catch (error) {
    console.error('Error deleting salary record:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 