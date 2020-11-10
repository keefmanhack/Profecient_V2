const aws = require('aws-sdk');
const s3 = new aws.S3(
	{
	 accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    
function uploadImage(image, directory, cb){
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer.from(data, 'base64');
    var path = directory + '.jpg';

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: path, // File name you want to save as in S3
        Body: buf,
        ACL:'public-read'
    };
    s3.upload(params, function(err, data){
           if(err){
               console.log(err);
           }else{
               console.log('FILE UPLAODED');
               cb(path);
           }
       });
}

function uploadImages(images, directory, cb) {
	let ct =0;
	let returnArr =[];
	for(let i =0; i< images.length; i++){
		const image = images[i];
		var data = image.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer.from(data, 'base64');
		var path = directory + ct + '.jpg';
		ct++;
		returnArr.push(path);
		const params = {
	        Bucket: process.env.S3_BUCKET_NAME,
	        Key: path, // File name you want to save as in S3
	        Body: buf,
	        ACL:'public-read'
	    };
	    s3.upload(params, function(err, data){
	   		if(err){
	   			console.log(err);
	   		}else{
	   			console.log('FILE UPLAODED');
	   			if(i===images.length-1){
	   				cb(returnArr);
	   			}
	   		}
	   	});
	}
}


function deleteImages(imagePaths, cb){
	for(let i =0; i<imagePaths.length; i++){
		const params= {
			Bucket: process.env.S3_BUCKET_NAME,
			Key: imagePaths[i],
		}
		s3.deleteObject(params, function(err, data){
			if(err){
				console.log(err)
			}else{
				console.log("File deleted");
				if(i===imagePaths.length-1){
					cb();
				}
			}
		})
	}
}

module.exports = {uploadImages, uploadImage, deleteImages};