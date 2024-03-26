const controller = require('../controllers/daily');
const router = require('express').Router();
const {upload} = require('../middlewares/uploadMiddleware')

router.get('/', controller.getPersonalDaily); 
router.get('/team', controller.getTeamDaily);
router.post('/',upload.array("attachFile"), controller.createPersonalDaily);
router.post('/team',upload.array("attachFile"), controller.createTeamDaily);

module.exports = router;