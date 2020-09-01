const   express 	= require('express'),
 		app     	= express(),
		cors 		= require('cors'),
		mongoose 	= require('mongoose'),
		aws 		= require('aws-sdk'),
		bodyParser  = require('body-parser'),
		multer		= require('multer'),
		upload 		= multer({storage: multer.memoryStorage(), limits: { fieldSize: 6 * 1024 * 1024 }})

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
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended:true}));

// app.use(express.static(path.join(__dirname, 'build')));

app.get('/users/:id', function (req, res) {
	console.log('received')
	User.findById(req.params.id).populate({path: 'semesters', populate: {path: 'classes'}}).populate('posts').exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			res.send(foundUser);
		}
	});
});

app.post('/users/:id/posts', upload.array('images',6), (req, res) => {
	const images = req.body.images;

	User.findById(req.params.id, (err, foundUser) =>{
		Posts.create({text: req.body.text}, (err, newPost)=>{
			if(err){
				console.log(err);
			}else{
				const directory = 'users/' + foundUser._id + '/posts/' + newPost._id +'/';
				for(let i =0; i <images.length; i++){
					if(writeImage(directory, images[i], i+'.jpg')){
						newPost.photos.push(directory+i+'.jpg');
					}
				}

				newPost.save();
				res.send('success');
			}
		})
	});
	//find user by id
	//create new post
	//get images and text
	//write images to s3
	/*
		Database structure
		1. Store text
		2. Time of post
		3. File extentsions to s3 for each image
	*/

	// res.send('success');
});

function writeImage(directory, image, imageName){
	var data = image.replace(/^data:image\/\w+;base64,/, "");
	var buf = new Buffer.from(data, 'base64');

	var path = directory + imageName;

	const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: path, // File name you want to save as in S3
        Body: buf
    };

	s3.upload(params, function(err, data) {
        if (err) {
        	console.log(err);
            throw err;
            return false;
        }else{
        	console.log('successful upload');
        	return true;
        }
    });
	

}



app.listen(process.env.PORT || 8080);