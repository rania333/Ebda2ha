const mongoose = require('mongoose');
const schema = mongoose.Schema;
const postSchema = new schema({
    title: {   //start up name
        type: String,
    },
    content: {  //description about product
        type: String,
        required: true,
    },
    price: {
        type: String
    },
    fbPage: {
        type: String
    },
    WebsiteLink: {
        type: String
    },
    Phone: {
        type: Number
    },
    Address: {
        type: String
    },
    Target: {
        type: String,
        enum: ['Marketing', 'Fund']
    },
    pic: [{
        type: String,
    }],
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
    },
    typed: {
        type: String,
        required: true,
        enum : ['startUp', 'product']
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('post', postSchema);

