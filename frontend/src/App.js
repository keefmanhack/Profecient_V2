import React from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import axios from 'axios';

import Login from './LandingSignUpLogin/Login';
import MessageCenter from './MessageCenter/Message-Center';
import Home from './Home';
import ProfilePage from './profile-page';
import Landing from './landing';
// import SemesterCreator from './SemesterCreator/SemesterCreator';


class App extends React.Component{
	constructor(props){
		super(props);

		this.state={
			currentUser: null,
		}


		this.testUserId = '5f4aa6042c0c8f715ae71d97';
	}

	componentDidMount(){
		axios.get(`http://localhost:8080/users/` + this.testUserId )
	    .then(res => {
			this.setState({
				currentUser: res.data,
			})
		})
	}

	render(){
		return(	
			<Router>
				<div className="App">
					<Switch>
						<Route path='/message' component={MessageCenter}/>
						<Route path='/home' component={Home}/>
						<Route path='/profilePage'>
							<ProfilePage currentUser={this.state.currentUser}/>
						</Route>
						<Route path='/' component={Landing}/>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
