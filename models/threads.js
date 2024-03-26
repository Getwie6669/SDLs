const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Threads_Message = require('./threads_message');

const Threads = sequelize.define('threads',{
    title:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    content:{
        type: DataTypes.TEXT,
        allowNull:true
    }
});

Threads.hasMany(Threads_Message);

module.exports = Threads;