import React from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Login from './Login Landing/Login';
import Landing from './Login Landing/landing';
import MessageCenter from './MessageCenter/Message-Center';
import Home from './Home/Home';
import ProfilePage from './Profile Page/profile-page';

import Loader from './Shared Resources/Effects/loader';

import './Shared Resources/index.css';

import UserRequests from './APIRequests/User';

class App extends React.Component{
	constructor(props){
		super(props);

		this.testUserId = '5f9f5a451aa120b9a2f0e867';

		//Stan Smith - 5f9f5a451aa120b9a2f0e864
		//Quenn Latifa  - 5f9f5a451aa120b9a2f0e867
		//King Bee    - 5f9f5592ae9015ab30065c8d

		this.UserRqst = new UserRequests(this.testUserId);


		this.state={
			currentUser: null,
			foundID: null,
		}
	}

	componentDidMount(){
		this.getCurrentUser();
		// this.UserRqst.createTestUsers();
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
									reloadCurrUser={() => this.getCurrentUser()}
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
