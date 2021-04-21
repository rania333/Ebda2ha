const mongoose = require('mongoose');
const schema = mongoose.Schema;
const postSchema = new schema({
    title: {
        type: String,
        required: true
    },
    content: {
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