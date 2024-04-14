const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Chatroom_message = sequelize.define('Chatroom_message', {
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    author: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // 注意这里使用字符串指向模型名
            key: 'id'
        }
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'projects', // 注意这里使用字符串指向模型名
            key: 'id'
        }
    }
});


module.exports = Chatroom_message;