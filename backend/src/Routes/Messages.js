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
		res.send('success');
	}catch(err){
		console.log(err);
	}
})

// app.delete('/user/:id/messageStream/:message_id', function(req, res){
// 	User.findById(req.params.id, function(err, foundUser){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			foundUser.messageStreams.pull(req.params.message_id);
// 			foundUser.save();
// 			res.send('success');
// 			// Should add function to check if other user has delete the messageStream, if so the messageStream it's self can be deleted
// 		}
// 	})
// })

// app.post('/users/:id/messageStream', function(req, res){
// 	for(let i =0; i<req.body.communicators.length; i++){
// 		const id = req.body.communicators[i];
// 		User.findById(id).populate('messageStreams').exec(function(err, foundUser){
// 			if(err){
// 				console.log(err);
// 			}else{
// 				let previousStream = doesStreamExist(foundUser.messageStreams, req.body.communicators);
// 				if(previousStream === null){
// 					MessageStream.create(req.body, function(err, newMessageStream){
// 						if(err){
// 							console.log(err);
// 						}else{
// 							foundUser.messageStreams.push(newMessageStream);
// 							foundUser.save(function(err){
// 								if(err){
// 									console.log(err);
// 								}else{
// 									if(i===req.body.communicators.length-1){
// 										res.send('success');
// 									}
// 								}
// 							});
// 							console.log('Created a new stream for ' + foundUser.name);
// 						}
// 					})
// 				}else{
// 					MessageStream.findById(previousStream, function(err, foundStream){
// 						if(err){
// 							console.log(err);
// 						}else{
// 							foundStream.sentMessages.push(req.body.sentMessages[0]);
// 							foundStream.save(function(err){
// 								if(err){
// 									console.log(err);
// 								}else{
// 									if(i===req.body.communicators.length-1){
// 										res.send('success');
// 									}
// 								}
// 							});
// 							console.log('Found Stream updated')
// 						}
// 					})
// 				}
// 			}
// 		})
// 	}
// })

// function doesStreamExist(messageStreams, communicators){
// 	const newComms = communicators;
// 	newComms.sort();

// 	for(let i =0; i< messageStreams.length; i++){
// 		if(messageStreams[i].communicators.length === newComms.length){
// 			let found = true;
// 			const prevComms = messageStreams[i].communicators.sort();

// 			for(let j =0; j< prevComms.length; j++){
// 				if(prevComms[j] != newComms[j]){
// 					found=false;
// 				}
// 			}
// 			if(found){
// 				return messageStreams[i]._id;
// 			}
// 		}
// 	}

// 	return null
// }



module.exports = router;