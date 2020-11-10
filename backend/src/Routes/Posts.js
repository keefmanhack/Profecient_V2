const express = require("express"),
	  router  = express.Router(),
	  multer  = require('multer'),
	  upload  = multer({storage: multer.memoryStorage(), limits: { fieldSize: 6 * 1024 * 1024 }});

const UserService    = require('../../lib/User/index'),
      PostService    = require('../../lib/Post/index'),
	  CommentService = require('../../lib/Comment/index');

const isValid = require('../../lib/Authentication/verifyRequests');

const PostHandler = require('../../lib/CompositeServices/Notification/Relations/PostHandler');

router.get('/users/:id/friends/posts', async (req, res) => {
	try{
		const user = await UserService.findById(req.params.id);
		const friendPosts = await PostService.findMutlipleByAuthor(user.following);
		res.json(friendPosts);
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
		res.send();
	}
})

router.delete('/users/:id/posts/:postID', isValid, async (req, res) => {
	try{
		PostHandler.deletePost(req.params.postID, req.params.id, () => {
			res.send({success: true});
		})
	}catch(err){
		console.log(err);
		res.send({success: false});
	}
})

router.post('/users/:id/posts/:postID/likes', isValid, async (req, res) =>{
	try{
		await PostHandler.toggleLiked(req.params.id, req.params.postID, req.params.id);
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

router.post('/users/:id/posts/:postID/comments', isValid, async (req, res) =>{
	try{
		await PostHandler.createNewComment(req.params.id, req.params.postID, req.body);
		res.send();
	}catch(err){	
		console.log(err);
	}
});

router.post('/users/:id/posts', isValid, upload.array('images',6), (req, res) => {
	try{
		PostHandler.createNewPost(req.body.text, req.params.id, req.body.images, () => {
			res.json({success: true})
		})
	}catch(err){
		console.log(err);
		res.json({success: false})
	}
});

module.exports = router;