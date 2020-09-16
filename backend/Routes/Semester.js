const express = require("express"),
	  router  = express.Router(),
	  moment  = require('moment');

//Mongo Schemas
let User       = require('../models/User'),
    Semester   = require('../models/Semester'),
    Class      = require('../models/Class'),
    Assignment = require('../models/Assignment');

router.get('/users/:id/semesters', function(req, res){
	User.findById(req.params.id).populate({path: 'semesters', populate: {path: 'classes', populate: {path: 'assignments'}}}).exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			res.send(foundUser.semesters);
		}
	})
})

router.get('/users/:id/semesters/current', function(req,res){
	User.findById(req.params.id).populate({path: 'semesters', match: {current: true}, populate: {path: 'classes'}}).exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			res.send(foundUser.semesters[0]);
		}
	})
})

router.post('/users/:id/semesters/current', function(req,res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			foundUser.currentSemesterID = req.body.semID;
			console.log(foundUser.currentSemesterID);
			foundUser.save(function(err){
				if(err){
					console.log(err);
				}else{
					res.send('success');
				}
			});
			
		}
	})
})

router.delete('/user/:id/semesters/:sem_id', function(req, res){
	Semester.findById(req.params.sem_id).populate({path: 'classes', populate: {path: 'assignments', path: 'links'}}).exec(function(err, foundSemester){
		if(err){
			console.log(err);
		}else{
			if(foundSemester.classes){
				foundSemester.classes.forEach(function(foundClass){
					if(foundClass.assignments){
						foundClass.assignments.forEach(function(foundAssignment){
							removeAssignment(foundAssignment._id);
						})
					}

					if(foundClass.links){
						foundClass.links.forEach(function(foundLink){
							//need to define function still
							removeLink(foundLink._id)
						})
					}

					removeClass(foundClass._id);
				})
			}
		}
	});

	//set new current
	User.findById(req.params.id).exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			if(foundUser.semesters.length>1){
				for(let i = foundUser.semesters.length-1; i>-1; i--){
					if(foundUser.semesters[i] !== req.params.sem_id){
						foundUser.currentSemesterID = foundUser.semesters[i];
						i = -1;
					}
				}
			}else{
				foundUser.currentSemesterID = null;
			}
			foundUser.save();
		}
	})

	Semester.findByIdAndRemove(req.params.sem_id, function(err){
		if(err){
			console.log(err);
		}else{
			res.send('success');
		}
	})
})

function removeLink(id){

}

function removeAssignment(id){
	Assignment.findByIdAndRemove(id, function(err){
		if(err){
			console.log(err);
		}
	})
}

function removeClass(id){
	Class.findByIdAndRemove(id, function(err){
		if(err){
			console.log(err);
		}
	})
}

router.delete('/classes/:class_id/assignment/:ass_id', function(req, res){
	Class.findById(req.params.class_id, function(err, foundClass){
		if(err){
			console.log(err);
		}else{
			foundClass.assignments.pull(req.params.ass_id);

			removeAssignment(req.params.add_id);
			foundClass.save();
			res.send('success')
			
		}
	})
})

router.get('/users/:id/assignment/upcomming', function(req, res){
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
										},
									complete: false,
								}
						}
				}
		})
	.exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			let assignments = [];

			if(foundUser.semesters[0] && foundUser.semesters[0].classes){
				foundUser.semesters[0].classes.forEach(function(o){
					o.assignments.forEach(function(assignment){
						assignments.push(assignment);
					})
				})
			}

			const sortedAssignments = assignments.slice().sort((a,b) => a.dueDate-b.dueDate); //sort by oldest first

			res.send(sortedAssignments);
		}
	})
})

router.put('/assignment/:id', function(req,res){
	Assignment.findByIdAndUpdate(req.params.id, req.body, function(err, updatedAssignment){
		if(err){
			console.log(err);
		}else{
			res.send('success');
		}
	})
})

router.post('/classes/:id/assignment', function(req, res){
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

module.exports = router;