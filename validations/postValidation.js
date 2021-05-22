const {body} = require('express-validator');
const postModel = require('../models/postModel');
//const { notify } = require('../routes/postRoutes');

const Title = body('StartupName')
.exists().withMessage('please enter a title for your post')

const Content = body('description')
.exists().withMessage('please enter a conent for your post');

const CategoryId = body('categoryId')
.exists().withMessage('please enter a categoryId for your post');

const Key = body('key')
.exists().withMessage('please enter a key for your post');

exports.createAndUpdatePost = [Title, Content, CategoryId];
exports.filter = [CategoryId];
exports.search = [Key];









