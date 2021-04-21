const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const isAuth = require('../middleware/isAuth');
const validation = require('../validations/userValidation');
const uploads = require('../middleware/fileUpload');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router(); //mini app

router.put('/updateProfile', isAuth,
multer({storage: uploads.fileStorage, fileFilter: uploads.fileFilter}).single('pic'),validation.updateProfile ,
userController.updateProfile);
router.get('/getUsers', isAuth, isAdmin, userController.getAllUsers); //for admin only
router.get('/filter', isAuth,validation.filter , userController.filter); //x validation hena x l input
router.get('/', isAuth, userController.myProfile);//l profile bta3i ana 
router.get('/:userId', isAuth, userController.getUser); //profile user mo3yn
router.delete('/blockUser/:userId', isAuth, isAdmin, userController.blockUser);
router.put('/makeAdmin', isAuth, isAdmin, validation.makeAdmin , userController.makeAdmin);
router.put('/changePass', isAuth, validation.changePass ,userController.changePass);

module.exports = router;