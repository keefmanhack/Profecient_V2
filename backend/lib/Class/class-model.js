let mongoose = require('mongoose');

let ClassSchema = mongoose.Schema({
	name: String,
	location: String,
	instructor: String,
	color: {type: String, default: '#C724B1'},
	time: {
		start: Date,
		end: Date,
	},
	date: {
		start: Date,
		end: Date,
	},
	daysOfWeek: Array,
	connectionsTo: [{
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		classID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class"
		}
	}],
	connectionsFrom: [{
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		classID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class"
		}
	}],
	assignments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Assignment"
	}]
})

module.exports = mongoose.model('Class', ClassSchema);

/*
Links Design
	
	CurrentUser
		Semester
			Class
				connectedTo: User, [classes]

	OtherUser
		Semester
			Class
				connectionsFrom: User, [classes]
				Assignments
					connectionsFrom: User, [assignments]


1. Adding a new link
	-A user's class should have a list of classes which are linked
		-Data: Class
	-The class which is being linked to should also hold a list of user's who link to the class
		-Data: User
2. What happens if a class with links is deleted
	-Notify linked user's the class has been deleted and link not longer exists
	-Remove link from user's Class
3. User removes a link from a class
	-Remove connectedTo item from currentUser
	-Travel to other class and remove User with subordinate classes
4. Notification process
	-Other user adds a new assignment
		1. If assignment was added successfully
		2. Go through list of connectedTo and add notification to User's Academic Notifications
			-Data needed:
				-Other user
				-Other user class???
				-Current user's class
				-Other user Assignment Data
			-What happens when user views notification
				-Initially
					-See summary information including: who posted new assignment, name of assignment, and for which class of yours this assignment is linked to
						-Need ability to dismiss
							-What happens if dismissed?
								-Remove notification from User's Academic Notification
				-Expanded Data
					-Shows more information about the assignment
			-What happens if user chosses to add assignment to class
				-Create copy of assignment and add to current user's class assignment list
				-Add link to other user's assignment
				-What if other user makes an update, completes, or deletes the assignment
					-Notify User assignment was changed
					-If assignment was edited
						-Show data about updated assignment
							-Needed data:
								-CurrentUser class
								-Other user assignment information
	-Summary
		-CurrentUser receives notification with the following data: 
			-CurrUser class assignment was linked to
			-Assignment Data
			-OtherUser 

	-Other user edits data about their class
	-Other user deletes a class
Academic Class Assignment Added data
	-CurrUser class
	-Otheruser assignment Data
	-OtherUser
	A.Creation mechanism
		1. Other user creates new assignment
		2. Iterate through otherUser class links
			-For each user in class links
				-Create notification and add to the linked users Class Assignment Added notification
*/