const router = require('express').Router();
const multer = require('multer');
const { validateToken } = require('../config/jwt.config');
const uploaded = multer({ dest: 'uploads/' });
const FilesController = require('../controllers/files.controller');

router.post('/upload', [validateToken, uploaded.single('photo')], FilesController.upload);

module.exports = router;
