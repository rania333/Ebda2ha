const express = require('express');
const authController = require('../controllers/authController');
const isAuth = require('../middleware/isAuth');
const validation = require('../validations/userValidation');
const router = express.Router(); //mini app

router.post('/signUp', validation.registerValidation, authController.signUp);
router.put('/verifyNow', authController.verifyEmail);
router.post('/logIn', validation.logInValidation, authController.logIn);
router.put('/resetPassword', validation.getResetPass, authController.getResetPass);
router.put('/postNewPass/:token', validation.postResetPass, authController.postNewPass);
module.exports = router;