const express = require("express"),
	  router  = express.Router(),
	  multer  = require('multer'),
	  upload  = multer({storage: multer.memoryStorage(), limits: { fieldSize: 6 * 1024 * 1024 }});

const UserService    = require('../../lib/User/index'),
      PostService    = require('../../lib/Post/index'),
      CommentService = require('../../lib/Comment/index');

router.get('/users/:id/friends/posts', async (req, res) => {
	try{
		const user = await UserService.findById(req.params.id);
		const friendPosts = await PostService.findMutlipleByAuthor(user.friends);
		res.send(friendPosts);
	}catch(err){
		console.log(err);
	}
})

router.get('/users/:id/posts', async (req, res) => {
	try{
		const user = await UserService.findById(req.params.id);
		const posts = await PostService.findMultiple(user.posts);
		res.json(posts);
	}catch(err){	
		console.log(err);
	}
})

router.post('/users/:id/posts/:postID/likes', async (req, res) =>{
	try{
		await PostService.toggleLike(req.params.id, req.params.postID);
		res.send();
	}catch(err){
		console.log(err);
	}
})

router.get('/posts/:id/likes', async (req, res) => {
	try{
		const post = await PostService.findById(req.params.id);
		res.json(post.likes);
	}catch(err){
		console.log(err);
	}
})

router.get('/posts/:id/comments', async (req, res) => {
	try{
		const post = await PostService.findById(req.params.id);
		const comments = await CommentService.findMultiple(post.comments);
		res.json(comments);
	}catch(err){
		console.log(err);
	}
})

router.post('/posts/:id/comments', async (req, res) =>{
	try{
		const newComment = await CommentService.create(req.body);
		const foundPost = await PostService.findById(req.params.id);
		foundPost.comments.push(newComment);
		await foundPost.save();
		res.send();
	}catch(err){	
		console.log(err);
	}
});

router.post('/users/:id/posts', upload.array('images',6), async (req, res) => {
	try{
		const post = await PostService.create(req.body.text, req.params.id, req.body.images)
		const user = await UserService.findById(req.params.id);
		user.posts.unshift(post);
		await user.save();
		res.send();
	}catch(err){
		console.log(err);
	}

	// let images = req.body.images;

	// Post.create({text: req.body.text, author: req.params.id}, (err, newPost)=>{
	// 	if(err){
	// 		console.log(err);
	// 	}else{
	// 		if(images){
	// 			const directory = 'users/' + req.params.id + '/posts/' + newPost._id +'/';
	// 			if(!Array.isArray(images)) //convert to array so it works with eachSeries
	// 				images = [images];
	// 			uploadImages(images, directory, function(err,returnArr){
	// 				newPost.photos = returnArr;
	// 				newPost.save(function(err){
	// 					if(err){
	// 						console.log(err);
	// 					}else{
	// 						addUserPost(req.params.id, newPost, res);
	// 					}
	// 				});
	// 			})
	// 		}else{
	// 			addUserPost(req.params.id, newPost, res)
	// 		}
	// 	}
	// })
});




module.exports = router;