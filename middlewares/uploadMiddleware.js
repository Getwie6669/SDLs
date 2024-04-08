const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "daily_file")
    },
    filename: ( req, file, cb) =>{
        const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, fileName);
        // fixedFileName = Buffer.from(file.originalname, 'latin1').toString("utf-8");
        // return cb( null, Date.now() + path.extname(fixedFileName))
    }
})

const upload = multer({storage:storage});

module.exports = { upload };