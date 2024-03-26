const Submit = require('../models/submit')
const Project = require('../models/project')
const Idea_wall = require('../models/idea_wall');
const Process = require('../models/process');
const Stage = require('../models/stage');

exports.createSubmit = async(req, res) => {
    const {currentStage, currentSubStage, content, projectId} = req.body;
    const currentStageInt = parseInt(currentStage);
    const currentSubStageInt = parseInt(currentSubStage);
    if(!content){
        return res.status(404).send({message: 'please fill in the form !'})
    }
    if(req.files.length > 0){
        req.files.map(item => {
            const filename = item.filename
            Submit.create({
                stage: `${currentStageInt}-${currentSubStageInt}`,
                content: content,
                projectId: projectId,
                filename:filename
            })
            .catch(err => {
                console.log(err)
                return res.status(500).send({message: 'create failed!'});
            });
        })
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
    const allSubmit = await Submit.findAll({
        where:{
            projectId:projectId
        }
    })
    if(allSubmit === null){
        res.status(500).send({message: 'get protfolio failed!'});
    }else{
        res.status(200).json(allSubmit)
    }
}
exports.getSubmit = async(req, res) => {
    const submitId = req.params.submitId;
    console.log("submitId",submitId);
    const submit = await Submit.findByPk(submitId)
    if(submit.filename === null){
        console.log("null");
        res.status(500).send({message: 'get protfolio failed!'});
    }else{
        console.log("dowwnload");
        res.download(`./daily_file/${submit.filename}`)
    }
}