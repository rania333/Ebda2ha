const express = require('express');
const multer = require('multer');
const postController = require('../controllers/postController');
const validation = require('../validations/postValidation');
const isAuth = require('../middleware/isAuth');
const uploads = require('../middleware/fileUpload');


const router = express.Router();
router.post('/',validation.createAndUpdatePost, isAuth,
multer({storage: uploads.fileStorage, fileFilter: uploads.fileFilter}).array('pic', 50)
, postController.createPost);//by title, content , categoryId,pic
router.get('/search',validation.search, isAuth, postController.search);//by key
router.get('/filter',validation.filter, isAuth, postController.filter);//by categoryId
router.get('/:postId', isAuth, postController.findPost);
router.get('/', isAuth, postController.getAllPost);
router.put('/:postId',validation.createAndUpdatePost, isAuth,
multer({storage: uploads.fileStorage, fileFilter: uploads.fileFilter}).array('pic', 50),
postController.updatePost);//same as create 
router.delete('/:postId', isAuth, postController.deletePost)

module.exports = router 