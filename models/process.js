const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Stage = require('./stage');

const Process = sequelize.define('process', {
    stage: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull:false,
    }
});
Process.hasMany(Stage);

module.exports = Process;

// (async () => {
//     await sequelize.sync();
//     await Process.create({
//         name:"default",
//         phase:[1,2],
//         projectId:1
//     });
//     await Phase.create({
//         name:"形成問題",
//         sub_phase:[1,2],
//         prcesssId:1
//     });
//     await Sub_phase.create({
//         name:"提出研究主題",
//         discription:"在 1-1 的階段中，提出你感興趣的主題，並提供完整資訊分享給同組的夥伴，並再與小組討論完後，繳交上傳。",
//         userSubmit:{
//             "提議主題":"input",
//             "主題來源":"input",
//             "附加檔案":"file",
//             "提議原因":"textarea",
//         },
//         phaseId:1
//     });
//     await Sub_phase.create({
//         name:"提出研究目的",
//         discription:"根據剛剛所想的研究主題，蒐集相關資料，並和組員討論出合適的題目。",
//         userSubmit:{
//             "提議題目":"input",
//             "提議原因":"textarea",
//             "相關資料":"textarea",
//             "附加檔案":"file",
//         },
//         phaseId:1
//     });
// })();