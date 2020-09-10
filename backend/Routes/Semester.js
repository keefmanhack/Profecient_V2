const express = require("express"),
	  router  = express.Router(),
	  moment  = require('moment');

//Mongo Schemas
let User       = require('../models/User'),
    Semester   = require('../models/Semester'),
    Class      = require('../models/Class'),
    Assignment = require('../models/Assignment');

router.get('/users/:id/semesters', function(req, res){
	User.findById(req.params.id).populate('semesters').exec(function(err, foundUser){
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

router.delete('/classes/:class_id/assignment/:ass_id', function(req, res){
	Class.findById(req.params.class_id, function(err, foundClass){
		if(err){
			console.log(err);
		}else{
			foundClass.assignments.pull(req.params.ass_id);
			Assignment.findByIdAndRemove(req.params.ass_id, function(err){
				if(err){
					console.log(err);
				}else{
					foundClass.save();
					res.send('success');
				}
			})
			
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