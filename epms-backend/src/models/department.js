module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    departmentCode: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    departmentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grossSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'departments',
    timestamps: true,
  });

  return Department;
}; 