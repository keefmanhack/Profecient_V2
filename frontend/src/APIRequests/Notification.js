import axios from './index';

class NotificationRequest{
	constructor(id){
		this.currUserID = id;
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
}
export default NotificationRequest;