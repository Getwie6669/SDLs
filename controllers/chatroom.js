// const  Chatroom_message  = require('../models/chatroom_message'); // 确保路径正确
const Chatroom_message = require('../models/chatroom_message')

exports.getChatroomHistory = async (req, res) => {
    const projectId = req.params.projectId;
    console.log("Chatroom_message",Chatroom_message); // 查看输出，确保它不是 undefined

    // try {
    //     const messages = await Chatroom_message.findAll({
    //         where: { projectId: projectId },
    //         order: [['createdAt', 'ASC']]
    //     });
    //     res.json(messages);
    // } catch (error) {
    //     console.log(error)
    //     res.status(500).send({ message: '获取历史消息失败', error: error });
    // }

    await Chatroom_message.findAll({
        where: { projectId: projectId },
        order: [['createdAt', 'ASC']]
    })
        .then(result => {
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => console.log(err));
};
