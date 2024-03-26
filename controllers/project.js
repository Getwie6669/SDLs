const Project = require('../models/project')
const User = require('../models/user')
const Kanban = require('../models/kanban');
const Column = require('../models/column');
const shortid = require('shortid')
const Idea_wall = require('../models/idea_wall');
const Process = require('../models/process');
const Stage = require('../models/stage');
const Sub_stage = require('../models/sub_stage');
const User_project = require('../models/userproject');

exports.getProject = async(req, res) =>{
    const projectId = req.params.projectId;
    await Project.findByPk(projectId)
        .then(result =>{
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => console.log(err));
}

exports.getAllProject = async(req, res) => {
    const userId = req.query.userId;
    await Project.findAll({ 
        include:[{
            model:User,
            attributes:[],
            where :{
            id:userId
        },
        }] 
    })
    .then(result =>{
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err => console.log(err));

    
    // user.getProject()
    //     .then(result =>{
    //         console.log(result);
    //         res.status(200).json({ project: result})
    //     })
    //     .catch(err => console.log(err));
}

exports.createProject = async(req, res) => {
    const projectName = req.body.projectName;
    const projectdescribe = req.body.projectdescribe;
    const projectMentor = req.body.projectMentor;
    const referral_code = shortid.generate();
    if(!projectName || !projectdescribe){
        return res.status(404).send({message: '請輸入資料!'})
    }
    const createdProject = await Project.create({
        name: projectName,
        describe: projectdescribe,
        mentor: projectMentor,
        referral_code: referral_code,
        currentStage:1,
        currentSubStage:1
    });
    const userId = req.body.userId;
    const creater = await User.findByPk(userId);
    const userProjectAssociations = await createdProject.addUser(creater);

    //initailize kanban
    const kanban = await Kanban.create({column:[], projectId:createdProject.id});
    const todo = await Column.create({name:"待處理", task:[], kanbanId:kanban.id});
    const inProgress = await Column.create({name:"進行中", task:[], kanbanId:kanban.id});
    const Completed = await Column.create({name:"完成", task:[], kanbanId:kanban.id});
    await Kanban.findByPk(kanban.id)
    .then(kanban =>{
        kanban.column = [todo.id, inProgress.id, Completed.id ];
        return kanban.save();
    })
    .catch(err => console.log(err));

    await Idea_wall.create({
        type:"project",
        projectId:createdProject.id,
        stage:`${createdProject.currentStage}-${createdProject.currentSubStage}`
    })
    .then(() =>{
        res.status(200).send({message: '活動創建成功!'})
    })
    .catch(err => console.log(err));

    //initailize process
    const process = await Process.create({
        stage:[],
        projectId:createdProject.id
    });
    const stage1 = await Stage.create({
        name:"形成問題",
        sub_stage:[],
        processId:process.id
    });
    const stage2 = await Stage.create({
        name:"規劃",
        sub_stage:[],
        processId:process.id
    });
    const stage3 = await Stage.create({
        name:"執行",
        sub_stage:[],
        processId:process.id
    });
    const stage4 = await Stage.create({
        name:"形成結論",
        sub_stage:[],
        processId:process.id
    });
    const stage5 = await Stage.create({
        name:"報告與展示",
        sub_stage:[],
        processId:process.id
    });

    await Process.findByPk(process.id)
    .then(process =>{
        process.stage = [stage1.id, stage2.id, stage3.id, stage4.id, stage5.id];
        return process.save();
    })
    .catch(err => console.log(err));

    const sub_stage_1_1 = await Sub_stage.create({
        name:"提出研究主題",
        description:"在 1-1 的階段中，提出你感興趣的主題，並提供完整資訊分享給同組的夥伴，並再與小組討論完後，繳交上傳。",
        userSubmit:{
            "提議主題":"input",
            "主題來源":"input",
            "附加檔案":"file",
            "提議原因":"textarea",
        },
        stageId:stage1.id
    })
    const sub_stage_1_2 = await Sub_stage.create({
        name:"提出研究目的",
        description:"根據剛剛所想的研究主題，蒐集相關資料，並和組員討論出合適的題目。",
        userSubmit:{
            "提議題目":"input",
            "提議原因":"textarea",
            "相關資料":"textarea",
            "附加檔案":"file",
        },
        stageId:stage1.id
    });
    await Stage.findByPk(stage1.id)
    .then(stage1 =>{
        stage1.sub_stage = [sub_stage_1_1.id, sub_stage_1_2.id];
        return stage1.save();
    })
    .catch(err => console.log(err));

    const sub_stage_2_1 = await Sub_stage.create({
        name:"提出研究問題",
        description:"接下來，你們要提出研究問題作為你們研究的目標，選擇「先做發散性思考」，還是「先做嘗試性實驗」。「先做發散性思考」請思考5W1H的方式，與誰有關?什麼時候?什麼地點?什麼事物?為什麼?如何?確認研究問題；「先做嘗試性實驗」先將已有的構想，簡略再想法牆上的說明實驗規劃，會用到那些研究器材、實驗步驟、記錄那些資料，在規劃完後，照著構想做幾次實驗，確認可行性，再進行「先做發散性思考」，確認研究問題。最後與小組成員討論出研究可能之相關變因與研究問題",
        userSubmit:{
            "研究假設":"textarea",
            "對應的研究便因":"textarea",
            "附加檔案":"file",
        },
        stageId:stage2.id
    });
    const sub_stage_2_2 = await Sub_stage.create({
        name:"訂定研究構想表",
        description:"請跟小組進行討論，填寫實驗所需使用的研究材料、研究步驟，以及記錄方式。",
        userSubmit:{
            "研究材料與工具":"textarea",
            "研究步驟":"textarea",
            "記錄方式":"textarea",
            "附加檔案":"file",
        },
        stageId:stage2.id
    });
    const sub_stage_2_3 = await Sub_stage.create({
        name:"設計研究記錄表格",
        description:"瀏覽上一階段所訂定研究構想表，與小組討論出合適的紀錄表格。",
        userSubmit:{
            "紀錄表格":"file"
        },
        stageId:stage2.id
    });
    const sub_stage_2_4 = await Sub_stage.create({
        name:"進行嘗試性研究",
        description:"請先瀏覽研究構想後，與小組討論嘗試性實驗的結果，紀錄實驗結果。",
        userSubmit:{
            "研究成果":"input",
            "結果說明":"textarea",
            "應注意和改進事項":"textarea",
            "附加檔案":"file",
        },
        stageId:stage2.id
    });

    await Stage.findByPk(stage2.id)
    .then(stage2 =>{
        stage2.sub_stage = [sub_stage_2_1.id, sub_stage_2_2.id, sub_stage_2_3.id, sub_stage_2_4.id];
        return stage2.save();
    })
    .catch(err => console.log(err));

    const sub_stage_3_1 = await Sub_stage.create({
        name:"進行嘗試性研究",
        description:"請先瀏覽研究構想後，與小組討論嘗試性實驗的結果，可以將過程撰寫在實驗日誌中。",
        userSubmit:{
            "實驗記錄":"file",
        },
        stageId:stage3.id
    });
    const sub_stage_3_2 = await Sub_stage.create({
        name:"分析資料與繪圖",
        description:"請先瀏覽研究構想後，與小組討論實驗分析與圖表並上傳資料分析。",
        userSubmit:{
            "資料分析檔案":"file",
        },
        stageId:stage3.id
    });
    const sub_stage_3_3 = await Sub_stage.create({
        name:"撰寫研究成果",
        description:"請先瀏覽研究構想、實驗日誌與實驗分析後，與小組討論並撰寫成word檔案上傳。",
        userSubmit:{
            "研究成果":"input",
            "結果說明":"textarea",
            "應注意和改進事項":"textarea",
            "附加檔案":"file",
        },
        stageId:stage3.id
    });

    await Stage.findByPk(stage3.id)
    .then(stage3 =>{
        stage3.sub_stage = [sub_stage_3_1.id, sub_stage_3_2.id, sub_stage_3_3.id];
        return stage3.save();
    })
    .catch(err => console.log(err));

    const sub_stage_4_1 = await Sub_stage.create({
        name:"進行研究討論",
        description:"進行一般性討論，針對實驗結果做討論，探討背後隱含的科學原理，再進行綜合性討論，針對有些實驗結果彼此之間的因果關係，需要放在一起討論才有意義。",
        userSubmit:{
            "研究討論":"file",
        },
        stageId:stage4.id
    });
    const sub_stage_4_2 = await Sub_stage.create({
        name:"撰寫研究結論",
        description:"根據研究結果與研究討論的內容提出可能的研界結論，並與小組成員一同進行討論。",
        userSubmit:{
            "研究結論":"file",
        },
        stageId:stage4.id
    });

    await Stage.findByPk(stage4.id)
    .then(stage4 =>{
        stage4.sub_stage = [sub_stage_4_1.id, sub_stage_4_2.id];
        return stage4.save();
    })
    .catch(err => console.log(err));

    const sub_stage_5_1 = await Sub_stage.create({
        name:"統整作品報告書",
        description:"在將科展作品拿去參加科展競賽之前,必須統整出作品說明書，須包含封面、摘要、目錄、研究問題、研究設備及器材、研究過程與結果、實驗結果、研究討論、結論與參考文獻。",
        userSubmit:{
            "研究結論":"file",
        },
        stageId:stage5.id
    });

    await Stage.findByPk(stage5.id)
    .then(stage5 =>{
        stage5.sub_stage = [sub_stage_5_1.id];
        return stage5.save();
    })
    .catch(err => console.log(err));
    
}


exports.inviteForProject = async (req, res) => {
    const referral_Code = req.body.referral_Code;
    const userId = req.body.userId;

    console.log('Referral Code:', referral_Code);
    console.log('User ID:', userId);

    if (!referral_Code) {
        console.log('Referral code is missing!');
        return res.status(400).json({ message: '請輸入邀請碼!' });
    }

    try {
        // 查找具有给定邀请码的项目
        const referralProject = await Project.findOne({
            where: {
                referral_code: referral_Code
            }
        });

        // 检查是否找到了项目
        if (!referralProject) {
            console.log('Project not found for referral code:', referral_Code);
            return res.status(404).json({ message: '邀請碼不存在!' });
        }
        console.log("projectId:", referralProject.id); // 添加日志输出
        console.log("userId:", userId); // 添加日志输出
        // 检查用户是否已经存在于项目中
        const userProject = await User_project.findOne({
            where: {
                projectId: referralProject.id,
                userId: userId
            }
            
        });
        console.log("userProject:", userProject); // 添加日志输出

        if (userProject) {
            console.log('User already exists in project!');
            return res.status(400).json({ message: '你已經是此活動的其中一員!' });
        } 

        // 找到用户
        const invitedUser = await User.findByPk(userId);
        if (!invitedUser) {
            console.log('User not found:', userId);
            return res.status(404).json({ message: 'User not found!' });
        }

        // 将用户加入项目
        await referralProject.addUser(invitedUser);

        console.log('Successfully invited user to project!');
        // 成功邀请用户加入项目
        return res.status(200).json({ message: '成功加入活動!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error!' });
    }
};

// exports.inviteForProject = async( req, res) => {
//     const referral_Code = req.body.referral_Code;
//     const userId = req.body.userId;
//     console.log(userId);
//     if(!referral_Code){
//         return res.status(404).send({message: 'please enter referral code!'})
//     }
//     const referralProject = await Project.findOne({
//         where:{
//             referral_code:referral_Code
//         }
//     })
//     const invited = await User.findByPk(userId);
//     const userProjectAssociations = await referralProject.addUser(invited)
//     .then(() => {
//             return res.status(200).send({message: 'invite success!'})
//     })
//     .catch(err => {
//         console.log(err);
//         return res.status(500).send({message: 'invite failed!'})
//     });

// }





// exports.updateProject = async(req, res) => {
//     const projectId = req.body.projectId;
//     const projectName = req.body.projectName;
//     const projectdescribe = req.body.projectdescribe;
//     const projectMentor = req.body.projectMentor;
//     const userId = req.body.userId
//     Project.findByPk(projectId)
//     .then(project =>{
//         if(!project){
//             return res.status(404).json({ message: 'Project not found!' });
//         }
//         project.name = projectName;
//         project.describe = projectdescribe;
//         project.mentor = projectMentor;
//         project.userId = userId;
//         return project.save();
//     })
//     .then(() => {
//         res.status(200).json({message: 'project updated!'});
//     })
//     .catch(err => console.log(err));
// }

// exports.deleteProject = async(req, res) => {
//     const projectId = req.body.projectId;
//     User.findByPk(projectId)
//         .then(project =>{
//             if (!project) {
//                 return res.status(404).json({ message: 'project not found!' });
//             }
//             return User.destroy({
//                 where: {
//                 id: projectId
//                 }
//             });
//         })
//         .then(result => {
//             res.status(200).json({ message: 'project deleted!' });
//         })
//         .catch(err => console.log(err));
// }
