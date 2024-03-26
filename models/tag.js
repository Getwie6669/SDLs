const {DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const Tag = sequelize.define('tag', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull:false
    }, 
    bg_color: {
        type: DataTypes.TEXT,
        allowNull:false
    },
    text_color: {
        type: DataTypes.TEXT,
        allowNull:false
    },   
});
module.exports = Tag;
