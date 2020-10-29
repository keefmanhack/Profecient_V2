import axios from '../../index';

class RelationalNotifReq{
    constructor(id){
        this.currUserID = id;
    }

	get = async () => {
		try{
			const endPoint = '/users/' + this.currUserID + '/notifications/relations';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	delete = async notifID => {
		try{
			const endPoint = '/users/' + this.currUserID + '/notifications/relations/' + notifID;
			await axios.delete(endPoint);
		}catch(err){
			console.log(err);
		}
	}
}

export default RelationalNotifReq;