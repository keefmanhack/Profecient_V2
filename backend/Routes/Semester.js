const express = require("express"),
	  router  = express.Router(),
	  moment  = require('moment');

//Mongo Schemas
let User       = require('../models/User'),
    Semester   = require('../models/Semester'),
    Class      = require('../models/Class'),
    Assignment = require('../models/Assignment'),
    Link       = require('../models/Link');

// Semester Creator Routes
router.post('/users/:id/semester', function(req, res){
	const data = req.body.semesterData;
	User.findById(req.params.id).populate('semesters').exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
		
			Semester.create({}, function(err, newSem){
				if(err){
					console.log(err);
				}else{
					newSem.name = data.name;
					Class.create(data.classes, function(err, newClasses){
						if(err){
							console.log(err);
						}else{
							newSem.classes = newClasses;
							foundUser.semesters.push(newSem);
							foundUser.currentSemesterID=newSem._id;

							newSem.save();
							foundUser.save();
							res.send('success');
						}
					})
					
				}
			})
		}
	})
})

router.put('/users/:id/semester', function(req, res){
	//need to check user is signed in
	let classes = [];
	req.body.semesterData.classes.forEach(function(o){
		if(o && o._id){
			Class.findByIdAndUpdate(o._id, o, function(err, foundClass){
				if(err){
					console.log(err);
				}else{
					classes.push(foundClass);
				}
			})
		}else{
			Class.create(o, function(err, newClass){
				if(err){
					console.log(err);
				}else{
					classes.push(newClass);
				}
			})
		}
	})

	Semester.findById(req.body.semesterData._id, function(err, foundSemester){
		if(err){
			console.log(err)
		}else{
			foundSemester.classes = classes;
			foundSemester.save();
			res.send('success');
		}
	})

	//NEED TO IMPLEMENT WITH ASYNC
})


router.post('/users/classes', function(req, res){
	//need to add future part to make sure not finding current user
	User.find({})
	.populate(
		{
			path: 'semesters',
			populate: {
				path: 'classes',
				match: {
					name: {"$regex": req.body.classData.name },
					location: {"$regex": req.body.classData.location, "$options": "i" },
					instructor: {"$regex": req.body.classData.instructor, "$options": "i" },
					_id: {'$ne': req.body.currentLinks.length>0 ? req.body.currentLinks.map(function(link){ //filters out links that already exist
						return link.class._id;
					}): null}
				}
			}
		}).exec(function(err, foundUsers){

			let returnLinks = [];
			if(foundUsers){
				foundUsers.forEach(function(foundUser){
					// console.log(foundUser.semesters + foundUser.name);
					let currentSem = foundUser.semesters[foundUser.semesters.length-1]; //current semester
					if(currentSem && currentSem.classes){ //only get current semesters
						currentSem.classes.forEach(function(o){
							const linkStruct ={
								user: {
									name: foundUser.name,
									profilePictureURL: foundUser.profilePictureURL,
								},
								class: o,
							}
							
							returnLinks.push(linkStruct);
						})
					}
				})
			}
			res.send(returnLinks);
		})
})
// End of Semeste Creator Routes

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

// router.post('/users/:id/semesters/current', function(req,res){
// 	User.findById(req.params.id, function(err, foundUser){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			foundUser.currentSemesterID = req.body.semID;
// 			console.log(foundUser.currentSemesterID);
// 			foundUser.save(function(err){
// 				if(err){
// 					console.log(err);
// 				}else{
// 					res.send('success');
// 				}
// 			});
			
// 		}
// 	})
// })

router.delete('/users/:id/semesters/:sem_id', function(req, res){
	Semester.findById(req.params.sem_id).populate({path: 'classes', populate: {path: 'assignments', path: 'links'}}).exec(function(err, foundSemester){
		if(err){
			console.log(err);
		}else{
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
			Semester.findByIdAndRemove(req.params.sem_id, function(err){
				if(err){
					console.log(err);
				}else{
					res.send('success');
				}
			})
		}
	});
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