module.exports = (sequelize, DataTypes) => {
  const Salary = sequelize.define('Salary', {
    salaryID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'employeeNumber',
      },
    },
    grossSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalDeduction: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    netSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'salaries',
    timestamps: true,
    hooks: {
      beforeCreate: (salary) => {
        salary.netSalary = salary.grossSalary - salary.totalDeduction;
      },
      beforeUpdate: (salary) => {
        salary.netSalary = salary.grossSalary - salary.totalDeduction;
      },
    },
  });

  return Salary;
}; 