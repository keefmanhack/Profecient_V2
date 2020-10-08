const   express 	= require('express'),
 		app     	= express(),
		bodyParser  = require('body-parser');

const UserService = require('../lib/User/index');

let NotificationRoutes = require('./Routes/Notifications');

// const NotificationHandler = require('./Helper Classes/NotificationHandler');

// //Routes
// let feedRoutes	     = require("./Routes/Posts"),
// 	semesterRoutes   = require('./Routes/Semester'),
// 	agendaRoutes	 = require("./Routes/Agenda");

// End of Routes


app.use(express.json());

app.use(NotificationRoutes);

// app.use(feedRoutes);
// app.use(semesterRoutes);
// app.use(agendaRoutes.router);


app.get('/users/:id', async (req, res) => {
	try{
		const user = await UserService.findById(req.params.id);
		res.json(user);
	}catch(err){	
		console.log(err);
	}
});

app.post('/users', async (req, res) => {
	try{
		const users = await UserService.findUsersByName(req.body.searchString);
		res.json(users);
	}catch(err){
		console.log(err);
	}
})

app.post('/users/:id/friends', async (req, res) =>{
	try{
		await UserService.toggleUserFriend(req.params.id, req.body.userID);
	}catch(err){
		console.log(err);
	}
})



// app.get('/users/:id/messageStreams', function(req,res){
// 	User.findById(req.params.id)
// 	.populate(
// 		{
// 			path: 'messageStreams',
// 			populate: 
// 				{
// 					path: 'communicators',
// 				}
// 		}
// 	)
// 	.exec(function(err, foundUser){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			const sortedMessageStreams = foundUser.messageStreams.slice().sort((a,b) => b.sentMessages[b.sentMessages.length-1].date-a.sentMessages[a.sentMessages.length-1].date);
// 			res.send(sortedMessageStreams);
// 		}
// 	})
// })

// app.put('/messageStream/:id', function(req,res){
// 	MessageStream.findByIdAndUpdate(req.params.id, req.body.messageStream, function(err, updatedMessage){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.send('success');
// 		}
// 	})
// })

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

// app.get('/x', function(req, res){
// 	const data = {
// 		firstName: 'Pat',
// 		lastName: 'Mitchell',
// 		email: 'keefergeg@yahoo.com',
// 		school: {
// 			logoUrl: 'https://logo.clearbit.com/gannon.edu',
// 			name: 'Gannon University'
// 		}
// 	}
// 	User.create(data, function(err, newUser){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			console.log(newUser);
// 			res.send('success')
// 		}
// 	})
// })

module.exports = app;