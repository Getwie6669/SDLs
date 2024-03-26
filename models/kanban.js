const {DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Column = require('./column');

const Kanban = sequelize.define('kanban', {
    column: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull:true
    },  
});

Kanban.hasMany(Column);
module.exports = Kanban;

// (async () => {
//     await sequelize.sync();
//     //Code here
//     await Kanban.create({
//         name:"ToDo",
//         column:[1,2,3],
//         projectId:1
//     });
//     await Column.create({
//         name:"ToDo",
//         task:[1,2],
//         kanbanId:1
//     },{
//         include: [ Task ]
//     });
//     await Column.create({
//         name:"In Progress",
//         task:[3],
//         kanbanId:1
//     },{
//         include: [ Task ]
//     })
//     await Column.create({
//         name:"Completed",
//         task:[4,5],
//         kanbanId:1
//     },{
//         include: [ Task ]
//     })
//     await Task.create({
//         title: "website redesign.",
//         content:"dashboard",
//         labels:[
//             {
//                 "content":"優先處理",
//                 "bgcolor":"bg-blue-500",
//                 "textcolor":"text-white",
//             }
//         ],
//         assignees: [
//             {
//                 "userId": "Wuret",
//                 "bgcolor":"bg-purple-100"
//             },
//             {
//                 "userId": "YY",
//                 "bgcolor":"bg-purple-50"
//             }
//         ],
//         columnId:1,
//     });
//     await Task.create({
//         title: "react",
//         content:"cra is dead",
//         labels:[],
//         assignees: [
//             {
//                 "userId": "YY",
//                 "bgcolor":"bg-purple-50"
//             },
//             {
//                 "userId": "YY",
//                 "bgcolor":"bg-purple-50"
//             }
//         ],
//         columnId:1,
//     });
//     await Task.create({
//         title: "vite",
//         content:"veet",
//         labels:[
//             {
//                 "content":"優先處理",
//                 "bgcolor":"bg-blue-500",
//                 "textcolor":"text-white",
//             }
//         ],
//         assignees: [
//             {
//                 "userId": "YY",
//                 "bgcolor":"bg-purple-50"
//             }
//         ],
//         columnId:2,
//     });
//     await Task.create({
//         title: "react-beautiful-dnd",
//         content:"react-beautiful-dnd",
//         labels:[],
//         assignees: [
//             {
//                 "userId": "Wuret",
//                 "bgcolor":"bg-purple-100"
//             }
//         ],
//         columnId:3,
//     });
//     await Task.create({
//         title: "react-dnd",
//         content:"react-dnd",
//         labels:[],
//         assignees: [
//             {
//                 "userId": "Dnd",
//                 "bgcolor":"bg-purple-200"
//             }
//         ],
//         columnId:3,
//     });
//     })();


