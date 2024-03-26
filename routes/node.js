const controller = require('../controllers/node');
const router = require('express').Router();

router.get('/:ideaWallId', controller.getNodes); //
router.post('/node', controller.createNode);
router.get('/node_relation/:ideaWallId', controller.getNodeRelation); //
router.post('/node_relation', controller.createNodeRelation);
module.exports = router;