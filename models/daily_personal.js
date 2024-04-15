const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const Daily_personal = sequelize.define('daily_personal', {
    title:{
        type: DataTypes.TEXT,
        allowNull:false,
    },
    content:{
        type: DataTypes.TEXT,
        allowNull:false,
    },
    fileData:{
        type: DataTypes.BLOB,
        allowNull:true,
    },
    filename:{
        type: DataTypes.TEXT,
        allowNull:true,
    }
});

module.exports = Daily_personal;
