const controller = require('../controllers/stage');
const router = require('express').Router();

router.post('/', controller.getSubStage); 
router.get('/', controller.getWholeStage);

module.exports = router;