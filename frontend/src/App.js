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


class App extends React.Component{
	constructor(props){
		super(props);

		this.state={
			currentUser: null,
			foundUser: null,
		}

		this.profileIDRef = React.createRef();

		this.testUserId = '5f4aa6042c0c8f715ae71d97';

		//Keefer - 5f4aa6042c0c8f715ae71d97
		//Sarah  - 5f5aab5a6f1dda2b82855985
		//Pat    - 5f5d3bea7c33842654ec2efb
	}

	componentDidMount(){
		this.getCurrentUser();
	}

	getRequestedUser(id){
		// alert(id);
		console.log(id);
		axios.get(`http://localhost:8080/users/` + id)
	    .then(res => {
			this.setState({
				foundUser: res.data,
			})
		})
	}

	getCurrentUser(){
		axios.get(`http://localhost:8080/users/` + this.testUserId )
	    .then(res => {
			this.setState({
				currentUser: res.data,
			})
		})
	}

	handleChange(){
		console.log(this.profileIDRef);
		alert('changed')
	}

	render(){
		return(	
			<Router>
				<div className="App">
					<Switch>
						<Route path='/message'>
							{this.state.currentUser ? <MessageCenter currentUser={this.state.currentUser}/> : <Loader/>}
						</Route>
						<Route path='/home'>
							{this.state.currentUser ? <Home currentUser={this.state.currentUser}/> : <Loader/>}
						</Route>
						<Route path='/profile/:id' children={({match}) => {
							if(this.state.currentUser){
								return (<ProfilePage 
									foundUser={match.params.id} 
									updateCurrentUser={() => this.getCurrentUser()} 
									currentUser={this.state.currentUser}
								/> )
							}else{
								return (<Loader/>)
							}
						}}/>
		
						<Route path='/' component={Landing}/>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
