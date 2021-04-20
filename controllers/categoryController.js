const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const {validationResult} = require('express-validator');

exports.getAllCategory = async(req, res, next) => {
    try{
        const categories = await Category.find()
        .populate('adminId')
        res.status(200).json({
            message: 'Fetched all data successfully',
            categories: categories
        })
    }catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        console.log(err);
        next(err);
    }
};

exports.getCategory = async(req, res, next) => {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId)
         .populate('adminId')
    try{
        if(!category) {
            const error = new Error("Couldn't found category.");
            error.statusCode = 404;
            throw error; 
        }
        if(category.adminId._id.toString() !== req.userId) {
            const error = new Error('NOT authorized.');
            error.statusCode = 403;
            throw error;   
        }
        res.status(200).json({
            message: 'category fetched',
            category: category,
        });
    }catch(err){
        if(!err.statusCode) {
            err.statusCode = 500 
        }
        next(err)
     };
}

exports.AddCategory = async(req, res, next) => {

    //validation
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    const name = req.body.name;
    const category = new Category({
        name: name,
        adminId: req.userId    
    });
    try{
        await category.save()
        const user = await User.findById(req.userId);
        user.categories.push(category);
        await user.save(); 
        res.status(200).json({
            message: 'Category created successfully',
            category: category,
            adminId: {_id: user._id, name: user.name}
        })
    }catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        console.log(err);
        next(err);
    }
};


exports.updateCategory = async (req, res, next) => {

    //validation
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    
    const categoryId = req.params.categoryId;
    const name = req.body.name;
    try {
        const category = await Category.findById(categoryId)
              .populate('adminId');
        if(!category) {
            const error = new Error('Category not found ');
            error.statusCode = 404;
            next(error);
        }
        if(category.adminId._id.toString() !== req.userId) {
            const error = new Error('NOT authorized.');
            error.statusCode = 403;
            throw error;   
        }

        category.name = name;
        // category.adminId = adminId;
        
        const result = await category.save();
        res.status(200).json({
            message: 'Category updated successfully',
            category: result
        })
    }catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteCategory = async(req, res, next) => {
    const categoryId = req.params.categoryId;
    try{
        const category = await Category.findById(categoryId);
        if(!category) {
            const error = new Error('Category not found ');
            error.statusCode = 404;
            next(error);
        }
        if(category.adminId._id.toString() !== req.userId) {
            const error = new Error('NOT authorized.');
            error.statusCode = 403;
            throw error;   
        }
        await Category.findByIdAndRemove(categoryId);

        const user = await User.findById(req.userId);
        user.categories.pull(categoryId);
        await user.save();
        res.status(200).json({
            message: 'Deleted successfully'
        })       
    }
    catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        console.log(err)
        next(err);
    }
};