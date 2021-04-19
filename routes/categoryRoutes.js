const express = require('express');

const categoryController = require('../controllers/categoryController');

const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router(); 

router.get('/', isAuth, isAdmin, categoryController.getAllCategory); //get all category

router.get('/:categoryId', isAuth, isAdmin, categoryController.getCategory); //get single category

router.post('/', isAuth, isAdmin, categoryController.AddCategory); //create

router.put('/:categoryId', isAuth, isAdmin, categoryController.updateCategory); //update

router.delete('/:categoryId', isAuth, isAdmin, categoryController.deleteCategory); //delete

module.exports = router;