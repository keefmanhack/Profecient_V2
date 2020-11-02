const mongoose      = require('mongoose'),
      passport      = require('passport'),
      LocalStrategy = require('passport-local');

const User = require('./lib/User/user-model');

const app = require('./src/app.js');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    console.log('configured');
}

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

let mongoUrl = process.env.PROF_MONGO_DB;

mongoose.connect(mongoUrl);

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


app.listen(process.env.PORT || 8080, () => {
	console.log('Server running');
});