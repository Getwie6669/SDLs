const controller = require('../controllers/kanban');
const router = require('express').Router();

router.get('/:projectId', controller.getKanban);
router.get('/columns/:columnId', controller.getKanbanTask);
//router.post('/', controller.createKanban);
// router.put('/:projectId', controller.updateKanban);
// router.delete('/:projectId', controller.deleteKanban);

module.exports = router;