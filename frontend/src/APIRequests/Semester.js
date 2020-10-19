import axios from './index';

class SemesterRequests{
	constructor(id){
		this.currUserID = id;
	}

	getCurrSemWClasses = async () => {
		try{
			const endPoint = `/users/` + this.currUserID + '/semesters/current';
			const response = await axios.get(endPoint);
			return response.data;
		}catch(err){
			console.log(err);
		}
	}

	getAllSems = async () => {
		try{
			const endPoint = '/users/' + this.currUserID + '/semesters';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	getClasses = async semID => {
		try{
			const endPoint = '/users/' + this.currUserID + '/semesters/' + semID + '/classes';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}
}
export default SemesterRequests;