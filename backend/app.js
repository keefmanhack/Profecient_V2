const   express 	= require('express'),
 		app     	= express(),
		cors 		= require('cors'),
		mongoose 	= require('mongoose'),
		bodyParser  = require('body-parser');

//Routes
let feedRoutes	     = require("./Routes/Posts"),
	semesterRoutes   = require('./Routes/Semester'),
	agendaRoutes	 = require("./Routes/Agenda");

// End of Routes

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    console.log('configured');
}


//MongoDB Models
let User = require('./models/User');
let ClassNote = require('./models/ClassNote');
let Class = require('./models/Class');
let Assignment = require('./models/Assignment');

let MessageStream = require('./models/Message');

//End of MongoDB Models

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

let mongoUrl = process.env.PROF_MONGO_DB;

mongoose.connect(mongoUrl);

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

app.use(feedRoutes);
app.use(semesterRoutes);
app.use(agendaRoutes.router);


app.get('/users/:id', function (req, res) {
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			// console.log(err);
		}else{
			res.send(foundUser);
		}
	});
});

app.post('/users', function(req, res){
	User.find({'name':  { "$regex": req.body.searchString, "$options": "i" }}, function(err, foundUsers){
		if(err){
			console.log(err);
		}else{
			res.send(foundUsers);
		}
		//need to check in future if current user and not send that user
	})
})

app.post('/users/:id/friends', function(req,res){
	User.findById(req.body.userID, function(err, foundUser){ //make sure other user exists
		if(err){
			console.log(err);
		}else{
			User.findById(req.params.id, function(err, currUser){
				if(err){
					console.log(err);
				}else{
					if(req.body.isFriend){
						currUser.friends.pull(req.body.userID);
					}else{
						currUser.friends.push(req.body.userID);
					}
					currUser.save(function(err){
						if(err){
							console.log(err);
						}else{
							res.send('Success');
						}
					});
				}
			})
		}
	})
})

// Notiication Routes
app.get('/users/:id/notifications/academic', function(req, res){
	User.findById(req.params.id).populate(
	{	path: 'notifications', 
		populate: {
			path: 'academic', 
			populate: {
				path: 'classNote',
				populate: {
					path: 'assignment',
				}
			}
		}
	}).exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			res.send(foundUser.notifications.academic.classNote);
		}
	})
})

app.post('/users/:id/notifications/academic/:noteID', function(req, res){
	Assignment.findById(req.body.otherUserAssID, function(err, foundAss){
		if(err){
			console.log(err);
		}else{
			Class.findById(req.body.myClassID, function(err, foundClass){
				if(err){
					console.log(err);
				}else{
					Assignment.create(foundAss, function(err, newAss){
						if(err){
							console.log(err);
						}else{
							newAss.complete = false;
							foundClass.assignments.push(newAss);
							newAss.save(function(err){
								if(err){
									console.log(err)
								}else{
									foundClass.save(function(err){
										if(err){
											console.log(err)
										}else{
											removeNotification(req.params.id, req.params.noteID, function(){
												res.send('success');
											})
										}
									})
								}
							})
						}
					})
				}
			})
		}
	})
})

app.delete('/users/:id/notifications/academic/:noteID', function(req, res){
	removeNotification(req.params.id, req.params.noteID, function(){
		res.send('success');
	})
})

function removeNotification(userID, noteID, cb){
	User.findById(userID, function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			ClassNote.findByIdAndRemove(noteID, function(err){
				if(err){
					console.log(err);
				}else{
					foundUser.notifications.academic.classNote.pull(noteID);
					foundUser.notifications.academic.unDismissed--;
					foundUser.save(function(err){
						if(err){
							console.log(err);
						}else{
							cb();
						}
					})
				}
			})
		}
	})
}
// End of Notification Routes

app.get('/users/:id/messageStreams', function(req,res){
	User.findById(req.params.id)
	.populate(
		{
			path: 'messageStreams',
			populate: 
				{
					path: 'communicators',
				}
		}
	)
	.exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			const sortedMessageStreams = foundUser.messageStreams.slice().sort((a,b) => b.sentMessages[b.sentMessages.length-1].date-a.sentMessages[a.sentMessages.length-1].date);
			res.send(sortedMessageStreams);
		}
	})
})

app.put('/messageStream/:id', function(req,res){
	MessageStream.findByIdAndUpdate(req.params.id, req.body.messageStream, function(err, updatedMessage){
		if(err){
			console.log(err);
		}else{
			res.send('success');
		}
	})
})

app.delete('/user/:id/messageStream/:message_id', function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			foundUser.messageStreams.pull(req.params.message_id);
			foundUser.save();
			res.send('success');
			// Should add function to check if other user has delete the messageStream, if so the messageStream it's self can be deleted
		}
	})
})

app.post('/users/:id/messageStream', function(req, res){
	for(let i =0; i<req.body.communicators.length; i++){
		const id = req.body.communicators[i];
		User.findById(id).populate('messageStreams').exec(function(err, foundUser){
			if(err){
				console.log(err);
			}else{
				let previousStream = doesStreamExist(foundUser.messageStreams, req.body.communicators);
				if(previousStream === null){
					MessageStream.create(req.body, function(err, newMessageStream){
						if(err){
							console.log(err);
						}else{
							foundUser.messageStreams.push(newMessageStream);
							foundUser.save(function(err){
								if(err){
									console.log(err);
								}else{
									if(i===req.body.communicators.length-1){
										res.send('success');
									}
								}
							});
							console.log('Created a new stream for ' + foundUser.name);
						}
					})
				}else{
					MessageStream.findById(previousStream, function(err, foundStream){
						if(err){
							console.log(err);
						}else{
							foundStream.sentMessages.push(req.body.sentMessages[0]);
							foundStream.save(function(err){
								if(err){
									console.log(err);
								}else{
									if(i===req.body.communicators.length-1){
										res.send('success');
									}
								}
							});
							console.log('Found Stream updated')
						}
					})
				}
			}
		})
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

app.get('/x', function(req, res){
	const data = {
		firstName: 'Pat',
		lastName: 'Mitchell',
		email: 'keefergeg@yahoo.com',
		school: {
			logoUrl: 'https://logo.clearbit.com/gannon.edu',
			name: 'Gannon University'
		}
	}
	User.create(data, function(err, newUser){
		if(err){
			console.log(err);
		}else{
			console.log(newUser);
			res.send('success')
		}
	})
})

app.listen(process.env.PORT || 8080);