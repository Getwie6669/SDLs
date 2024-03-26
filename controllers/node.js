const Node = require('../models/node');
const Node_relation = require('../models/node_relation')

exports.createNode = async(req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const ideaWallId = req.body.ideaWallId;
    await Node.create({
        title:title,
        content:content,
        ideaWallId:ideaWallId
    }).then(result =>{
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err => console.log(err));
}

exports.getNodes = async(req, res) => {
    const ideaWallId = req.params.ideaWallId
    console.log(ideaWallId);
    await Node.findAll({
        where:{
            ideaWallId:ideaWallId
        }
    }).then(result =>{
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err => console.log(err));
}

exports.getNodeRelation = async(req, res) => {
    const ideaWallId = req.params.ideaWallId
    await Node_relation.findAll({
        attributes:[
            'from_id', 
            'to_id'
        ],
        where:{
            ideaWallId:ideaWallId
        }
    }).then(result =>{
        const temp = [];
        result.map( item => {
            temp.push({
                "from":item.from_id,
                "to":item.to_id
            });
        })
        res.status(200).json(temp)
    })
    .catch(err => console.log(err));
}

exports.createNodeRelation = async(req, res) => {
    const from_id = req.body.from_id;
    const to_id = req.body.to_id;
    const ideaWallId = req.body.ideaWallId;
    await Node_relation.create({
        from_id:from_id,
        to_id:to_id,
        ideaWallId:ideaWallId
    }).then(result =>{
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err => console.log(err));
}
