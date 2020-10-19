import axios from './index';

class PostRequests{
	constructor(id){
		this.currUserID = id;
	}

	getPosts  = async () => {
		try{
			const endPoint = '/users/' + this.currUserID + '/posts';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	newPost = async (text, images) => {
		try{
			const endPoint = '/users/' + this.currUserID + '/posts';
			let data = new FormData();
			//setup data before sending
			data.append('text', text);
			for(let i =0; i<images.length; i++){
				data.append('images', images[i]);
			}

			const res = await axios.post(endPoint, data, {
			  headers: {
			    'accept': 'application/json',
			    'Accept-Language': 'en-US,en;q=0.8',
			    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
			  }
			});
			return res.data;
		}catch(err){
			console.log(err);
		}
	}
	
	getFriendsPost = async () => {
		try{
			const endPoint = `/users/` + this.currUserID + '/friends/posts';
			const response = await axios.get(endPoint);
			return response.data;
		}catch(err){
			console.log(err);
		}
	}

	getLikes = async (id) => {
		try{
			const endPoint = '/posts/' + id + '/likes';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	toggleLike = async (id) =>{
		try{
			const endPoint = '/users/' + this.currUserID + '/posts/' + id + '/likes';
			const res = await axios.post(endPoint,{});
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	getComments = async (id) => {
		try{
			const endPoint = '/posts/' + id + '/comments';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	newComment = async (id, text) =>{
		try{
			const endPoint = '/users/' + this.currUserID + '/posts/' + id + '/comments';
			const res = await axios.post(endPoint,{text:text, author: this.currUserID});
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

}
export default PostRequests;