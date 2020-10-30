const express = require("express"),
	  router  = express.Router();

const ClassNoteService    = require('../../lib/Notification/Categories/Class/index'),
      UserService         = require('../../lib/User/index'),
	  MessageNoteService  = require('../../lib/Notification/Categories/Message/index'),
	  NotificationService = require('../../lib/Notification/index');

const Formatter = require('../../lib/Notification/Formatter/formatter');
const RelFormatMap = require('../../lib/Notification/Formatter/RelationsFormatter/formatMap');


const FriendHandler = require('../../lib/CompositeServices/Notification/Relations/FriendHandler');
const NotificationHandler = require("../../lib/CompositeServices/Notification/NotificationHandler");

router.get('/users/:id/notifications/relations', async (req, res) => {
	try{
		const userRelNotifID = await UserService.getRelationNotifBucketID(req.params.id);
		const relNotifs = await NotificationService.findByIdAndPopulateList(userRelNotifID);
		const formattedNotifs = await Formatter.format(relNotifs, RelFormatMap, req.param.id);
		res.json(formattedNotifs);
	}catch(err){
		console.log(err);
		res.send();
	}
})

router.delete('/users/:id/notifications/relations/:notifID', async (req, res) => {
	try{
		await NotificationHandler.removeRelationNotifById(req.params.id, req.params.notifID);
		res.send();
	}catch(err){
		console.log(err);
	}
})

router.get('/users/:id/notifications/academic', async (req, res) => {
	try{
		const user = await UserService.findById(req.params.id);
		const notifs = await ClassNoteService.getNotifications(user.notifications.academic.classNote);
		res.json(notifs);
	}catch(err){
		console.log(err);
	}
})


router.delete('/users/:id/notifications/academic/:noteID', async (req, res) => {
	try{
		ClassNoteService.deleteNotification(req.params.noteID);
		await UserService.deleteAcNotif(req.params.id, req.params.noteID);
		res.send();
	}catch(err){
		console.log(err);
	}
})

router.get('/users/:id/notifications/message', async (req,res) => {
	try{
		const user = await UserService.findById(req.params.id);
		const notifs = await MessageNoteService.getMultiple(user.notifications.messages.messageNote);
		res.json(notifs);
	}catch(err){
		console.log(err);
	}
})

router.delete('/users/:id/notifications/message/:msgID', async (req,res) => {
	try{
		const user = await UserService.findById(req.params.id);
		const notifs = await MessageNoteService.remove(req.params.msgID);
		user.notifications.messages.messageNote.pull(req.params.msgID);
		user.notifications.messages.unDismissed--;
		await user.save();
		res.send();
	}catch(err){
		console.log(err);
	}
})

module.exports = router;

