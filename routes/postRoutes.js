const express = require('express');
const multer = require('multer');
const postController = require('../controllers/postController');
const validation = require('../validations/postValidation');
const isAuth = require('../middleware/isAuth');
const uploads = require('../middleware/fileUpload');

const router = express.Router();

router.get('/approved', isAuth, postController.allapprovedPosts);
router.put('/approved/:postId', isAuth, postController.approvedPost);
router.delete('/approved/:postId', isAuth, postController.deleteApprovedPost);

router.post('/',validation.createAndUpdatePost, isAuth,
    uploads.array('pic', 50), postController.createPost, (err, req, res, nxt) => { //l rab3a de to handle error
        res.status(400).send({
            error: err.message
        })
});//by title, content , categoryId,pic
router.get('/search',validation.search, isAuth, postController.search);//by key
router.get('/filter',validation.filter, isAuth, postController.filter);//by categoryId
router.get('/:postId', isAuth, postController.findPost);
router.get('/', isAuth, postController.getAllPost);
router.put('/:postId',validation.createAndUpdatePost, isAuth,
    uploads.array('pic', 50),postController.updatePost,(err, req, res, nxt) => { //l rab3a de to handle error
        res.status(400).send({
            error: err.message
        })
});//same as create 
router.delete('/:postId', isAuth, postController.deletePost);

module.exports = router 