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

app.get('/users/:id', function (req, res) {
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			res.send(foundUser);
		}
	});
});

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