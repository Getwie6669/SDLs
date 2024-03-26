const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const Node_relation = sequelize.define('node_relation', {
    from_id: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    to_id:{
        type: DataTypes.INTEGER,
        allowNull:false
    }
});

module.exports = Node_relation;