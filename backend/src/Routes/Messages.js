const express = require("express"),
	  router  = express.Router();

const MessageService = require('../../lib/Message/index');
const UserService = require('../../lib/User/index');

router.get('/users/:id/messageStreams', async (req,res) =>{
	try{
		const user = await UserService.findById(req.params.id);
		const messageStreams = await MessageService.getUserStreams(user.messageStreams);
		res.json(messageStreams)
	}catch(err){
		console.log(err);
	}
})

router.put('/messageStream/:id', async (req,res) =>{
	try{
		await MessageService.updateStream(req.params.id, req.body.messageStream);
		res.send();
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
	//get all user's in req.body.communicators
	//get all of these user's streams
	//make list of user's who don't have the stream
	//if list length is greator than zero
	//create a new stream
	//add the stream to each user in list


	//THIS DOESN'T WORK AT THE MOMENT

	
	try{
		const communs = await UserService.findMultiple(req.body.communicators);
		let eachUsersStream = [];
		let usersWithOutStream = [];
		let streamID;

		communs.forEach(async function(comm){
			const commStreams = MessageService.getUserStreams(comm.messageStreams);
			streamID = doesStreamExist(commStreams, req.body.communicators);
			if(streamID){
				const foundStream = await MessageService.findStream(streamID);
				foundStream.sentMessages.push(req.body.sentMessages[0]);
				foundStream.save();
			}else{
				usersWithOutStream.push(comm);
			}
		})

		if(usersWithOutStream.length > 0){
			const newStream = await MessageService.createNewStream(req.body);
			usersWithOutStream.forEach(async function(user){
				user.messageStreams.push(newStream);
				await user.save();
			})
		}
		console.log(usersWithOutStream);
		res.send();

	}catch(err){
		console.log(err);
	}
})

function doesStreamExist(messageStreams, communicators){
	const newComms = communicators;
	newComms.sort();

	for(let i =0; i< messageStreams.length; i++){
		if(messageStreams[i].communicators.length === newComms.length){
			let found = true;
			const prevComms = messageStreams[i].communicators.sort();

			for(let j =0; j< prevComms.length; j++){
				if(prevComms[j] != newComms[j]){
					found=false;
				}
			}
			if(found){
				return messageStreams[i]._id;
			}
		}
	}

	return null
}



module.exports = router;