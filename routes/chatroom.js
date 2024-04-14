const router = require('express').Router();
const controller = require('../controllers/chatroom'); // 确保路径正确

// 获取聊天室历史消息
router.get('/history/:projectId', controller.getChatroomHistory);

module.exports = router;
