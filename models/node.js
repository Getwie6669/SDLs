const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const Node = sequelize.define('node', {
    title: {
        type: DataTypes.TEXT,
        allowNull:false
    },
    content:{
        type: DataTypes.TEXT,
        allowNull:true
    },
    owner:{
        type: DataTypes.TEXT,
        allowNull:false
    },
    colorindex:{
        type: DataTypes.INTEGER,
        allowNull:true
    }
});

Node.belongsToMany(Node, {as:"from_id" , through:"Node_Relation"});
Node.belongsToMany(Node, {as:"to_id" , through:"Node_Relation"});

module.exports = Node;