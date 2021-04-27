const wordNetAPI = require('node-wordnet');
const data = require('../data');
const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const itemsPerPage = 50; 
exports.getAllPost = async (req, res, nxt) => {
    try {
        let condition ; //to put it in find
        let mappedArr;
        //to track user
        const user = await userModel.findById(req.userId);
        const userInterests = user.interests;
        const page = req.query.page ? parseInt(req.query.page) : 1; //for pagination
        //checkif user has interests or not 
        if(userInterests.length <= 0) {
            condition = {approved: true}
        } else {
            //regulare expression
            mappedArr = [...userInterests.map(el => {
                return new RegExp(el, "i");
            })]
            condition = {$and:[{approved: true},
                {$or: [{content: {$in: mappedArr}}, {title: {$in: mappedArr}}]}]}
        }
        //find
        const posts = await postModel.find(condition) //condition on retrieved posts
        .populate('createdBy', {firstName:1, lastName:1}) 
        .populate('categoryId', {name:  1})
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
        return res.status(200).json({
            message: 'posts are fetched successfully',
            search_Result: posts.length,
            posts: posts.length>0 ? posts : "No Posts Found"
        });
    } catch (err) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
}

exports.findPost = async (req, res, nxt) => {
    try {
        //hold data
        const postId = req.params.postId;
        const post = await postModel.findById(postId).populate('createdBy',
        {firstName:1, lastName:1})
        .populate('categoryId', {name:  1});
        if(!post || !post.approved) {
            return res.status(404).json({
                message: "this post is not found"
            })
        }
        return res.status(200).json({
            message: `the post ${postId} is retrieved successfully`,
            post: post
        });
    } catch(err) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
}; 

exports.createPost = async (req, res, nxt) => {
    try {
        //hold data
        const title = req.body.title;
        const content = req.body.content;
        const categoryId = req.body.categoryId;
        const user = req.userId;
        let pic = []; 
        //handle files
        if(req.files) {
            req.files.forEach(file => {
                pic.push(data.DOMAIN + file.filename);
            })
        }
        //create new object
        const post = new postModel({
            title: title,
            content: content,
            pic: pic,
            categoryId: categoryId,
            createdBy: user
        });
        //save in db
        const postt = await post.save();
        //add it to userModel
        const usermodel = await userModel.findById(user);
        usermodel.posts.push(post);
        await usermodel.save();
        return res.status(201).json({
            message: "your post is created successfully",
            post: postt
        });
    } catch (err) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
};

exports.updatePost = async (req, res, nxt) => {
    try {
        const postId = req.params.postId;
        const post = await postModel.findById(postId)
        .populate('categoryId', {name:  1});
        if (!post || !post.approved) {
            return res.status(404).json({
                message: "the post is not exist"
            });
        }
        if (post.createdBy.toString() !== req.userId.toString()) {
            return res.status(401).json({
                message: "you're not authorized to update this post"
            });
        }
        //hold new values
        const title = req.body.title;
        const content = req.body.content;
        const category = req.body.categoryId;
        let pic = [];
        //handle files
        if(req.files.length != 0) {
            req.files.forEach(file => {
                pic.push(data.DOMAIN + file.filename);
            })
        }
        //override
        post.title = title;
        post.content = content;
        post.categoryId = category;
        post.pic = pic;
        //save in db
        const updatedPost = await post.save();
        return res.status(200).json({
            message: 'post is updated successfully',
            post: updatedPost
        })
    } catch (err) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
};

exports.deletePost = async (req, res, nxt) => {
    try {
        const postId = req.params.postId;
        const post = await postModel.findById(postId);
        if(!post || !post.approved) {
            return res.status(404).json({
                message: "the post is not exist"
            });
        }
        if (post.createdBy.toString() !== req.userId.toString()) {
            return res.status(401).json({
                message: "you're not authorized to delete this post"
            });
        }
        const result = await postModel.findByIdAndRemove(postId);
        return res.status(200).json({
            message: 'the post is deleted successfully',
            post: result
        })
    } catch(err) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
};

exports.filter = async (req, res, nxt) => {
    try {
        //hold data
        const category = req.body.categoryId;
        var arr = [];
        const page = req.query.page ? parseInt(req.query.page) : 1; //for pagination
        const posts = await postModel.find({categoryId: category}).populate('createdBy',
        {firstName:1, lastName:1})
        .populate('categoryId', {name:  1})
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);;
        //filter posts according to approving
        posts.forEach(Element => {
            if(Element.approved) {
                arr.push(Element);
            }
        });
        //return posts
        return res.status(200).json({
            message: 'the posts are retrieved successfully',
            search_Result: arr.length,
            posts: arr.length>0 ? arr : "No Posts Found"
        })
    } catch(err) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
}

exports.search = async (req, res, nxt) =>{
    try {
        const key = req.body.key;
        let arr = [];
        let uniqueArray = [];
        const page = req.query.page ? parseInt(req.query.page) : 1; //for pagination
        let wordnet = new wordNetAPI();
        const words = await wordnet.lookupAsync(key);
        //loop on all data in api to combine it
        words.forEach(word => {
            arr.push(...word.synonyms);
        });
        //combine data with key
        if (!arr.includes(key)) {
            arr.push(key);
        }
        //remove deplicated value
        arr.forEach(val => {
            if(!uniqueArray.includes(val)) {
                uniqueArray.push(val);
            }
        }); //kda ana m3aya array h3ml find beha
        //regulare expression
        let mappedArr = uniqueArray.map(el => {
            return new RegExp(el, "i");
        })
        //add all this to user interests
        const user = await userModel.findById(req.userId);
        //check if element exist or not
        uniqueArray.map(el => {
            if(!user.interests.includes(el)) {
                user.interests.push(el);
            }
        });
        user.save();
        //l database
        const post = await postModel.find({$or: [{$and:[{content: {$in: mappedArr}}, {approved: true}]}, 
            {$and:[{title: {$in: mappedArr}}, {approved: true}]}]})
            .populate('createdBy', {firstName:1, lastName:1})
            .populate('categoryId', {name:  1})
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);;
        if (!post) {
            return res.status(404).json({
                message: "no posts found"
            });
        }
        return res.status(200).json({
                message: "posts are fetched successfully",
                search_Result: post.length,
                posts: post.length>0 ? post : "No posts Found"
        });
    } catch(err) {
        return res.status(500).json({
            message: "an error occured"
        });
    }
}

