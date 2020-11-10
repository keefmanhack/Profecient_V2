import React, {useState} from 'react';
import {Link} from "react-router-dom";

import {FadeInOutHandleState} from '../Effects/CustomTransition';
// import {SuccessCheck, FailedSent} from './Effects/lottie/LottieAnimations';
import UserSearch from '../User Search/UserSearch';
import NotificationContainer from '../Notifications/NotificationContainer';

import MenuDropDown, {DropDownMain, Divider} from '../Drop Down/MenuDropDown';

import UserRequest from '../../../APIRequests/User';

import RelationalNotifReq from '../../../APIRequests/Notification/Concrete/RelationalNotifReq';
import AcademicNotifReq from '../../../APIRequests/Notification/Concrete/AcademicNotifReq';

import {logOut} from '../../../Authentication/Authenticator';

import './header.css';

class Header extends React.Component{
	constructor(props){
		super(props);

		this.userReq = new UserRequest(this.props.currentUser._id);

		this.state={
			showACNotes: false,
			showMsgNotes: false,
			showRelNotes: false,
			showDropDown: false,
			foundClassMates: [],
		}
	}

	async findUsers(text){
		this.setState({foundClassMates: await this.userReq.findMultiple(text)});
	}

	render(){
		const acNotes = this.props.currentUser.notifications.academic.unDismissed;
		// const msgNotes = this.props.currentUser.notifications.messages.unDismissed;
		const relNotes = this.props.currentUser.notifications.relations.unDismissed;
		return(
			<div className='top-bar black-bc'>
				<Link to='/home'>
					<h1 className='mont-font blue-c'>Profecient</h1>
				</Link>
				<div style={{display: 'inline', 'position': 'relative'}}>
					<input onChange={(e) => this.findUsers(e.target.value)} className='sans-font' type='text' placeholder='Find classmates'/>
					{this.state.foundClassMates.length>0 ?
						<div style={{width: 300, left: 0, position: 'absolute'}}>
							<UserSearch 
								hide={() => this.setState({foundClassMates: []})} 
								users={this.state.foundClassMates}
							/>
						</div>
					: 
						null
					}
				</div>
				
				
				<div style={{display: 'inline-block', width: 150}} className='not'>
					<div className='row'>
						<div className='col-xs-4'>
							<div className='not-wrapper'>
								<button onClick={() => this.setState({showACNotes: true})} className='green-c off-black-bc'><i className="fas fa-pencil-alt"></i></button>
								{acNotes > 0 ? <h5>{acNotes}</h5> : null}
								<FadeInOutHandleState condition={this.state.showACNotes}>
									<NotificationContainer 
										type={AcademicNotifReq}
										currentUserID={this.props.currentUser._id}
										hide={() => this.setState({showACNotes: false})}
									/>
								</FadeInOutHandleState>
							</div>
						</div>
						<div className='col-xs-4'>
							<div className='not-wrapper'>
								<button onClick={() => this.setState({showRelNotes: true})} className='green-c off-black-bc'><i className="fas fa-user-friends"></i></button>
								{relNotes > 0 ? <h5>{relNotes}</h5> : null}
								<FadeInOutHandleState condition={this.state.showRelNotes}>
									<NotificationContainer 
										type={RelationalNotifReq}
										currentUserID={this.props.currentUser._id}
										hide={() => this.setState({showRelNotes: false})}
									/>
								</FadeInOutHandleState>
							</div>	
						</div>
						<div className='col-xs-4'>
							<div className='not-wrapper'>
								<Link to='/message'>
									<button className='green-c off-black-bc'><i className="fas fa-comments"></i></button>
								</Link>
								{/* <button onClick={() => this.setState({showMsgNotes: true})} className='drop-down off-black-bc'><i className="fas fa-chevron-down"></i></button>
								{msgNotes> 0 ? <h5>{msgNotes}</h5> : null} */}

							</div>
						</div>
					</div>
				</div>

				
				<span className='profile'>
					<Link to={'/profile/' + this.props.currentUser._id}>
					<img 
						src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + this.props.currentUser.profilePictureURL} 
						alt=""
						onError={(e) => {e.target.onerror = null; e.target.src="/generic_school.jpg"}}
					/>
					</Link>
					<button onClick={() => this.setState({showDropDown: true})} className='blue-c'><i className="fas fa-chevron-down"></i></button>
					<FadeInOutHandleState condition={this.state.showDropDown}>
						<div className='header-drop-down'>
							<MenuDropDown hideDropDown={() => this.setState({showDropDown: false})}>
								<DropDownMain>
									<Link to={'/profile/' + this.props.currentUser._id}>
										<button>My Profile</button>
									</Link>
									<Divider/>
									<button onClick={() => logOut()}>Log Out</button>
								</DropDownMain>
							</MenuDropDown>
						</div>
					</FadeInOutHandleState>
				</span>

			</div>
		);
	}
}

export default Header;

