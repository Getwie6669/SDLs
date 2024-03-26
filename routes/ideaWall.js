const controller = require('../controllers/ideaWall');
const router = require('express').Router();

router.get('/:projectId/:stage', controller.getIdeaWall); //
router.get('/', controller.getAllIdeaWall); //query
router.post('/', controller.createIdeaWall);

module.exports = router;