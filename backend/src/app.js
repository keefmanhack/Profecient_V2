const   express 	= require('express'),
 		app     	= express(),
		bodyParser  = require('body-parser'),
		cors 	    = require('cors');

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

const UserService = require('../lib/User/index');
const FriendHandler = require('../lib/CompositeServices/Notification/Relations/FriendHandler');


let NotificationRoutes = require('./Routes/Notifications');
let MessageRoutes      = require('./Routes/Messages');
let AgendaRoutes       = require('./Routes/Agenda');
let PostRoutes         = require('./Routes/Posts');
let SemesterRoutes     = require('./Routes/Semester');


app.use(NotificationRoutes);
app.use(MessageRoutes);
app.use(AgendaRoutes);
app.use(PostRoutes);
app.use(SemesterRoutes);


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

app.post('/users/:id/following', async (req, res) =>{
	try{
		const user = await UserService.findById(req.params.id);
		const isFollowing = user.following.includes(req.body.userID)
		await UserService.toggleUserFollowing(user._id, req.body.userID, isFollowing);
		await UserService.toggleUserFollowers(req.body.userID, user._id);
		res.send();
		if(!isFollowing){
			FriendHandler.createAndAddANewFollowerNotif(req.params.id, req.body.userID);
		}
	}catch(err){
		console.log(err);
	}
})

module.exports = app;