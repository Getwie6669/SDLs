const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const Daily_team = sequelize.define('daily_team', {
    stage: {
        type: DataTypes.TEXT,
        allowNull:false,
    },
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
    },
    type:{
        type: DataTypes.TEXT,
        allowNull:false,
    }
});

module.exports = Daily_team;