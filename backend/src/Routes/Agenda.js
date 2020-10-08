const express = require("express"),
	  router  = express.Router();

const UserService = require('../../lib/User/index');
const AgendaService = require('../../lib/Agenda/index');
const SemesterService = require('../../lib/Semester/index');
const ClassService = require('../../lib/Class/index');


router.get('/users/:id/agenda/today', async (req, res) =>{
	try{
		const user = await UserService.findById(req.params.id);
		const userAgenda = await AgendaService.getTodaysItems(user.agenda);

		if(user.semesters.length>0){
			const currSem = await SemesterService.findById(user.semesters[user.semesters.length-1]);
			const classes = await ClassService.getClassesOccuringToday(currSem.classes);
			const reformatedClass = await AgendaService.reformatClassData(classes);
			res.json(userAgenda.concat(reformatedClass));
		}else{
			res.json(userAgenda);
		}
	}catch(err){
		console.log(err);
	}
	
	
	// User.findById(req.params.id).populate(
	// 	{
	// 		path: 'semesters',
	// 		populate: {
	// 			path: 'classes',
	// 		}
	// 	}).populate({path: 'agenda', 
	// 		match: {
	// 			date: {$gte: startOfDay(new Date()), $lte: endOfDay(new Date())}
	// 		},})
	// .exec(function(err, foundUser){
	// 	if(err){
	// 		console.log(err);
	// 	}else{
	// 		let agendaData =foundUser.agenda;
	// 		if(foundUser.semesters.length >0 && foundUser.semesters[foundUser.semesters.length-1].classes){
	// 			const foundClasses = foundUser.semesters[foundUser.semesters.length-1].classes;


	// 			foundClasses.forEach(function(o){
	// 				const now = moment();

	// 				if(now.isAfter(o.date.start) && now.isBefore(o.date.end) && o.daysOfWeek[now.day()]){
	// 					const classRestruct = {
	// 						name: o.name,
	// 						location: o.location,
	// 						description: o.instructor,
	// 						time: o.time,
	// 						date: new Date(),
	// 						_id: o._id,
	// 					}

	// 					agendaData.push(classRestruct);
	// 				}
	// 			})
	// 		}
	// 		res.send(agendaData);
	// 	}
	// })
})

// router.post('/users/:id/agenda', function(req, res){
// 	User.findById(req.params.id, function(err, foundUser){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			Agenda.create(req.body, function(err, newAgendaItem){
// 				if(err){
// 					console.log(err);
// 				}else{
// 					foundUser.agenda.push(newAgendaItem); //need to check that post data is valid!!!!
// 					foundUser.save();
// 					res.send('success');
// 				}
// 			})
// 		}
// 	})
// })

// router.put('/users/:id/agenda/:ag', function(req, res){
// 	Agenda.findByIdAndUpdate(req.params.ag, req.body, function(err, updatedAgItem){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			updatedAgItem.save(function(err){
// 				if(err){
// 					console.log(err);
// 				}else{
// 					res.send('success');
// 				}
// 			})
// 		}
// 	})
// })

// router.delete('/users/:id/agenda/:ag', function(req, res){
// 	User.findById(req.params.id, function(err, foundUser){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			Agenda.findByIdAndRemove(req.params.ag, function(err){
// 				if(err){
// 					console.log(err);
// 				}else{
// 					foundUser.agenda.pull(req.params.ag);
// 					foundUser.save(function(err){
// 						if(err){
// 							console.log(err);
// 						}else{
// 							res.send('success');
// 						}
// 					})
// 				}
// 			})
// 		}
// 	})
// })

// function createClassAgendaItems(classes, userID){
// 	User.findById(userID).populate('agenda').exec(function(err, foundUser){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			let agendaItems = [];

// 			classes.forEach(function(o){
// 				const startDate = moment(o.date.start);
// 				const endDate = moment(o.date.end);
// 				const weeks = endDate.diff(startDate, 'weeks');

// 				for(let i =0; i< weeks; i++){
// 					for(let j =0; j<o.daysOfWeek.length; j++){
// 						if(o.daysOfWeek[j]){
// 							let newMoment = moment(startDate);
// 							const date = newMoment.add(i, 'weeks').day(j);

// 							const agendaStruct = {
// 								name: o.name,
// 								location: o.location,
// 								description: o.instructor,
// 								date: date,
// 								time: o.time,
// 								relatedClass: o._id,
// 							}
// 							newMoment = moment();
// 							agendaItems.push(agendaStruct);
// 						}
// 					}
// 				}
// 			})
// 			Agenda.create(agendaItems, function(err, newAgendaItems){
// 				if(err){
// 					console.log(err);
// 				}else{
// 					foundUser.agenda.push(newAgendaItems);
// 					foundUser.save();
// 				}
// 			})

// 		}
// 	})

// }

module.exports = router;