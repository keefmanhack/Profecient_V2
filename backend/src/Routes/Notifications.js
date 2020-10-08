const express = require("express"),
	  router  = express.Router();

const NotifcationService = require('../../lib/Notification/index');
const UserService = require('../../lib/User/index');

router.get('/users/:id/notifications/academic', async (req, res) => {
	try{
		const user = await UserService.findById(req.params.id);
		const notifs = await NotifcationService.getNotifications(user.notifications.academic.classNote);
		res.json(notifs);
	}catch(err){
		console.log(err);
	}
})



router.delete('/users/:id/notifications/academic/:noteID', async (req, res) => {
	try{
		NotifcationService.deleteNotification(req.params.noteID);
		await UserService.deleteAcNotif(req.params.id, req.params.noteID);
		res.send();
	}catch(err){
		console.log(err);
	}
})

module.exports = router;

