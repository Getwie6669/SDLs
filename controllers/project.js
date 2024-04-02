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
    // const stage1 = await Stage.create({
    //     name:"形成問題",
    //     sub_stage:[],
    //     processId:process.id
    // });
    // const stage2 = await Stage.create({
    //     name:"規劃",
    //     sub_stage:[],
    //     processId:process.id
    // });
    // const stage3 = await Stage.create({
    //     name:"執行",
    //     sub_stage:[],
    //     processId:process.id
    // });
    // const stage4 = await Stage.create({
    //     name:"形成結論",
    //     sub_stage:[],
    //     processId:process.id
    // });
    // const stage5 = await Stage.create({
    //     name:"報告與展示",
    //     sub_stage:[],
    //     processId:process.id
    // });

    const stage1 = await Stage.create({
        name:"定標",
        sub_stage:[],
        processId:process.id
    });
    const stage2 = await Stage.create({
        name:"擇策",
        sub_stage:[],
        processId:process.id
    });
    const stage3 = await Stage.create({
        name:"監評",
        sub_stage:[],
        processId:process.id
    });
    const stage4 = await Stage.create({
        name:"調節",
        sub_stage:[],
        processId:process.id
    });
    const stage5 = await Stage.create({
        name:"學習歷程",
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
        description:"這個階段的目標是為了確定研究的主題範圍，並確保主題具有研究價值和實務意義。在這個階段你可以先進行文獻回顧，識別研究領域中的空白或爭議點，再透過討論和思考縮小研究範圍，最後再和小組成員一起確定出一個具體的研究主題。",
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
        description:"這個階段的目標是為了明確研究旨在解決的問題或達到的效果，闡述研究的重要性。在這個階段你可以基於研究主題去細化研究的目標與期望成果，其中也包括了理論與實務層面的貢獻。",
        userSubmit:{
            "提議題目":"input",
            "提議原因":"textarea",
            "相關資料":"textarea",
            "附加檔案":"file",
        },
        stageId:stage1.id
    });
    const sub_stage_1_3 = await Sub_stage.create({
        name:"提出研究問題",
        description:"這個階段的目標是為了定義清晰、具體的研究問題，指導研究的方向與範圍。在這個階段你可以根據研究目的，提出可操作的研究問題，同時確保問題具有明確性和可研究性。",
        userSubmit:{
            "研究假設":"textarea",
            "對應的研究便因":"textarea",
            "附加檔案":"file",
        },
        stageId:stage1.id
    });
    await Stage.findByPk(stage1.id)
    .then(stage1 =>{
        stage1.sub_stage = [sub_stage_1_1.id, sub_stage_1_2.id, sub_stage_1_3.id];
        return stage1.save();
    })
    .catch(err => console.log(err));

    const sub_stage_2_1 = await Sub_stage.create({
        name:"訂定研究構想表",
        description:"這個階段的目標是為了建立研究架構和方法論基礎，明確研究的理論背景和假設。在這個階段你可以一步步地發展出研究概念框架，其中包括了研究假設、變數定義和預期的研究模型。",
        userSubmit:{
            "研究材料與工具":"textarea",
            "研究步驟":"textarea",
            "記錄方式":"textarea",
            "附加檔案":"file",
        },
        stageId:stage2.id
    });
    const sub_stage_2_2 = await Sub_stage.create({
        name:"設計研究記錄表格",
        description:"這個階段的目標是為了為收集資料和記錄研究過程提供標準化工具。在這個階段你可以根據研究問題和方法，設計資料收集表格和記錄表，包括但不限於問卷、訪談記錄和實驗資料表。",
        userSubmit:{
            "紀錄表格":"file"
        },
        stageId:stage2.id
    });
    const sub_stage_2_3 = await Sub_stage.create({
        name:"規劃研究排程",
        description:"這個階段的目標是為了合理安排研究活動的時間表，確保研究工作有秩序地進行。在這個階段你可以制定詳細的研究計畫和時間線，包括各階段的開始和結束日期，以及關鍵活動和里程碑。",
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
        stage2.sub_stage = [sub_stage_2_1.id, sub_stage_2_2.id, sub_stage_2_3.id];
        return stage2.save();
    })
    .catch(err => console.log(err));

    const sub_stage_3_1 = await Sub_stage.create({
        name:"進行嘗試性研究",
        description:"這個階段的目標是為了透過初步的研究活動，驗證研究方法的可行性和有效性。在這個階段你可以在小範圍內實施研究設計，收集和分析數據，評估研究方法和工具的適用性。",
        userSubmit:{
            "實驗記錄":"file",
        },
        stageId:stage3.id
    });
    const sub_stage_3_2 = await Sub_stage.create({
        name:"分析資料與繪圖",
        description:"這個階段的目標是為了對收集到的資料進行系統性分析，透過圖表形式展示研究結果。在這個階段你可以使用統計軟體或手動方法對資料進行分析，包括描述性統計、相關性分析等，並製作圖表來直觀展示分析結果。",
        userSubmit:{
            "資料分析檔案":"file",
        },
        stageId:stage3.id
    });
    const sub_stage_3_3 = await Sub_stage.create({
        name:"撰寫研究成果",
        description:"這個階段的目標是為了詳細記錄研究過程和發現，包括資料分析、討論和結論。在這個階段你可以整理分析數據，撰寫研究報告的各個部分，包括引言、方法、結果、討論和結論。",
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
        name:"檢視研究進度",
        description:"這個階段的目標是為了定期回顧研究工作的進展，確保研究按計畫進行。在這個階段你可以定期檢視研究行程和成果，評估是否需要調整研究方向或方法。",
        userSubmit:{
            "研究討論":"file",
        },
        stageId:stage4.id
    });
    const sub_stage_4_2 = await Sub_stage.create({
        name:"進行研究討論",
        description:"這個階段的目標是為了與導師、同儕或研究小組討論研究發現和問題，以獲得回饋和建議哦。在這個階段你可以組織研究討論會，呈現研究結果，收集與整合回饋意見，對研究進行深入分析與完善。",
        userSubmit:{
            "研究結論":"file",
        },
        stageId:stage4.id
    });
    const sub_stage_4_3 = await Sub_stage.create({
        name:"撰寫研究結論",
        description:"這個階段的目標是為了總結研究的主要發現，討論研究的意義、限制和未來研究的方向。在這個階段你可以基於研究結果和討論，撰寫結論部分，明確指出研究的貢獻和後續研究的建議。",
        userSubmit:{
            "研究結論":"file",
        },
        stageId:stage4.id
    });
    await Stage.findByPk(stage4.id)
    .then(stage4 =>{
        stage4.sub_stage = [sub_stage_4_1.id, sub_stage_4_2.id, sub_stage_4_3.id];
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
