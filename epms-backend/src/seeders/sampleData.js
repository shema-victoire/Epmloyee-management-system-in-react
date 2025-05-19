const bcrypt = require('bcryptjs');
const { User, Department, Employee, Salary } = require('../models');

// Sample data seeder function
const seedData = async () => {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: adminPassword,
      role: 'admin',
    });

    console.log('Admin user created successfully');

    // Create departments
    const departments = [
      {
        departmentCode: 'IT',
        departmentName: 'Information Technology',
        grossSalary: 80000,
      },
      {
        departmentCode: 'HR',
        departmentName: 'Human Resources',
        grossSalary: 65000,
      },
      {
        departmentCode: 'FIN',
        departmentName: 'Finance',
        grossSalary: 75000,
      },
      {
        departmentCode: 'MKT',
        departmentName: 'Marketing',
        grossSalary: 70000,
      },
    ];

    await Department.bulkCreate(departments);
    console.log('Departments created successfully');

    // Create employees
    const employees = [
      {
        employeeNumber: 'EMP0001',
        firstName: 'John',
        lastName: 'Doe',
        position: 'IT Manager',
        address: 'Kigali, Rwanda',
        telephone: '+250 789 123 456',
        gender: 'M',
        hiredDate: '2020-01-15',
        departmentCode: 'IT',
      },
      {
        employeeNumber: 'EMP0002',
        firstName: 'Jane',
        lastName: 'Smith',
        position: 'HR Specialist',
        address: 'Rubavu, Rwanda',
        telephone: '+250 789 234 567',
        gender: 'F',
        hiredDate: '2021-03-10',
        departmentCode: 'HR',
      },
      {
        employeeNumber: 'EMP0003',
        firstName: 'Robert',
        lastName: 'Johnson',
        position: 'Financial Analyst',
        address: 'Kigali, Rwanda',
        telephone: '+250 789 345 678',
        gender: 'M',
        hiredDate: '2019-11-22',
        departmentCode: 'FIN',
      },
      {
        employeeNumber: 'EMP0004',
        firstName: 'Maria',
        lastName: 'Garcia',
        position: 'Marketing Specialist',
        address: 'Rubavu, Rwanda',
        telephone: '+250 789 456 789',
        gender: 'F',
        hiredDate: '2022-02-05',
        departmentCode: 'MKT',
      },
      {
        employeeNumber: 'EMP0005',
        firstName: 'David',
        lastName: 'Kim',
        position: 'Software Developer',
        address: 'Kigali, Rwanda',
        telephone: '+250 789 567 890',
        gender: 'M',
        hiredDate: '2021-07-15',
        departmentCode: 'IT',
      },
    ];

    await Employee.bulkCreate(employees);
    console.log('Employees created successfully');

    // Create salary records
    const currentYear = new Date().getFullYear().toString();
    const salaries = [
      {
        employeeNumber: 'EMP0001',
        grossSalary: 9000,
        totalDeduction: 1800,
        netSalary: 7200,
        month: 'January',
        year: currentYear,
      },
      {
        employeeNumber: 'EMP0001',
        grossSalary: 9000,
        totalDeduction: 1800,
        netSalary: 7200,
        month: 'February',
        year: currentYear,
      },
      {
        employeeNumber: 'EMP0002',
        grossSalary: 7000,
        totalDeduction: 1400,
        netSalary: 5600,
        month: 'January',
        year: currentYear,
      },
      {
        employeeNumber: 'EMP0002',
        grossSalary: 7000,
        totalDeduction: 1400,
        netSalary: 5600,
        month: 'February',
        year: currentYear,
      },
      {
        employeeNumber: 'EMP0003',
        grossSalary: 8000,
        totalDeduction: 1600,
        netSalary: 6400,
        month: 'January',
        year: currentYear,
      },
      {
        employeeNumber: 'EMP0003',
        grossSalary: 8000,
        totalDeduction: 1600,
        netSalary: 6400,
        month: 'February',
        year: currentYear,
      },
      {
        employeeNumber: 'EMP0004',
        grossSalary: 7500,
        totalDeduction: 1500,
        netSalary: 6000,
        month: 'January',
        year: currentYear,
      },
      {
        employeeNumber: 'EMP0004',
        grossSalary: 7500,
        totalDeduction: 1500,
        netSalary: 6000,
        month: 'February',
        year: currentYear,
      },
      {
        employeeNumber: 'EMP0005',
        grossSalary: 8500,
        totalDeduction: 1700,
        netSalary: 6800,
        month: 'January',
        year: currentYear,
      },
      {
        employeeNumber: 'EMP0005',
        grossSalary: 8500,
        totalDeduction: 1700,
        netSalary: 6800,
        month: 'February',
        year: currentYear,
      },
    ];

    await Salary.bulkCreate(salaries);
    console.log('Salary records created successfully');

    console.log('Sample data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData; 