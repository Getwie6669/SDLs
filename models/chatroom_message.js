const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Chatroom_message = sequelize.define('Chatroom_message', {
    message:{
        type: DataTypes.TEXT,
        allowNull:true
    },
    author:{
        type: DataTypes.TEXT,
        allowNull:true
    }
});

module.exports = Chatroom_message;