# Employee Payroll Management System (EPMS)

A web-based Employee Payroll Management System for SmartPark, a company in Rubavu District, Rwanda. The system replaces their manual, paper-based payroll process, improving efficiency, accuracy, and reporting.

## Project Overview

The EPMS system allows for:
- Digital employee record management
- Department organization
- Automated payroll processing
- Comprehensive reporting

## Technology Stack

### Frontend
- React.js
- TypeScript
- Material UI
- Axios for API communication

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL database
- JWT for authentication

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- MySQL Server
- npm or yarn

### Database Setup
1. Create a MySQL database named `epms`
2. Configure database connection in `epms-backend/.env` file

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd epms-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file with the following content:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=epms
   JWT_SECRET=your_jwt_secret_key
   ```

4. Seed the database:
   ```
   node src/seedDB.js
   ```

5. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd epms-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

## Default Login Credentials
- Username: admin
- Password: admin123

## Features

### Employee Management
- Add new employees
- Update employee information
- View employee details
- Delete employees

### Department Management
- Create and manage departments
- Assign employees to departments
- Track department salary budgets

### Salary Processing
- Generate monthly salary records
- Calculate deductions and net salary
- Track salary history

### Reports
- Generate monthly payroll reports
- Export reports to CSV format
- View salary distribution by department

## Entity Relationships
- Each employee belongs to one department
- A department can have multiple employees
- Salary records are generated for each employee monthly
- Each salary record is associated with an employee 