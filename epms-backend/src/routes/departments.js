const express = require('express');
const { Department, Employee } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all departments
router.get('/', protect, async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get department by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id, {
      include: [
        {
          model: Employee,
          attributes: ['employeeNumber', 'firstName', 'lastName', 'position'],
        },
      ],
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json(department);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create department
router.post('/', protect, async (req, res) => {
  try {
    const newDepartment = await Department.create(req.body);
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update department
router.put('/:id', protect, async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.update(req.body);

    res.status(200).json(department);
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete department
router.delete('/:id', protect, async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if department has employees
    const employeeCount = await Employee.count({
      where: { departmentCode: req.params.id },
    });

    if (employeeCount > 0) {
      return res.status(400).json({
        message:
          'Cannot delete department with employees. Remove or reassign employees first.',
      });
    }

    await department.destroy();

    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 