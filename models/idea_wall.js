const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Node = require('./node');
const Node_relation = require('./node_relation')

const Idea_wall = sequelize.define('idea_wall', {
    name: {
        type: DataTypes.TEXT,
        allowNull:true
    },
    type:{
        type: DataTypes.TEXT,
        allowNull:false
    },
    stage:{
        type: DataTypes.TEXT,
        allowNull:true
    }
});
Idea_wall.hasMany(Node);
Idea_wall.hasMany(Node_relation);

module.exports = Idea_wall;


