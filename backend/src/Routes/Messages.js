const express = require("express"),
	  router  = express.Router();

const MessageService = require('../../lib/Message/index');
const UserService = require('../../lib/User/index');

const MessageHandler = require('../../lib/CompositeServices/MessageHandler');

router.get('/users/:id/messageStreams', async (req,res) =>{
	try{
		const user = await UserService.findById(req.params.id);
		const messageStreams = await MessageService.getUserStreams(user.messageStreams);
		res.json(messageStreams)
	}catch(err){
		console.log(err);
	}
})

router.put('/users/:id/messageStream/:streamID', async (req,res) =>{
	//id if this route is in use
	try{
		await MessageService.updateStream(req.params.streamID, req.body.messageStream);
		res.send();
		MessageHandler.postNotification(req.params.id, req.body.messageStream);
	}catch(err){
		console.log(err);
	}
})

router.delete('/user/:id/messageStream/:message_id', async (req, res) =>{
	try{
		const user = await UserService.findById(req.params.id);
		user.messageStreams.pull(req.params.message_id);
		await user.save();
		res.send();
	}catch(err){
		console.log(err);
	}
})

router.post('/users/:id/messageStream', async (req, res) =>{
	try{
		await MessageHandler.handleNewMessage(req.body)
		res.send();
		const user = await UserService.findById(req.params.id);
		MessageHandler.postNotification(req.params.id, user.messageStreams[user.messageStreams.length-1]);
	}catch(err){
		console.log(err);
	}
})



module.exports = router;