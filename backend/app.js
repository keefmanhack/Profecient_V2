const   express 	= require('express'),
 		app     	= express(),
		cors 		= require('cors'),
		mongoose 	= require('mongoose'),
		aws 		= require('aws-sdk'),
		bodyParser  = require('body-parser'),
		multer		= require('multer'),
		upload 		= multer({storage: multer.memoryStorage(), limits: { fieldSize: 6 * 1024 * 1024 }}),
		async		= require('async'),
		moment		= require('moment');

const endOfDay =  require('date-fns/endOfDay');
const startOfDay = require('date-fns/startOfDay');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    console.log('configured');
}

const s3 = new aws.S3(
	{
	 accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	});



//MongoDB Models
let User = require('./models/User');
let Semester = require('./models/Semester');
let Class = require('./models/Class');
let Post = require('./models/Post');
let Comment = require('./models/Comment');
let Agenda = require('./models/Agenda');
let Assignment = require('./models/Assignment');
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
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({extended:true}));

// app.use(express.static(path.join(__dirname, 'build')));

app.get('/users/:id', function (req, res) {
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			res.send(foundUser);
		}
	});
});

app.get('/users/:id/semesters', function(req, res){
	User.findById(req.params.id).populate('semesters').exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			res.send(foundUser.semesters);
		}
	})
})

app.get('/users/:id/semesters/current', function(req,res){
	User.findById(req.params.id).populate({path: 'semesters', match: {current: true}, populate: {path: 'classes'}}).exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			res.send(foundUser.semesters[0]);
		}
	})
})

app.get('/users/:id/assignment/upcomming', function(req, res){
	User.findById(req.params.id)
	.populate(
		{
			path: 'semesters', 
			match: 
				{
					current: true
				}, 
			populate: 
				{
					path: 'classes', 
					populate: 
						{
							path: 'assignments', 
							match: 
								{
									dueDate: 
										{
											$lte: new Date(moment().add(1, 'weeks'))
										}
								}
						}
				}
		})
	.exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			let assignments = [];

			foundUser.semesters[0].classes.forEach(function(o){
				o.assignments.forEach(function(assignment){
					assignments.push(assignment);
				})
			})

			const sortedAssignments = assignments.slice().sort((a,b) => a.dueDate-b.dueDate); //sort by oldest first

			res.send(sortedAssignments);
		}
	})
})

app.post('/classes/:id/assignment', function(req, res){
	Assignment.create(req.body, function(err, newAss){
		if(err){
			console.log(err);
		}else{
			Class.findById(req.params.id, function(err, foundClass){
				if(err){
					console.log(err);
				}else{
					foundClass.assignments.push(newAss);
					foundClass.save();
					res.send('success');
				}
			})
		}
	})
})

app.get('/users/:id/posts', function(req, res){
	User.findById(req.params.id).populate({path: 'posts', populate:{path:'author'}}).exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			res.send(foundUser.posts);
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

app.post('/posts/:id/likes', function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		if(err){
			console.log(err);
		}else{
			const ID = req.body.userID;
			if(foundPost.likes.includes(ID)){
				foundPost.likes.pop(ID);
			}else{
				foundPost.likes.push(ID);
			}
			foundPost.save();
			res.send('success');
		}
	})
})

app.get('/posts/:id/likes', function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		if(err){
			console.log(err);
		}else{
			res.send(foundPost.likes);
		}
	})
})

app.get('/posts/:id/comments', function(req, res){
	Post.findById(req.params.id).populate({path: 'comments', populate: {path: 'author'}}).exec(function(err, foundPost){
		if(err){
			console.log(err);
		}else{
			res.send(foundPost.comments);
		}
	})
})

app.post('/posts/:id/comments', function(req, res){
	Comment.create(req.body, function(err, newComment){
		if(err){
			console.log(err);
		}else{
			Post.findById(req.params.id, function(err, foundPost){
				if(err){
					console.log(err);
				}else{
					foundPost.comments.push(newComment);
					foundPost.save();
					res.send('success');
				}
			})
		}
	});
});

app.post('/users/:id/posts', upload.array('images',6), (req, res) => {
	let images = req.body.images;

	Post.create({text: req.body.text, author: req.params.id}, (err, newPost)=>{
		if(err){
			console.log(err);
		}else{
			const directory = 'users/' + req.params.id + '/posts/' + newPost._id +'/';
			if(images){
				if(!Array.isArray(images)) //convert to array so it works with eachSeries
					images = [images];
				uploadImages(images, directory, function(err,returnArr){
					newPost.photos = returnArr;
					newPost.save();
				})
			}
			User.updateOne(
			{"_id": req.params.id},
			{ 
				"$push": { "posts": { "$each": [newPost], "$position": 0 }} //push to front FILO
			},
			function(err, result){
				if(err){
					console.log(err);
				}else{
					res.send('success');
				}
			}
		);
		}
	})
});

function uploadImages(images, directory, next) {
	let ct =0;
	let returnArr =[];
    async.eachSeries(images, function(image, cb) {
    	//prep image data
    	var data = image.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer.from(data, 'base64');
		//set path
		var path = directory + ct + '.jpg';
		ct++;

		//add path to array to store in database
		returnArr.push(path);

        const params = {
	        Bucket: process.env.S3_BUCKET_NAME,
	        Key: path, // File name you want to save as in S3
	        Body: buf,
	        ACL:'public-read'
	    };

        s3.upload(params, function(err, data) {
            if (err) {
              console.log("Error uploading data. ", err);
              cb(err)
            } else {
              console.log("Success uploading data");
              
              cb()
            }
        })
    }, function(err) {
        if (err) console.log('one of the uploads failed')
        else console.log('all files uploaded')
        next(err, returnArr)
    })
}


app.listen(process.env.PORT || 8080);