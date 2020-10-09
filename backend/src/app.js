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


let NotificationRoutes = require('./Routes/Notifications');
let MessageRoutes = require('./Routes/Messages');
let AgendaRoutes = require('./Routes/Agenda');
let PostRoutes = require('./Routes/Posts');


app.use(NotificationRoutes);
app.use(MessageRoutes);
app.use(AgendaRoutes);
app.use(PostRoutes);


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

module.exports = app;