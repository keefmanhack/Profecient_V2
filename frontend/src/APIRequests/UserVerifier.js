import axios from './index';

import errors from '../UserCreator/ErrorCodes';

import {getAccessToken, getRefreshToken} from '../Authentication/Tokens';

const notConnected = {isValid: false, errorCode: errors.NOT_CONNECTED}
class UserVerifier{

	getTokens = async () => {
		const res = await axios.get('/user/tokens/?refresh_token=' + getRefreshToken());
		return res.data;
	}

	getCurrUser = async () =>{
		const res = await axios.get('/user/current/?access_token=' + getAccessToken());
		return res.data;
	}

	createUser = async user => {
		try{
			const endPoint = '/user/new';
			let formData = new FormData();
			for(let x in user){
				formData.append(x, user[x]);
			}
			
			const res = await axios.post(endPoint, formData, {
				headers: {
				  'accept': 'application/json',
				  'Accept-Language': 'en-US,en;q=0.8',
				  'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
				}
			  });
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	login = async (username, password) =>{
		try{
			const endPoint = '/login';
			const res = await axios.post(endPoint, {username: username, password: password});
			return res.data
		}catch(err){
			console.log(err);
		}
	}

	verifyUserName = async username => {
		const endPoint = '/users/verify/?username=' + username;
		return await this.absractVerifier(endPoint);
	}

    verifyEmail = async email => {
		const endPoint = '/users/verify/?email=' + email;
		return await this.absractVerifier(endPoint);
    }
    
    verifyPhoneNumber = async phoneNumber => {
		const endPoint = '/users/verify/?phoneNumber=' + phoneNumber;
		return await this.absractVerifier(endPoint);
	}

	 absractVerifier = async endPoint => {
		try{
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			return notConnected;
		}
	}
}

export default UserVerifier;