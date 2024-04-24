const controller = require('../controllers/submit');
const router = require('express').Router();
const {upload} = require('../middlewares/uploadMiddleware')

router.post('/', upload.array("attachFile"), controller.createSubmit);
router.get('/', controller.getAllSubmit);
router.get('/:submitId', controller.getSubmit)
// router.get('/:submitId/profolio', controller.getProfolioSubmit)
module.exports = router;