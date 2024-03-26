const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const Threads_Message = sequelize.define('message', {
    messageText:{
        type: DataTypes.TEXT,
        allowNull:false
    }
});

module.exports = Threads_Message;