const express = require('express');
const multer = require('multer');
const postController = require('../controllers/postController');
const isAuth = require('../middleware/isAuth');
const uploads = require('../middleware/fileUpload');

const router = express.Router();
router.post('/', isAuth,
multer({storage: uploads.fileStorage, fileFilter: uploads.fileFilter}).array('pic', 50)
, postController.createPost);
router.get('/search', isAuth, postController.search);
router.get('/filter', isAuth, postController.filter);
router.get('/:postId', isAuth, postController.findPost);
router.get('/', isAuth, postController.getAllPost);
router.put('/:postId', isAuth,
multer({storage: uploads.fileStorage, fileFilter: uploads.fileFilter}).array('pic', 50),
postController.updatePost);
router.delete('/:postId', isAuth, postController.deletePost)

module.exports = router 