const express = require("express"),
	  router  = express.Router();

const UserService         = require('../../lib/User/index'),
	  ClassService        = require('../../lib/Class/index'),
	  SemesterService     = require('../../lib/Semester/index'),
	  ClassNoteService    = require('../../lib/Notification/Class/index'), //this needs to be here so that it is registered to mongoDB
	  AssignmentService   = require('../../lib/Assignment/index');

const NotificationHandler = require('../../lib/CompositeServices/NotificationHandler');
// Connection Routes

router.post('/users/:id/class/connection', async (req, res) =>{
	try{
		const currUser = await UserService.findById(req.params.id);
		const otherUser = await UserService.findById(req.body.otherUser);
		await ClassService.toggleConnectionTo(req.body.currUserClass, otheruser._id, req.body.otherUserClass);
		await ClassService.toggleConnectionFrom(req.body.otherUserClass, currUser._id, req.body.currUserClass);
		res.send();
	}catch(err){
		console.log(err);
	}
})

router.post('/users/:id/class/connection/delete', async (req, res) => {
	try{
		const currUser = await UserService.findById(req.params.id);
		const otherUser = await UserService.findById(req.body.otherUser);
		await ClassService.toggleConnectionTo(req.body.currUserClass, otheruser._id, req.body.otherUserClass);
		await ClassService.toggleConnectionFrom(req.body.otherUserClass, currUser._id, req.body.currUserClass);
	}catch(err){
		console.log(err);
	}
})

// Semester Creator Routes
router.post('/users/:id/semester', async (req, res) => {
	try{
		const user = await UserService.findById(req.params.id);
		const newSem = await SemesterService.create({});
		const newClasses = await ClassService.create(req.body.semesterData.classes);
		newSem.name =  req.body.semesterData.name;
		newSem.classes = newClasses;
		await newSem.save();
		user.semesters.push(newSem);
		await user.save();
		res.send();
	}catch(err){
		console.log(err);
	}
})


router.put('/users/:id/semester', async (req, res) => {
	//THIS ROUTE DOES NOT WORK YET
	try{
		const user = await UserService.findById(req.params.id);
		const updatedClasses = await ClassService.updatedClasses(req.body.semesterData.classes);
		const foundSemester = await SemesterService.findById(req.body.semesterData._id);
		foundSemester.classes = updatedClasses;
		await foundSemester.save();
		res.send();
	}catch(err){
		console.log(err);
	}	
})


router.post('/users/classes', async (req, res) => {
	try{
		//need to add future part to make sure not finding current user
		res.json(await UserService.findLinks(req.body.classData, req.body.currentLinks));
	}catch(err){
		console.log(err);
	}
})
// End of Semeste Creator Routes

router.get('/users/:id/semesters/classes/assignments', async (req, res) =>{
	try{
		const user = await UserService.findById(req.params.id);
		res.json(await SemesterService.findMutlipleAndPopulateClassAndAssignment(user.semesters));
	}catch(err){
		console.log(err);
	}
})

router.get('/users/:id/semesters/current', async (req,res) =>{
	try{
		const user = await UserService.findById(req.params.id);
		if(user.semesters.length>0){
			 res.json(await SemesterService.getCurrentSemester(user.semesters[user.semesters.length-1]));
		}else{
			res.send();
		}
	}catch(err){
		console.log(err);
	}
})

router.get('/users/:id/semesters/:semID/classes', async (req, res) => {
	try{
		// const user = await UserService.findById(req.params.id); //this doesn't need to be here
		const semester = await SemesterService.findById(req.params.semID);
		const classes = await ClassService.findMultiple(semester.classes);
		res.json(classes);
	}catch(err){
		res.send();
		console.log(err);
	}
})

router.get('/users/:id/semesters', async (req, res) => {
	try{
		const user = await UserService.findById(req.params.id);
		res.json(await SemesterService.findMultiple(user.semesters));
	}catch(err){
		console.log(err);
	}
})


router.delete('/users/:id/semesters/:sem_id', async (req, res) => {
	try{
		const user = await UserService.findById(req.params.id);
		const sem = await SemesterService.findById(req.params.sem_id);
		const foundClasses = await ClassService.findMutliple(sem.classes);
		await AssignmentService.deleteMultiple(foundClasses.assignments);
		await ClassService.deleteMultiple(sem.classes);
		await SemesterService.deleteOne(req.params.sem_id);
		user.semesters.pull(req.params.sem_id);
		await user.save();
		res.send();
	}catch(err){
		console.log(err);
	}
})


router.delete('/users/:id/classes/:class_id/assignment/:ass_id', async (req, res) =>{
	//go through list of linked Users
	//if they still have a notification linked to this assignment then remove it
	//send all linked users a notification that this assignment has been deleted
	//STILL NEED TO ADD NOTIFICATION REMOVAL
	try{
		const foundClass = await ClassService.findById(req.params.class_id);
		await AssignmentService.deleteOne(req.params.ass_id);
		foundClass.assignments.pull(req.params.ass_id);
		await foundClass.save();
		res.send();
	}catch(err){
		console.log(err);
	}
})

router.get('/users/:id/assignment/upcomming', async (req, res) => {
	try{
		const foundUser = await UserService.findById(req.params.id);
		if(foundUser.semesters.length>0){
			const sem = await SemesterService.findById(foundUser.semesters[foundUser.semesters.length-1]);
			const asses =  await ClassService.getClassAssignmentsDueInAWeekSortedByDate(sem.classes);
			res.json(asses);
		}else{
			res.send();
		}
	}catch(err){
		console.log(err);
	}
})

router.put('/assignment/:id', async (req,res) =>{
	try{
		await AssignmentService.update(req.params.id, req.body);
		//will need to add notification piece here
		res.send();
	}catch(err){
		console.log(err);
	}
})

router.get('/users/:id/classes/:classID/assignments', async (req,res) => {
	try{
		const foundClass = await ClassService.findById(req.params.classID);
		const foundAsses = await AssignmentService.findMultiple(foundClass.assignments);
		res.json(foundAsses);
	}catch(err){
		console.log(err);
	}
})

router.post('/users/:id/classes/:classID/assignment', async (req, res) =>{
	try{
		const user = await UserService.findById(req.params.id);
		const foundClass = await ClassService.findById(req.params.classID);
		const newAss = await AssignmentService.create(req.body);
		foundClass.assignments.push(newAss);
		await foundClass.save();
		res.send();
		NotificationHandler.sendConnectionsFromNewAssNotification(foundClass, user, newAss._id);
	}catch(err){
		console.log(err);
	}
})

router.post('/users/:id/classes/:classID/assignment/fromConnection', async (req, res) =>{
	try{
		const ass = await AssignmentService.findById(req.body.otherUserAssID);
		const newAss = await AssignmentService.create(ass);
		const foundClass = await ClassService.findById(req.params.id);
		foundClass.assignments.push(newAss);
		await foundClass.save();
		res.send();
		NotificationHandler.deleteNewAssNotification(user.params.id, req.body.noteID);
	}catch(err){
		console.log(err);
	}
})

module.exports = router;