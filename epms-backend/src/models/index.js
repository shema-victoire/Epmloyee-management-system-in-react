const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
    logging: false,
  }
);

const db = {
  sequelize,
  Sequelize,
  Employee: require('./employee')(sequelize, Sequelize),
  Department: require('./department')(sequelize, Sequelize),
  Salary: require('./salary')(sequelize, Sequelize),
  User: require('./user')(sequelize, Sequelize),
};

// Define relationships
db.Employee.belongsTo(db.Department, {
  foreignKey: 'departmentCode',
  targetKey: 'departmentCode',
});

db.Department.hasMany(db.Employee, {
  foreignKey: 'departmentCode',
  sourceKey: 'departmentCode',
});

db.Salary.belongsTo(db.Employee, {
  foreignKey: 'employeeNumber',
  targetKey: 'employeeNumber',
});

db.Employee.hasMany(db.Salary, {
  foreignKey: 'employeeNumber',
  sourceKey: 'employeeNumber',
});

module.exports = db; 