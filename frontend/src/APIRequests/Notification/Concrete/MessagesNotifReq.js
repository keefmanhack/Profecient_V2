import axios from '../../index';

class MessageNotifReq{
    constructor(id){
        this.currUserID = id;
    }

    get = async () => {
		try{
			const endPoint = `/users/` + this.currUserID + '/notifications/message';
			const response = await axios.get(endPoint);
			return response.data;
		}catch(err){
			console.log(err);
		}
	}

	delete = async (id) => {
		try{
			const endPoint = `/users/` + this.currUserID + '/notifications/message/' + id;
			const response = await axios.delete(endPoint);
			return response.data;
		}catch(err){
			console.log(err);
		}
	}
    
}

export default MessageNotifReq;