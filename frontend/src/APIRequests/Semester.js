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

	remove = async id => {
		try{
			const endPoint = '/users/' + this.currUserID + '/semesters/' +id;
			const res = await axios.delete(endPoint);
			return res.data;
		}catch(err){	
			console.log(err);
			return {success: false, error: 'Error deleting semester'}
		}
	}

	create = async data => {
		try{
			const endPoint = '/users/' + this.currUserID + '/semester';
			const res = await axios.post(endPoint, {semesterData: data});
			return res.data;
		}catch(err){
			return {success: false, error: 'Unknown error creating semester'}
		}
	}

	update = async data => {
		try{
			const endPoint = '/users/' + this.currUserID + '/semester';
			const res = await axios.put(endPoint, {semesterData: data});
			return res.data;
		}catch(err){
			console.log(err);
		}
	}
}
export default SemesterRequests;