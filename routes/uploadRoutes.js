const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const {protect, admin} = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
	destination(req,file,cb) {
		cb(null, 'uploads')
	},
	filename(req,file,cb) {
		cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
	}
})

function checkFileType (file,cb) {
	const filetypes = /jpg|jpeg|png/ 
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
	const mimetype = filetypes.test(file.mimetype)

	if(extname && mimetype) {
		return cb(null,true);
	}
	else {
		cb('images only');
	}
}

const upload = multer({
	storage,
	fileFilter: function(req,file,cb) {
		checkFileType(file,cb)
	}
})


router.post('/', upload.single('image'),protect,admin,(req,res)=> {
	res.send(`https://agile-lowlands-00002.herokuapp.com/uploads/${req.file.filename}`)
})

module.exports = router;