const   express 	= require('express'),
 		app     	= express(),
		cors 	    = require('cors'),
		passport      = require('passport'),
		LocalStrategy = require('passport-local');

const User = require('../lib/User/user-model');
const UserService = require('../lib/User/index');

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.use(require('express-session')({
    secret: process.env.EXP_SESS_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


let NotificationRoutes = require('./Routes/Notifications');
let MessageRoutes      = require('./Routes/Messages');
let AgendaRoutes       = require('./Routes/Agenda');
let PostRoutes         = require('./Routes/Posts');
let SemesterRoutes     = require('./Routes/Semester');
let UserRoutes         = require('./Routes/User');


app.use(NotificationRoutes);
app.use(MessageRoutes);
app.use(AgendaRoutes);
app.use(PostRoutes);
app.use(SemesterRoutes);
app.use(UserRoutes);


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