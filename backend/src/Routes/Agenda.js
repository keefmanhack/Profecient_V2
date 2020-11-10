const express = require("express"),
	  router  = express.Router();

const UserService = require('../../lib/User/index');
const AgendaService = require('../../lib/Agenda/index');
const SemesterService = require('../../lib/Semester/index');
const ClassService = require('../../lib/Class/index');

const isValid = require('../../lib/Authentication/verifyRequests');

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
})

router.post('/users/:id/agenda', isValid, async (req, res) =>{
	try{
		const user = await UserService.findById(req.params.id);
		const newAgItem = await AgendaService.createNew(req.body);
		user.agenda.push(newAgItem);
		await user.save();
		res.send();
	}catch(err){
		console.log(err);
	}
})

router.put('/users/:id/agenda/:ag', isValid, async (req, res) => {
	try{
		await AgendaService.updateById(req.params.ag, req.body);
		res.send();
	}catch(err){
		console.log(err);
	}
})

router.delete('/users/:id/agenda/:ag', isValid, async (req, res) =>{
	try{
		await AgendaService.removeById(req.params.ag);
		const user = await UserService.findById(req.params.id);
		user.agenda.pull(req.params.ag)
		await user.save();
		res.send();
	}catch(err){
		console.log(err);
	}
})

module.exports = router;