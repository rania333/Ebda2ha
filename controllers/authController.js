const bcrypt = require('bcryptjs');
const rendomBytes = require('crypto');
const {sign} = require('jsonwebtoken');
const data = require('../data');
const {validationResult} = require('express-validator');
const userModel = require('../models/userModel');
const mail = require('../sendEmail');

exports.signUp = async (req, res, nxt) => {
    try {
    //validation
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    //hold data from parsing body
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const pass = req.body.password;
    const role = req.body.role;
    const pic = data.DOMAIN + 'defaultPhoto.png';
    const code = rendomBytes.randomBytes(20).toString('hex'); //ll verification
    //encrypt password
    let hashedPass = await bcrypt.hash(pass, 12)
    //add to DB
    const user = new userModel({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPass,
        role: role,
        pic: pic,
        verificationCode: code
    });
    //save in DB
    let userr = await user.save()
        /* start sending mail to user email to verify its account */
        let html = `
        <h1> Hello ${userr.firstName} </h1>
        <p> please click to the following link to verify your account</p>
        <a href="${data.DOMAIN}auth/verifyNow/${userr.verificationCode}"> verify now </a>
        `;
        mail.sendEmail(userr.email, "Verify Account", html);
        /* end sending verification mail */
        return res.status(201).json({
            message: "new user is added successfully, please check your email to verify your account",
            user: userr,
        });
    } catch (err) {
        return res.status(500).json({
            message: "an error occur",
        })
    }
};

exports.verifyEmail = async (req, res, nxt) => {
    try {
        const code = req.params.code;
        const user = await userModel.findOne({verificationCode: code});
        if(!user) {
            const err = new Error(`invalid varification code`);
            err.statusCode = 404;
            throw err;
        }
        user.verified = true;
        user.verificationCode = undefined;
        const userr = await user.save();
        res.status(200).json({
            message: "your account is verified",
            user: userr.email,
        })
    } catch (err) {
        return res.status(500).json({
            message: "an error occur"
        })
    }
}

exports.logIn = async (req, res, nxt) => {
    try {
        //validation
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        //hold data
        const email = req.body.email;
        const pass = req.body.password;
        const user = await userModel.findOne({email: email});
        if(!user) {
            return res.status(404).json({
                message: "user not exist"
            });
        }
        const equal = await bcrypt.compare(pass, user.password);
        if(!equal) {
            return res.status(403).json({
                message: "incorrect password"
            });
        }
        //handle l verification
        if(!user.verified) {
            return res.status(403).json({
                message: `your account is not verified, please check the account ${user.email} and verify it to login`
            });
        }
        //generate token
        const payload = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            verified: user.verified,
            userId: user._id.toString()
        }
        const token = await sign(payload, data.SECRET, {expiresIn: "1 day"});
        return res.status(200).json({
            message: "you're logged in",
            user: 'welcome ' + user.firstName,
            data: user.getUserInfo(),
            token: `Bearer ${token}`
        });
    } catch (err) {
        return res.status(500).json({
            message: "an error occur"
        })
    }
};

exports.getResetPass = async (req, res, nxt) => {
    try {
        const email = req.body.email
        //validation
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        const user = await userModel.findOne({email: email});
        if (!user) {
            return res.status(404).json({
                message: "user not exist"
            });
        }
        //generate token 
        const payload = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            verified: user.verified,
            userId: user._id.toString()
        }
        global.resetToken = await sign(payload, data.SECRET, {expiresIn: "1h"});
        user.resetPassToken = resetToken;
        const userr = await user.save();
        /* start sending mail to user email to reset password */
        let html = `
        <h1> Hello ${userr.firstName} </h1>
        <p> please click to the following link to reset password</p>
        <a href="${data.DOMAIN}auth/postNewPass/${resetToken}"> reset password </a>
        `;
        await mail.sendEmail(userr.email, "reset password", html); //l send mail
        /* end sending verification mail */
        return res.status(200).json({
            message: "email is sent successfully! check it to reset password",
            user: userr.email
        });
    } catch(err) {
        return res.status(500).json({
            message: "an error occured"
        })
    }
};

exports.postNewPass = async (req, res, nxt) => {
    try {
        //validation
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        const pass = req.body.password;
        const confirmPass = req.body.confirm;
        const token = req.params.token;
        const user = await userModel.findOne({resetPassToken: token});
        //compare two passwords
        if(pass !== confirmPass) {
            return res.status(401).json({
                message: "the two passwords are not matched"
            });
        }
        let hashPass = await bcrypt.hash(pass, 12);
        //edit in model w a5ly kol 7aga zy ma kant
        user.password = hashPass;
        user.resetPassToken = undefined;
        let response = await user.save();
        res.status(200).json({
            message: "your password is reset successfully"
        });
    } catch (err) {
        return res.status(401).json({
            message: `the token is expired! try to request reset password again from http://localhost:8080/auth/resetPassword`
        });
    }
}