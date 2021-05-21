const mongoose = require('mongoose');
const schema = mongoose.Schema;
const postSchema = new schema({
    StartupName: { //name l product w l startup
        type: String,
        required: true
    },
    description: { //description
        type: String,
        required: true,
    },
    pic: [{
        type: String,
    }],
    approved: {
        type: Boolean,
        default: false
    },
    facebookpage: {
        type: String,
    },
    websitelink: {
        type: String,
    },
    phone: {
        type: Number,
        required: true
    },
    addressLine: {
        type: String,
        required: true
    },
    price: {
        type: String
    },
    productname: {
        type: String,
    },
    posttype: {
        type: String,
        enum: ['marketing', 'Fund']
    },
    category:{
        type: String,
        required: true,
        enum: ['productForm' , 'startupForm']
    },
    categoryId: {
        type: schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    createdBy: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
});
module.exports = mongoose.model('post', postSchema);