const mongoose = require('mongoose');
const schema = mongoose.Schema;
const postSchema = new schema({
    StartupName: {
        type: String,
        required: true
    },
    facebookpage: { type: String},
    websitelink:  { type: String},
    Posttype: { type: String},
    Productname: { type: String},
    Price: { type: Number},
     pic: [{
        type: String,
        required: true
    }],
    description:{
        type: String,
        required: true
    },
    addressLine:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    categoryId: {
        type: schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    createdBy: {
        type: schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('post', postSchema);