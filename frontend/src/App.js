import React from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import axios from 'axios';

import Login from './Login Landing/Login';
import Landing from './Login Landing/landing';
import MessageCenter from './MessageCenter/Message-Center';
import Home from './Home/Home';
import ProfilePage from './Profile Page/profile-page';

import Loader from './Shared Resources/Effects/loader';

import './Shared Resources/index.css';

import UserRequests = from './APIRequests/User';

class App extends React.Component{
	constructor(props){
		super(props);

		this.testUserId = '5f4aa6042c0c8f715ae71d97';

		//Keefer - 5f4aa6042c0c8f715ae71d97
		//Sarah  - 5f5aab5a6f1dda2b82855985
		//Pat    - 5f5d3bea7c33842654ec2efb

		this.UserRqst = new UserRequests(this.testUserId);


		this.state={
			currentUser: null,
			foundID: null,
		}
	}

	componentDidMount(){
		this.getCurrentUser();
	}

	// getRequestedUser(id){
	// 	console.log(id);
	// 	axios.get(`http://localhost:8080/users/` + id)
	//     .then(res => {
	// 		this.setState({
	// 			foundUser: res.data,
	// 		})
	// 	})
	// }

	async getCurrentUser(){
		this.setState({currentUser: await this.UserRqst.getUser()})
	}

	async toggleFriend(isFriend, userID){
		await this.UserRqst.toggleFriend(isFriend, userID);
		await this.getCurrentUser();
	}

	setFoundUser(id){
		this.setState((state, props) => ({
			foundID: id,
		}))
	}

	render(){
		return(	
			<Router>
				<div className="App">
					<Switch>
						<Route path='/message/:id' component={({match}) => {
							if(this.state.foundID !== match.params.id){
								this.setFoundUser(match.params.id);
							}
							if(this.state.currentUser && this.state.foundID !==null){
								return(
									<MessageCenter foundUser={this.state.foundID} currentUser={this.state.currentUser}	/>
								)
							}else{
								return (<Loader/>)
							}
						}}/>
						<Route path='/message'>
							{this.state.currentUser ? <MessageCenter currentUser={this.state.currentUser}/> : <Loader/>}
						</Route>

							
						<Route path='/home'>
							{this.state.currentUser ? 
								<Home currentUser={this.state.currentUser}/> 
							: 
								<Loader/>
							}
						</Route>
						<Route path='/profile/:id' component={({match}) => {
							if(this.state.foundID !== match.params.id){
								this.setFoundUser(match.params.id);
							}
							if(this.state.currentUser && this.state.foundID !==null){
								return (<ProfilePage 
									foundUser={this.state.foundID}  
									currentUser={this.state.currentUser}
									toggleFriend={(isFriend, userID) => this.toggleFriend(isFriend, userID)}
								/> )
							}else{
								return (<Loader/>)
							}
						}}/>
						<Route path='/login'>
							<Login/>
						</Route>
						<Route path='/' component={Landing}/>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
