import axios from './index';

class AgendaRequests{
	constructor(id){
		this.currUserID = id;
	}

	getTodaysEvents = async () => {
		try{
			const endPoint = `/users/` + this.currUserID + '/agenda/today';
			const response = await axios.get(endPoint);
			return response.data;
		}catch(err){
			console.log(err);
		}
	} 

	postNewItem = async data => {
		try{
			const endPoint = '/users/' + this.currUserID + '/agenda';
			return await axios.post(endPoint, data);
		}catch(err){
			console.log(err);
		}
	}

	updateItem = async (id, data) =>{
		try{
			const endPoint = '/users/' + this.currUserID+ '/agenda/' + id;
			return await axios.put(endPoint, data);
		}catch(err){
			console.log(err);
		}
	}

	deleteItem = async id =>{
		try{
			const endPoint = '/users/' + this.currUserID+ '/agenda/' + id;
			return await axios.delete(endPoint);
		}catch(err){
			console.log(err);
		}
	}
}
export default AgendaRequests;