const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    console.log('configured');
}

//MongoDB Models
let User = require('./models/User');
let Semester = require('./models/Semester');
let Class = require('./models/Class');
let Posts = require('./models/Post');
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
app.use(express.urlencoded({ extended: false }));

// app.use(express.static(path.join(__dirname, 'build')));

app.get('/users/:id', function (req, res) {
	console.log('received')
	User.findById(req.params.id).populate({path: 'semesters', populate: {path: 'classes'}}).populate('posts').exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			res.send(foundUser);
			console.log(foundUser);
		}
	});
});


app.listen(process.env.PORT || 8080);