const Submit = require('../models/submit')
const Project = require('../models/project')
const Idea_wall = require('../models/idea_wall');
const Process = require('../models/process');
const Stage = require('../models/stage');

exports.createSubmit = async(req, res) => {
    const {currentStage, currentSubStage, content, projectId} = req.body;
    const currentStageInt = parseInt(currentStage);
    const currentSubStageInt = parseInt(currentSubStage);

    const fs = require('fs').promises; // 使用 Promise 接口

    if(!content){
        return res.status(404).send({message: 'please fill in the form !'})
    }
    if(req.files.length > 0){
        try {
            await Promise.all(req.files.map(async (item) => {
                // const fileData = item.fileData;
                console.log("CreateItem:",item)
               
                const fileData = await fs.readFile(item.path);
                
                return Submit.create({
                    stage: `${currentStageInt}-${currentSubStageInt}`,
                    content: content,
                    projectId: projectId,
                    fileData: fileData ,
                    fileName: item.filename
                });
            }));
        } catch(err) {
            console.log(err);
            return res.status(500).send({message: 'create failed!'});
        }
    }else{
        await Submit.create({
            stage: `${currentStageInt}-${currentSubStageInt}`,
            content: content,
            projectId: projectId,
        })
    }
    //check next stage
    const process = await Process.findAll({ 
        attributes:[
            'stage', 
        ],
        where :{
            projectId:projectId
        },
        
    })
    const stage = await Stage.findAll({ 
        attributes:[
            'sub_stage'
        ],
        where :{  
            id:process[0].stage[currentStageInt-1]
        },
    })

    if(currentSubStageInt+1 <= stage[0].sub_stage.length){
        await Project.update({
            currentSubStage:currentSubStageInt+1
        },{
            where:{
                id: projectId
            }
        })
        await Idea_wall.create({
            type:"project",
            projectId:projectId,
            stage:`${currentStageInt}-${currentSubStageInt+1}`
        })
        .then(() =>{
        return res.status(200).send({message: 'create success!'});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({message: 'create failed!'});
        })
    }else if(currentStageInt === process[0].stage.length && currentSubStageInt === stage[0].sub_stage.length){
        return res.status(200).send({message: 'done'});
    }else{
        await Project.update({
            currentStage:currentStageInt+1,
            currentSubStage:1
        },{
            where:{
                id: projectId
            }
        });
        await Idea_wall.create({
            type:"project",
            projectId:projectId,
            stage:`${currentStageInt+1}-${currentSubStageInt}`
        })
        .then(() =>{
        return res.status(200).send({message: 'create success!'});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({message: 'create failed!'});
        })
    }
}

exports.getAllSubmit = async(req, res) => {
    const { projectId } = req.query;
    try {
        const allSubmit = await Submit.findAll({
            where: {
                projectId: projectId
            }
        });

        // 通过Promise.all异步转换所有BLOB数据
        const submitsWithBase64 = await Promise.all(allSubmit.map(async (submit) => {
            // 检查是否有fileData字段，且不为空
            const submitJson = submit.toJSON();
            // console.log(submitJson)
            if (submit.fileData) {
                // 将BLOB转换为Base64字符串
                console.log(submit.fileData)
                console.log("======================")

                // const base64Data = submit.fileData.toString('base64');
                // 返回修改后的对象（或者你可以选择添加一个新字段）
                return {
                    ...submit.toJSON(), // 其他字段不变
                    // fileData: base64Data // 替换fileData为其Base64字符串
                };
            } else {
                // 没有fileData字段或为空，直接返回原对象
                return submit.toJSON();
            }
        }));

        res.status(200).json(submitsWithBase64);
    } catch (error) {
        console.error("Error in getAllSubmit:", error);
        res.status(500).send({ message: '获取项目失败！' });
    }
};

// exports.getAllSubmit = async(req, res) => {
//     const { projectId } = req.query;
//     const allSubmit = await Submit.findAll({
//         where:{
//             projectId:projectId
//         }
//     })
//     if(allSubmit === null){
//         res.status(500).send({message: 'get protfolio failed!'});
//     }else{
//         console.log("allSubmit",allSubmit)
//         res.status(200).json(allSubmit)
//     }
// }
exports.getSubmit = async(req, res) => {
    const submitId = req.params.submitId;
    console.log("submitId",submitId);
    const submit = await Submit.findByPk(submitId)
    if(submit.fileData === null){
        console.log("null");
        res.status(500).send({message: 'get protfolio failed!'});
    }else{
        console.log("dowwnload");
        console.log("fileData",submit.fileData)
        // res.download(`./daily_file/${submit.fileData.filename}`)
    }
}