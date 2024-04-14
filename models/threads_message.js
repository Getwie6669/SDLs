const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Project = require('./project');
const User = require('./user'); // 确保这里的路径和大小写正确

const Threads_Message = sequelize.define('message', {
    messageText:{
        type: DataTypes.TEXT,
        allowNull:false
    }
});

module.exports = Threads_Message;

// const ChatMessage = sequelize.define('chatMessage', {
//     message: {
//         type: DataTypes.TEXT,
//         allowNull: false
//     },
//     timestamp: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//     }
// });

// console.log('Is User a Sequelize model?', User instanceof Sequelize.Model); // 应该输出 true
// console.log('Is Project a Sequelize model?', Project instanceof Sequelize.Model); // 应该输出 true

// ChatMessage.belongsToMany(User);
// ChatMessage.belongsToMany(Project);

// User.hasMany(ChatMessage);
// Project.hasMany(ChatMessage);

// module.exports = ChatMessage;
