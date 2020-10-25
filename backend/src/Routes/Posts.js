const express = require("express"),
	  router  = express.Router(),
	  multer  = require('multer'),
	  upload  = multer({storage: multer.memoryStorage(), limits: { fieldSize: 6 * 1024 * 1024 }});

const UserService    = require('../../lib/User/index'),
      PostService    = require('../../lib/Post/index'),
      CommentService = require('../../lib/Comment/index');

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
	}
})

router.delete('/users/:id/posts/:postID', async (req, res) => {
	try{
		PostHandler.deletePostAndNotifBucket(req.params.postID, req.params.id, () => {
			res.send();
		})
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

router.post('/users/:id/posts/:postID/comments', async (req, res) =>{
	try{
		const newComment = await CommentService.create(req.body);
		const foundPost = await PostService.findById(req.params.postID);
		foundPost.comments.push(newComment);
		await foundPost.save();
		res.send();
	}catch(err){	
		console.log(err);
	}
});

router.post('/users/:id/posts', upload.array('images',6), (req, res) => {
	try{
		PostHandler.generateNewPostWithNotifBucket(req.body.text, req.params.id, req.body.images, () => {
			res.send();
		})
	}catch(err){
		console.log(err);
	}
});





module.exports = router;