const express = require("express"),
	  router  = express.Router(),
	  multer  = require('multer'),
	  upload  = multer({storage: multer.memoryStorage(), limits: { fieldSize: 6 * 1024 * 1024 }}),
	  async	  = require('async'),
	  aws 		= require('aws-sdk');

//Mongo Schemas
let Post    = require('../models/Post'),
    Comment = require('../models/Comment'),
    User    = require('../models/User');


// S3 Setup
const s3 = new aws.S3(
	{
	 accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	});

router.get('/users/:id/friends/posts', function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		Post.find({author: foundUser.friends}).sort('-date').populate('author').exec(function(err, foundPosts){
			if(err){
				console.log(err);
			}else{
				res.send(foundPosts);
			}
		})
	})
})

router.get('/users/:id/posts', function(req, res){
	User.findById(req.params.id).populate({path: 'posts', populate:{path:'author'}}).exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			res.send(foundUser.posts);
		}
	})
})

router.post('/posts/:id/likes', function(req, res){
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
			foundPost.save(function(err){
				if(err){
					console.log(err);
				}else{
					res.send('success');
				}
			});	
		}
	})
})

router.get('/posts/:id/likes', function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		if(err){
			console.log(err);
		}else{
			res.send(foundPost.likes);
		}
	})
})

router.get('/posts/:id/comments', function(req, res){
	Post.findById(req.params.id).populate({path: 'comments', populate: {path: 'author'}}).exec(function(err, foundPost){
		if(err){
			console.log(err);
		}else{
			res.send(foundPost.comments);
		}
	})
})

router.post('/posts/:id/comments', function(req, res){
	Comment.create(req.body, function(err, newComment){
		if(err){
			console.log(err);
		}else{
			Post.findById(req.params.id, function(err, foundPost){
				if(err){
					console.log(err);
				}else{
					foundPost.comments.push(newComment);
					foundPost.save(function(err){
						if(err){
							console.log(err)
						}else{
							res.send('success');
						}
					});
				}
			})
		}
	});
});

router.post('/users/:id/posts', upload.array('images',6), (req, res) => {
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

module.exports = router;