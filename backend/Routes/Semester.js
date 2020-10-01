const express = require("express"),
	  router  = express.Router(),
	  moment  = require('moment'),
	  mongoose = require('mongoose')
	  async   = require('async');

let Agenda = require('./Agenda');

//Mongo Schemas
let User       = require('../models/User'),
    Semester   = require('../models/Semester'),
    Class      = require('../models/Class'),
    Assignment = require('../models/Assignment'),
    Link       = require('../models/Link');


// Connection Routes

router.post('/users/:id/class/connection', function(req, res){
	try{
		async.waterfall([
			function(cb){
				User.findById(req.params.id, function(err, currUser){
					if(err){
						console.log(err);
					}else{
						cb(null, currUser);
					}
				})
			},
			function(currUser, cb){
				User.findById(req.body.otherUser, function(err, otherUser){
					if(err){
						console.log(err);
					}else{
						cb(null, currUser);
					}
				})
			},
			function(currUser, cb){
				Class.findById(req.body.currUserClass, function(err, foundClass){
					if(err){
						console.log(err);
					}else{
						const newConnect = {
							user: req.body.otherUser,
							class_data: req.body.otherUserClass,
						}

						for(let i =0; i<foundClass.connectionsTo.length; i++){
							const connection = foundClass.connectionsTo[i];
							if(connection.user == newConnect.user && connection.class_data == newConnect.class_data){
								res.send('Exists');
								return;
							}

						}

						foundClass.connectionsTo.push(newConnect);
						cb(null, currUser, foundClass);
					}
				})
			},
			function(currUser, currUserClass, cb){
				Class.findById(req.body.otherUserClass, function(err, foundClass){
					if(err){
						console.log(err);
					}else{
						const newConnect = {
							user: currUser._id,
							class_data: req.body.currUserClass,
						}


						for(let i =0; i<foundClass.connectionsFrom.length; i++){
							const connection = foundClass.connectionsFrom[i];
							if(connection.user == newConnect.user && connection.class_data == newConnect.class_data){
								res.send('Exists');
								return;
							}
						}

						foundClass.connectionsFrom.push(newConnect);
						foundClass.save(function(err){
							if(err){
								console.log(err);
							}else{
								currUserClass.save(function(err){
									if(err){
										console.log(err);
									}else{
										cb(null);
									}
								});
							}
						});
					}
				})
			}
		], function(err){
			if(err){
				console.log(err);
			}else{
				res.send('success');
			}
		})
	}catch(e){
		console.log(e);
	}
})

router.post('/users/:id/class/connection/delete', function(req, res){
	//find otheruser class
	//remove connection from other user class and pass Object ID of other user's class and previously connected currUser class
	//remove connected to from currUser class 
	try{
		async.waterfall([
			function(cb){
				User.findById(req.body.otherUser, function(err, otherUser){
					if(err){
						console.log(err);
					}else{
						cb(null);
					}
				})
			},
			function(cb){
				User.findById(req.params.id, function(err, currUser){
					if(err){
						console.log(err);
					}else{
						cb(null, currUser);
					}
				})
			},
			function(currUser, cb){
				Class.findById(req.body.otherUserClassID, function(err, foundClass){
					if(err){
						console.log(err);
					}else{
						for(let i =0; i< foundClass.connectionsFrom.length; i++){
							if(foundClass.connectionsFrom[i].user + "" === currUser._id + ""){
								let connection = foundClass.connectionsFrom[i];
								foundClass.connectionsFrom.splice(i, i+1);
								cb(null, connection.class_data, foundClass);
							}
						}
					}
				})
			},
			function(currUserClassID, otherUserClass, cb){
				Class.findById(currUserClassID, function(err, foundClass){
					if(err){
						console.log(err);
					}else{
						for(let i =0; i<foundClass.connectionsTo.length; i++){

							if(foundClass.connectionsTo[i].class_data + '' == otherUserClass._id + ''){
								foundClass.connectionsTo.splice(i, i+1);
								foundClass.save(function(err){
									if(err){
										console.log(err);
									}else{
										otherUserClass.save(function(err){
											if(err){
												console.log(err);
											}else{
												cb(null);
											}
										})
										
									}
								})
							}
						}
					}
				})
			}
		], function(err){
			if(err){
				console.log(err);
			}else{
				console.log('Link removed');
				res.send('success');
			}
		})
	}catch(e){
		console.log(e);
	}
})

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
	//THIS ROUTE DOES NOT WORK YET

	let classes = [];
	
	req.body.semesterData.classes.forEach(function(o){
		if(o && o._id){
			Class.findByIdAndUpdate(o._id, o, function(err, foundClass){
				if(err){
					console.log(err);
				}else{
					classes.push(foundClass);
				}
			}).then(function(doc) {
				Semester.findById(req.body.semesterData._id, function(err, foundSemester){
					if(err){
						console.log(err)
					}else{
						foundSemester.classes = classes;
						foundSemester.save()
					}
				})
			})
		}else{
			Class.create(o, function(err, newClass){
				if(err){
					console.log(err);
				}else{
					classes.push(newClass);
					console.log(classes);
				}
			}).then(function(doc){
				Semester.findById(req.body.semesterData._id, function(err, foundSemester){
					if(err){
						console.log(err)
					}else{
						foundSemester.classes = classes;
						foundSemester.save()
						res.send('success');
					}
				})
			})
		}
	})
	
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
									_id: foundUser._id,
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
	User.findById(req.params.id).populate({path: 'semesters', populate: {path: 'classes'}}).exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			res.send(foundUser.semesters[foundUser.semesters.length-1]);
		}
	})
})

// router.post('/users/:id/semesters/current', function(req,res){
// 	User.findById(req.params.id).populate({path: 'semesters', populate: {path: 'classes'}}).exec(function(err, foundUser){
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
				}
			})
		}
	});

	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			foundUser.semesters.pull(req.params.sem_id);
			foundUser.save(function(err){
				if(err){
					console.log(err);
				}else{
					res.send('success');
				}
			})
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
			if(foundUser.semesters.length >0){
				const lastSem = foundUser.semesters.length-1;
				if(foundUser.semesters[lastSem] && foundUser.semesters[lastSem].classes){
					foundUser.semesters[lastSem].classes.forEach(function(o){
						o.assignments.forEach(function(assignment){
							assignments.push(assignment);
						})
					})
				}
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