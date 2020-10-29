import axios from '../../index';

class AcademicNotifReq{
	constructor(id){
        this.currUserID = id;
    }

	get = async () => {
		try{
			const endPoint = `/users/` + this.currUserID + '/notifications/academic';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	delete = async id => {
		try{
			const endPoint = `/users/` + this.currUserID + '/notifications/academic/' + id;
			const res = await axios.delete(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}
}
export default AcademicNotifReq;