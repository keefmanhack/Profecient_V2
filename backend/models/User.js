let mongoose = require('mongoose');


let UserSchema = mongoose.Schema({
	// username: {type: String, unique:true, required: true},
	// password: String,
	name: String,
	school: {
		name: String,
		logoUrl: String,
	},
	email: String, //{type: String, unique: true, required: true}
	profilePictureURL: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	totalLinks: {type: Number, default: 0},
	posts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	}],
	semesters: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Semester"
	}],
	friends: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}],
	messageStreams: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "MessageStream"
	}],
	agenda: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Agenda" //not yet created
	}],
	notifications: {
		academic: {
			unDismissed: {type: Number, default: 0},
			classNote: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: "ClassNote"
			}]
		}
	}


})

		// for(let i =0; i<otherUserClass.connectionsFrom.length; i++){
		// 	let connection = otherUserClass.connectionsFrom[i];
		// 	User.findById(connection.user, function(err, foundUser){
		// 		if(err){
		// 			console.log(err);
		// 		}else{
		// 			foundUser.notifications.academic.unDismissed++;
		// 			Class.findById(connection.class_data, function(err, foundClass){
		// 				if(err){
		// 					console.log(err);
		// 				}else{
		// 					const note = {
		// 						note_Data: "Ass Added",
		// 						otherUserClass: {
		// 							class_id: otherUserClass._id,
		// 							class_name: otherUserClass.name
		// 						},
		// 						myClass: {
		// 							class_id: foundClass._id,
		// 							class_name: foundClass.name,
		// 						},
		// 						otherUser: {
		// 							user_id: otherUser._id,
		// 							user_information: {
		// 								name: otherUser.name,
		// 								school: otherUser.school,
		// 								profilePictureURL: otherUser.profilePictureURL,
		// 							}
		// 						},
		// 						assignment: otherUserAssignmentID,
		// 					}

		// 					ClassNote.create(note, function(err, newNote){
		// 						if(err){
		// 							console.log(err);
		// 						}else{
		// 							foundUser.notifications.academic.classNote.unshift(newNote);
		// 							foundUser.save();
		// 						}
		// 					})
		// 				}
		// 			})
		// 		}
		// 	})
		// }


module.exports = mongoose.model('User', UserSchema);