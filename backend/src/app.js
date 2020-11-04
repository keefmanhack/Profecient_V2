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

app.get('/users/verify', async (req, res) => {
	const query = req.query;
	const validation = await UserService.validate(query);
	res.json(validation);
})

app.get('/users/:id', async (req, res) => {
	try{
		const user = await UserService.findById(req.params.id);
		res.json(user);
	}catch(err){	
		console.log(err);
	}
});

app.post('/users/new', async (req, res) => {
	try{
		const res = await UserService.create(req.body.data);
		console.log(res);
	}catch(err){
		console.log(err);
	}
})

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
const testUsers = require('../lib/Testing Data/testUsers');
app.get('/createTestUsers', async (req, res) => {
	try{
		await UserService.create(testUsers[0]);
		await UserService.create(testUsers[1]);
		await UserService.create(testUsers[2]);
		console.log('test users created');
		res.send();
	}catch(err){
		console.log(err);
	}
})

module.exports = app;