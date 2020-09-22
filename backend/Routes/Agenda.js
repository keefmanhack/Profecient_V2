const express = require("express"),
	  router  = express.Router(),
	  moment  = require('moment');

const endOfDay =  require('date-fns/endOfDay');
const startOfDay = require('date-fns/startOfDay');

let Agenda     = require('../models/Agenda');
let User       = require('../models/User'),
    Semester   = require('../models/Semester'),
    Class      = require('../models/Class');

router.get('/users/:id/agenda/today', function(req, res){
	User.findById(req.params.id).populate(
		{
			path: 'semesters',
			populate: {
				path: 'classes',
			}
		}).populate({path: 'agenda', 
			match: {
				date: {$gte: startOfDay(new Date()), $lte: endOfDay(new Date())}
			},})
	.exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			let agendaData =foundUser.agenda;
			if(agendaData){
				const foundClasses = foundUser.semesters[foundUser.semesters.length-1].classes;


				foundClasses.forEach(function(o){
					const now = moment();

					if(now.isAfter(o.date.start) && now.isBefore(o.date.end) && o.daysOfWeek[now.day()]){
						const classRestruct = {
							name: o.name,
							location: o.location,
							description: o.instructor,
							time: o.time,
							date: new Date(),
							_id: o._id,
						}

						agendaData.push(classRestruct);
					}
				})
			}
			res.send(agendaData);
		}
	})
})

router.post('/users/:id/agenda', function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			Agenda.create(req.body, function(err, newAgendaItem){
				if(err){
					console.log(err);
				}else{
					foundUser.agenda.push(newAgendaItem); //need to check that post data is valid!!!!
					foundUser.save();
					res.send('success');
				}
			})
		}
	})
})

function createClassAgendaItems(classes, userID){
	User.findById(userID).populate('agenda').exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			let agendaItems = [];

			classes.forEach(function(o){
				const startDate = moment(o.date.start);
				const endDate = moment(o.date.end);
				const weeks = endDate.diff(startDate, 'weeks');

				for(let i =0; i< weeks; i++){
					for(let j =0; j<o.daysOfWeek.length; j++){
						if(o.daysOfWeek[j]){
							let newMoment = moment(startDate);
							const date = newMoment.add(i, 'weeks').day(j);

							const agendaStruct = {
								name: o.name,
								location: o.location,
								description: o.instructor,
								date: date,
								time: o.time,
								relatedClass: o._id,
							}
							newMoment = moment();
							agendaItems.push(agendaStruct);
						}
					}
				}
			})
			Agenda.create(agendaItems, function(err, newAgendaItems){
				if(err){
					console.log(err);
				}else{
					foundUser.agenda.push(newAgendaItems);
					foundUser.save();
				}
			})

		}
	})

}

module.exports = {router: router, createClassAgendaItems: createClassAgendaItems}