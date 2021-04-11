const data = require('../data');
const bcrypt = require('bcryptjs');
const rendomBytes = require('crypto');
const {validationResult} = require('express-validator');
const userModel = require('../models/userModel');
const mail = require('../sendEmail');

exports.updateProfile = async (req, res, nxt) => {
    try {
        //validation
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        //find user
        let user = await userModel.findById(req.userId).select('firstName lastName email role bio summary pic socialLinks' );
        
        if (!user) {
            return res.status(404).json({
                message: "user not exist"
            });
        }
        //hold data 
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const role = req.body.role;
        const gender = req.body.gender;
        const DOB = req.body.DOB ? new Date(req.body.DOB).toISOString().replace(/\T.*/, '') : undefined;
        // delete the time and everything after
        const bio = req.body.bio;
        const summary = req.body.summary;
        const fb = req.body.facebook;
        const linked =req.body.linkedIn;
        const github =req.body.gitHub;
        let pic; 
        //handle l pic
        if (req.file == undefined) {
            pic = data.DOMAIN + 'defaultPhoto.png';
        } else {
            pic = data.DOMAIN + req.file.filename;
        }
        //override
        user.firstName = firstName;
        user.lastName = lastName;
        user.pic = pic;
        user.gender = gender;
        user.DOB = DOB;
        user.bio = bio;
        user.summary = summary;
        user.socialLinks.facebook=fb;
        user.socialLinks.linkedIn=linked;
        user.socialLinks.gitHub=github;
        //save in DB
        let updatedUser = await user.save();
        return res.status(200).json({
            message: "updated successfully",
            user: updatedUser
        });

    } catch (err) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
}; 

exports.getAllUsers = async (req, res, nxt) => {
    try {
        let users = await userModel.find({})
        .select('firstName lastName email verified role pic gender DOB summary bio socialLinks');
        return res.status(200).json({
            message: "You fetched all users successfully",
            search_result: users.length,
            users: users
        });
    } catch (err){
        return res.status(500).json({
            message: "an error occured"
        });
    }
    
};

exports.myProfile = async (req, res, nxt) => {
    try {
        const userId = req.userId;
        let user = await userModel.findById(userId,
            'firstName lastName email verified role pic gender DOB summary bio socialLinks');
        if (!user) {
            return res.status(404).json({
                message: "user not exist"
            });
        } 
        return res.status(200).json({
            message: "you fetched the user successfully",
            user: user
        });
    } catch (err) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
};

exports.filter = async (req, res, nxt) => {
    try {
        //validation
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        //hold data
        const name = req.body.name; 
        let user = await userModel.find({$or : [{firstName: {$regex : `.*${name}.*`}}, {lastName: {$regex : `.*${name}.*`}}]})
        .select('firstName lastName email verified role pic gender DOB summary bio socialLinks')
            if (!user) {
                return res.status(404).json({
                    message: "user not found"
                });
            }
            return res.status(200).json({
                message: "the user is fetched successfully",
                search_result: user.length,
                user: user.length >0 ? user : "No users Found"
            });
    } catch (err) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
};

exports.getUser = async (req, res, nxt) => {
    try {
        const userId = req.params.userId;
        let user = await userModel.findById(userId,
            'firstName lastName role pic gender DOB summary bio socialLinks');
        if (!user) {
            return res.status(404).json({
                message: "user not exist"
            });
        } 
        return res.status(200).json({
            message: "you fetched the user successfully",
            user: user
        });
    } catch (err) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
};
exports.blockUser = async (req, res, nxt) => {
    try {
        const userId = req.params.userId;
        let user = await userModel.findById(userId)
        .select('firstName lastName role pic gender DOB summary bio socialLinks');
        if (!user) {
            return res.status(404).json({
                message: "user not exist"
            });
        }
        let deletedUser = await userModel.findByIdAndRemove(userId);
        return res.status(200).json({
            message: "user is blocked",
            user: deletedUser,
        });

    } catch(err) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
}

exports.makeAdmin = async (req, res, nxt) => {
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
        const firstName = 'user';
        const lastName = 'name'
        const pass = 'Ebda2ha';
        const pic = data.DOMAIN + 'defaultPhoto.png';
        const code = rendomBytes.randomBytes(20).toString('hex'); //ll verification
        let message;
        let html;
        const user = await userModel.findOne({email: email})
        .select('firstName lastName role pic gender DOB summary bio socialLinks');
        if (!user) { //if user not exist then create new one
            const hashPass = await bcrypt.hash(pass, 12);
            const newUser = new userModel ({
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: 'admin',
                pic: pic,
                verificationCode: code,
                password: hashPass
            });
            message = `the user ${email} was not exist but now is created successfully, became admin and has more authorization as you`
            //set subject of mail
            html = `
            <h1> Hello ${firstName + lastName} </h1>
            <p> we are happy to inform you that you're added as admin in our website!
            please check the mail ${email} with the password ${pass} to verify your account..
            then you can logIn in our website with the same data </p>`
            await newUser.save(); //save in db
        } else {
            //if user exist 
            user.role = 'admin';
            html = `
            <h1> Hello ${user.firstName} </h1>
            <p> we are happy to inform you that you're now an admin in our website 
            and you now have more authorization </p>`
            message = `the user ${email} is already exist and now is admin and has more authorization as you`;
            const adminUser = await user.save(); //save in DB 
        }
        /* start sending mail to user email to inform user */
        mail.sendEmail(email, "making you admin", html); //l send mail to inform
        /* end sending mail */
        return res.status(200).json({
            message:  message,
        });
    } catch (err) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
    
}

exports.changePass = async (req, res, nxt) => {
    try {
        //validation
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        //hold data
        const userId = req.userId;
        const oldPass = req.body.oldPassword;
        const newPass = req.body.newPassword;
        const confirmPass = req.body.confirmPassword;
        const user = await userModel.findById(userId);
        if(!user) {
            return res.status(404).json({
                message: "user not exist"
            });
        }
        //compare two password
        const equal = await bcrypt.compare(oldPass, user.password);
        if (!equal) {
            return res.status(401).json({
                message: "incorrect password"
            });
        }
        //compare two new passwords
        if(newPass !== confirmPass) {
            return res.status(401).json({
                message: "the two passwords are not matched"
            });
        }
        let hashPass = await bcrypt.hash(newPass, 12);
        user.password = hashPass;
        const newpass = await user.save();
        return res.status(200).json({
            message: "you changed your password successfully"
        });
    } catch(err) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
}

//favourites routes
// exports.viewUserFavourite = (req, res, nxt) => {
//     const favId = req.params.favId;
//     const userId = req.body.userId;
//     favouriteModel.findById(favId)
//     .populate('postId')
//     .then(fav => {
//         if (fav.userId.toString() !== userId.toString()) {
//             const err = new Error("you're not authorized to perform this operation");
//             err.statusCode = 401
//             throw err;
//         }
//         res.status(200).json({
//             message: "you fetched your favourite successfully",
//             favourite: fav
//         });
//     })
//     .catch(err => {
//         if (!err.statusCode) {
//             err.statusCode = 500
//         }
//         nxt(err);
//     })
// }