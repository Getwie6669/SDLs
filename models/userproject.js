const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const User_project = sequelize.define('User_Project', {
  // 定义模型的属性
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  // 这里是其他模型选项
});

module.exports = User_project;