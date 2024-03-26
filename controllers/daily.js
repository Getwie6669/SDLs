const Daily_personal =  require('../models/daily_personal');
const Daily_team =  require('../models/daily_team');

exports.getPersonalDaily = async( req, res) => {
    const { userId, projectId } = req.query;
    const personalDaily = await Daily_personal.findAll({
        where:{
            projectId:projectId,
            userId:userId
        }
    })
    .then(result =>{
        res.status(200).json(result)
    })
    .catch(err => console.log(err));

}

exports.createPersonalDaily = async( req, res) => {
    const { userId, projectId, title, content } = req.body;
    if(!title){
        return res.status(404).send({message: 'please enter title!'})
    }
    console.log("req files",req.files);
    if(req.files.length > 0){
        req.files.map(item => {
            const filename = item.filename
            Daily_personal.create({
                userId:userId,
                projectId:projectId,
                title:title,
                content:content,
                filename:filename
            })
            .then(() =>{
                console.log("1");
                return res.status(200).send({message: 'create success!'})
            })
            .catch(err => {
                console.log(err)
                return res.status(500).send({message: 'create failed!'});
            });
        })
    }else{
        await Daily_personal.create({
            userId:userId,
            projectId:projectId,
            title:title,
            content:content,
        })
        .then(() =>{
            console.log("2");
            return res.status(200).send({message: 'create success!'});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({message: 'create failed!'});
        });
    }
}

exports.getTeamDaily = async( req, res) => {
    const { projectId } = req.query;
    const teamDaily = await Daily_team.findAll({
        where:{
            projectId:projectId,
        }
    })
    .then(result =>{
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err => console.log(err));
}

exports.createTeamDaily = async( req, res) => {
    const { userId, projectId, title, content, stage, type } = req.body;
    if(!title){
        return res.status(404).send({message: 'please enter title!'})
    }
    console.log(Boolean(req.files.length > 0));
    if(req.files.length > 0){
        req.files.map(item => {
            const filename = item.filename
            Daily_team.create({
                userId:userId,
                projectId:projectId,
                title:title,
                content:content,
                filename:filename,
                stage:stage,
                type:type
            })
            .then(() =>{
                return res.status(200).send({message: 'create success!'})
            })
            .catch(err => {
                console.log(err)
                return res.status(500).send({message: 'create failed!'});
            });
        })
    }else{
        await Daily_team.create({
            userId:userId,
            projectId:projectId,
            title:title,
            content:content,
            stage:stage,
            type:type
        })
        .then(() =>{
            return res.status(200).send({message: 'create success!'});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({message: 'create failed!'});
        });
    }
}