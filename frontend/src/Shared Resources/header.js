import React from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import moment from 'moment';

import Loader from './Effects/loader';
import {FadeInOutHandleState} from './Effects/CustomTransition';

import './header.css';

class Header extends React.Component{
	constructor(props){
		super(props);

		this.state={
			showACNotes: false,
		}
	}

	toggleAcademicNotifications(val){
		this.setState({
			showACNotes: val,
		})
	}

	render(){
		const acNotes = this.props.currentUser.notifications.academic.unDismissed;
		return(
			<div className='top-bar black-bc' style={style_topBar}>
				<Link to='/home'>
					<h1 className='mont-font blue-c'>Profecient</h1>
				</Link>
				<input className='sans-font' type='text' placeholder='Find classmates'/>
				
				<span className='not'>
					<span>
						<button onClick={() => this.toggleAcademicNotifications(true)} className='green-c off-black-bc'><i className="fas fa-pencil-alt"></i></button>
						<button className='drop-down off-black-bc'><i className="fas fa-chevron-down"></i></button>
						{acNotes > 0 ? <h5>{acNotes}</h5> : null}
						<FadeInOutHandleState condition={this.state.showACNotes}>
							<AcademicNotifications 
								updateCurrentUser={() => this.props.updateCurrentUser()} 
								getUpcommingAssignments={() => this.props.getUpcommingAssignments()} 
								currentUserID={this.props.currentUser._id}
								hideForm={() => this.toggleAcademicNotifications(false)}
							/>
						</FadeInOutHandleState>
					</span>
					
					<button className='green-c off-black-bc'><i className="fas fa-user-friends"></i></button>
					<Link to='/message'>
						<button className='green-c off-black-bc'><i className="fas fa-comments"></i></button>
					</Link>
				</span>

				
				<span className='profile'>
					<img src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + this.props.currentUser.profilePictureURL} alt=""/>
					<Link to={'/profile/' + this.props.currentUser._id}>
						<button className='blue-c'><i className="fas fa-chevron-down"></i></button>
					</Link>
				</span>

			</div>
		);
	}
}

const style_topBar = {
	paddingTop: 10,
	paddingLeft: 40,
	paddingRight: 40
}


class AcademicNotifications extends React.Component{
	constructor(props){
		super(props);

		this.state={
			notifications: null,
		}

		this.wrapperRef = React.createRef();
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount(){
		document.addEventListener('mousedown', this.handleClickOutside);
		this.getAcademicNotificiations();
	}

	 componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.props.hideForm();
        }
    }

	getAcademicNotificiations(){
		const endPoint = `http://localhost:8080/users/` + this.props.currentUserID + '/notifications/academic';

		axios.get(endPoint)
		.then((res) =>{
			this.setState({
				notifications: res.data,
			})
		})
	}

	addNewAss(otherUserAssID, myClassID, noteID){
		const endPoint = `http://localhost:8080/users/` + this.props.currentUserID +`/notifications/academic/` + noteID;

		axios.post(endPoint, {otherUserAssID: otherUserAssID, myClassID: myClassID})
		.then((res) =>{
			if(this.props.updateCurrentUser){
				this.props.updateCurrentUser();
			}
			if(this.props.getUpcommingAssignments){
				this.props.getUpcommingAssignments();
			}
			this.getAcademicNotificiations();
		})
	}

	removeNote(noteID){
		const endPoint = `http://localhost:8080/users/` + this.props.currentUserID +`/notifications/academic/` + noteID;

		axios.delete(endPoint)
		.then((res) =>{
			if(this.props.updateCurrentUser){
				this.props.updateCurrentUser();
			}
			this.getAcademicNotificiations();
		})

	}

	render(){
		let assAddedNotes = [];
		if(this.state.notifications !==null){
			for(let i =0; i< this.state.notifications.length; i++){
				const note = this.state.notifications[i];			
				if(note.note_Data === 'Ass Added'){
					assAddedNotes.push(<AssAddedNote removeAssNote={() => this.removeNote(note._id)} addAss={() => this.addNewAss(note.assignment._id, note.myClass.class_id, note._id)} key={i} data={note}/>);
				}
			}
		}
		return(
			<div ref={this.wrapperRef} className='note-container'>
				{this.state.notifications ?
					<React.Fragment>
						{assAddedNotes.length >0 ?
							<React.Fragment>
							{assAddedNotes}
							</React.Fragment>
						:
							<p style={{textAlign: 'center'}} className='muted-c'>No notifications</p>
						}
					</React.Fragment>
				:
					<Loader/>
				}
			</div>
		)
	}
}

function AssAddedNote(props){
	return(
		<div className='ass-added sans-font'>
			<button onClick={() => props.removeAssNote()} className='remove red-c'>Remove</button>
			<h1>New Assignment</h1>
			<hr/>
			<h1 className='class-name'>{props.data.myClass.class_name}</h1>
			<h2>From
				<Link to={'/profile/' + props.data.otherUser.user_id}>
					<span className='other-user'>
						<img src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + props.data.otherUser.user_information.profilePictureURL} alt="Can't display"/>
						{props.data.otherUser.user_information.name}
					</span>
				</Link>
			</h2>
			<div className='ass-info'>
				<h4>Name: <span>{props.data.assignment.name}</span></h4>
				<h4>Due: <span>{moment(props.data.assignment.dueDate).format('dddd MMM Do')}</span></h4>
				{props.data.assignment.description !== "" ?
					<p>{props.data.assignment.description}</p>
				:
					null
				}
				<div className='add'>
					<button onClick={() => props.addAss()} className='green-c'>Add</button>
				</div>
			</div>
		</div>
	)
}

export default Header;

