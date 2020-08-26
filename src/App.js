import React from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Login from './LandingSignUpLogin/Login';
import MessageCenter from './MessageCenter/Message-Center';
import Home from './Home';
import ProfilePage from './profile-page';
// import SemesterCreator from './SemesterCreator/SemesterCreator';


function App(){
	return(	
		<Router>
			<div className="App">
				<Switch>
					<Route path='/message' component={MessageCenter}/>
					<Route path='/home' component={Home}/>
					<Route path='/profilePage' component={ProfilePage}/>
					<Route path='/' component={Login}/>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
