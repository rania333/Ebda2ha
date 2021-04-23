const {body} = require('express-validator');
const aboutUsModel = require('../models/aboutUsModel');
const { notify } = require('../routes/aboutUsRoutes');


const Name = body('name')
.exists().withMessage('please enter your name')
.isAlphanumeric().withMessage('name should be letters or / and characters only');

const email = body('email')
.exists().withMessage('enter email')
.isEmail().withMessage('please enter a valid email')
.normalizeEmail();


const Phone = body('phone')
.exists().withMessage('enter email')
.isLength({ min: 11, max:11 }).withMessage('please enter a phone contains 11 number ')
.isMobilePhone().withMessage('please enter a valid phone number');

const Message = body('message')
.exists().withMessage('please enter your message');

exports.sendContactmail = [Name,email,Phone,Message];
