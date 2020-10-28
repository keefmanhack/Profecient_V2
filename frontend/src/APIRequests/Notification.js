import axios from './index';

class NotificationRequest{
	constructor(id){
		this.currUserID = id;
	}

	getRelatonsNotifs = async () => {
		try{
			const endPoint = '/users/' + this.currUserID + '/notifications/relations';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	deleteRelationNotif = async notifID => {
		try{
			const endPoint = '/users/' + this.currUserID + '/notifications/relations/' + notifID;
			await axios.delete(endPoint);
		}catch(err){
			console.log(err);
		}
	}

	getAcademicNotifs = async () => {
		try{
			const endPoint = `/users/` + this.currUserID + '/notifications/academic';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	removeAcademicNotif = async id => {
		try{
			const endPoint = `/users/` + this.currUserID + '/notifications/academic/' + id;
			const res = await axios.delete(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	getMessgeNotifs = async () => {
		try{
			const endPoint = `/users/` + this.currUserID + '/notifications/message';
			const response = await axios.get(endPoint);
			return response.data;
		}catch(err){
			console.log(err);
		}
	}

	removeMsgNotif = async (id) => {
		try{
			const endPoint = `/users/` + this.currUserID + '/notifications/message/' + id;
			const response = await axios.delete(endPoint);
			return response.data;
		}catch(err){
			console.log(err);
		}
	}
}
export default NotificationRequest;