import React from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Login from './Components/Login Landing/Login';
import OnBoard from './Components/Login Landing/Landing-UserCreator/Onboard';
import MessageCenter from './Components/MessageCenter/Message-Center';
import Home from './Components/Home/Home';
import ProfilePage from './Components/Profile Page/profile-page';
import ForgotPassword from './Forgotten Password/ForgotPassword';


import Loader from './Components/Shared Resources/Effects/Loader/loader';

import AuthRoute from './Authentication/AuthRoute';

import './Components/Shared Resources/index.css';

import UserRequests from './APIRequests/User';
import SemesterCreator from './Components/Semester Creator/SemesterCreator';

class App extends React.Component{
	constructor(props){
		super(props);

		// this.testUserId = '5f9f5a451aa120b9a2f0e867';

		//Stan Smith - 5f9f5a451aa120b9a2f0e864
		//Quenn Latifa  - 5f9f5a451aa120b9a2f0e867
		//King Bee    - 5f9f5592ae9015ab30065c8d

		this.UserRqst = null;

		this.state={
			currentUser: null,
			currentUserID: null,
			foundID: null,
		}
	}

	componentDidMount(){
		// this.getCurrentUser();
		// this.UserRqst.createTestUsers();
	}

	async setCurrentUserID(id){
		this.UserRqst = new UserRequests(id);
		this.setState({currentUserID: id});
		await this.getCurrentUser();
	}

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
						
						<AuthRoute path='/home' component={Home}/>
						<AuthRoute path='/profile/:id' component={ProfilePage}/>
						<AuthRoute path='/newSemester' component={SemesterCreator}/>
						
						<Route path='/forgotPassword' component={ForgotPassword}/>
						<Route path='/login' component={({history}) => {
							return (<Login history={history}/>)
						}}/>
						<Route path='/' component={OnBoard}/>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
