const {pick} = require('lodash');
const rendomBytes = require('crypto');
const data = require('../data');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const userModel = new schema({
    firstName: {
        type: String ,
        required: true
    },
    lastName: {
        type: String ,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
    },
    pic: {
        type: String,

    },
    gender: {
        type: String,
    },
    DOB: {
        type: Date,
    },
    bio: {
        type: String
    },
    summary: {
        type: String
    },
    socialLinks: {
        facebook: {
            type: String,
        },
        linkedIn: {
            type: String,
        },
        gitHub: {
            type: String
        }
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type:String,
        required:false
    },
    resetPassToken: {
        type:String,
        required:false
    },
    posts: [{
        type: schema.Types.ObjectId,
        ref: 'post'
    }],
    interests: [{
        type: String
    }]
}, {
    timestamps: true
});

//methods

userModel.methods.getUserInfo = function() {
    return pick(this, ["_id", "firstName", "lastName", "email", "verified"]);
}
module.exports = mongoose.model('User', userModel);