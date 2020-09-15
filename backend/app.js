const   express 	= require('express'),
 		app     	= express(),
		cors 		= require('cors'),
		mongoose 	= require('mongoose'),
		bodyParser  = require('body-parser');

const endOfDay =  require('date-fns/endOfDay');
const startOfDay = require('date-fns/startOfDay');

//Routes
let feedRoutes	     = require("./Routes/Posts"),
	semesterRoutes   = require('./Routes/Semester');

// End of Routes

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    console.log('configured');
}


//MongoDB Models
let User = require('./models/User');
let Agenda = require('./models/Agenda');
let MessageStream = require('./models/Message');
let Class = require('./models/Class');
let Semester = require('./models/Semester');

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

// Semester Creator Routes
app.post('/users/:id/semester', function(req, res){
	const data = req.body.semesterData;
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			Semester.create({}, function(err, newSem){
				if(err){
					console.log(err);
				}else{
					newSem.name = data.name;
					newSem.current = true;

					data.classData.forEach(function(o){
						Class.create(o, function(err, newClass){
							if(err){
								console.log(err);
							}else{
								newClass.links = [];
								//need to figure out how links will work in the future
								//also need to add to users total link count here
								newClass.save();
								newSem.classes.push(newClass);
							}
						})
					})
					newSem.save();
					console.log(newSem);
				}
			})
		}
	})
})


app.post('/users/classes', function(req, res){
	//need to add future part to make sure not finding current user
	User.find({})
	.populate(
		{
			path: 'semesters',
			match: {
				current: true,
			},
			populate: {
				path: 'classes',
				match: {
					name: {"$regex": req.body.classData.name, "$options": "i" },
					location: {"$regex": req.body.classData.location, "$options": "i" },
					instructor: {"$regex": req.body.classData.instructor, "$options": "i" },
					_id: {'$ne': req.body.currentLinks.length>0 ? req.body.currentLinks.map(function(user){ //filters out links that already exist
						user.semesters[0].classes.map(function(o){
							return o._id;
						})
					}): null}
				}
			}
		}).exec(function(err, foundUsers){
			let returnVal =[];
			//need to build return data
			if(foundUsers){
				foundUsers.forEach(function(foundUser){
					if(foundUser.semesters[0] && foundUser.semesters[0].classes){
						returnVal.push(foundUser);
					}
				})
			}
			res.send(returnVal);
		})
})
// End of Semeste Creator Routes

app.get('/users/:id', function (req, res) {
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
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
		}
	})
})

app.post('/messageStream', function(req, res){
	MessageStream.create(req.body, function(err, newMessageStream){
		if(err){
			console.log(err);
		}else{
			req.body.communicators.forEach(function(id){
				User.findById(id, function(err, foundUser){
					foundUser.messageStreams.push(newMessageStream);
					foundUser.save();
				})
			})

			//still need to add check that message stream doesn't already exist
			res.send('success');
		}
	})
})

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

app.get('/users/:id/agenda/today', function(req, res){
	User.findById(req.params.id).populate({path: 'agenda', match: {date: {$gte: startOfDay(new Date()), $lte: endOfDay(new Date())}}}).exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			res.send(foundUser.agenda);
		}
	})
})

app.post('/users/:id/agenda', function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			Agenda.create(req.body, function(err, newAgendaItem){
				if(err){
					console.log(err);
				}else{
					foundUser.agenda.push(newAgendaItem); //need to check that post data is valid!!!!
					foundUser.save();
					res.send('success');
				}
			})
		}
	})
})


app.listen(process.env.PORT || 8080);