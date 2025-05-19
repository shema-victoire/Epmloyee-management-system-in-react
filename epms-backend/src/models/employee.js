module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    employeeNumber: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('M', 'F'),
      allowNull: false,
    },
    hiredDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    departmentCode: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'departments',
        key: 'departmentCode',
      },
    },
  }, {
    tableName: 'employees',
    timestamps: true,
  });

  return Employee;
}; 