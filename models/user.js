const {DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Project = require('./project');
const Threads = require('./threads');
const Threads_Message = require('./threads_message');
const daily_personal = require('./daily_personal');
const Chatroom_message = require('./chatroom_message');

const User = sequelize.define('user', {
    username: {
        type: DataTypes.TEXT,
        allowNull:false
    },
    account: {
        type: DataTypes.TEXT,
        allowNull:false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull:false
    },
    role: {
        type: DataTypes.TEXT,
        allowNull:false
    },  
});


User.belongsToMany(Project, {through:"User_Projects"});
Project.belongsToMany(User, {through:"User_Projects"});

User.hasMany(Threads_Message);
User.hasMany(Threads);
// User.hasMany(Chatroom_message);
User.hasMany(daily_personal);

module.exports = User;