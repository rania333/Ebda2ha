const {body} = require('express-validator');
const postModel = require('../models/postModel');
// const { notify } = require('../routes/postRoutes');

// const StartupName = body('StartupName')
// .exists().withMessage('please enter a title for your post')

// const description = body('description')
// .exists().withMessage('please enter a conent for your post');

// const CategoryId = body('categoryId')
// .exists().withMessage('please enter a categoryId for your post');

const Key = body('key')
.exists().withMessage('please enter a key for your post');

exports.createAndUpdatePost = [];
// exports.filter = [CategoryId];
exports.search = [Key];









