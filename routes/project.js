const controller = require('../controllers/project');
const router = require('express').Router();
const { validateToken } = require('../middlewares/AuthMiddleware')

router.get('/:projectId', controller.getProject);
router.get('/', controller.getAllProject);
router.post('/', controller.createProject);
router.post('/referral', controller.inviteForProject)
// router.put('/:projectId', controller.updateProject);
// router.delete('/:projectId', controller.deleteProject);

module.exports = router;