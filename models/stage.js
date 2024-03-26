const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Sub_stage = require('./sub_stage');

const Stage = sequelize.define('stage', {
    name: {
        type: DataTypes.TEXT,
        allowNull:false,
    },
    sub_stage:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull:false,
    }
});
Stage.hasMany(Sub_stage);

module.exports = Stage;