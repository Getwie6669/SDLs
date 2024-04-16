const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Idea_wall = require('./idea_wall');
const Tag = require('./tag');
const Process = require('./process');
const Daily_personal = require('./daily_personal');
const Daily_team = require('./daily_team');
const Chatroom_message = require('./chatroom_message');
const Kanban = require('./kanban');
const Submit = require('./submit');

const Project = sequelize.define('project', {
    name: {
        type: DataTypes.TEXT,
        allowNull:false
    },
    describe: {
        type: DataTypes.TEXT,
        allowNull:false
    },
    mentor: {
        type: DataTypes.TEXT,
        allowNull:false
    },
    referral_code:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    currentStage:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    currentSubStage:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    ProjectEnd: {  // 新增的欄位
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false  // 假設默認值為 false，意味著項目尚未完成
    }
});

// Project.hasMany(Chatroom_message);
Project.hasMany(Tag);
Project.hasMany(Idea_wall);
Project.hasMany(Process);
Project.hasMany(Daily_personal);
Project.hasMany(Daily_team);
Project.hasOne(Kanban);
Project.hasMany(Submit);

module.exports = Project;