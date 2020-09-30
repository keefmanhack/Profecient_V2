import React from 'react';
import axios from 'axios';

import {FadeInOutHandleState, FadeRightHandleState} from '../Shared Resources/Effects/CustomTransition';
import NewMessage from './NewMessage';
import {timeDifString} from './helperFunc';
import Header from '../Shared Resources/header';

import './message-center.css';


class MessageCenter extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			selectedIndex: null,
			searchString: '',
			showNew: false,
			messageStreams: [],
			preSelectedUserID: null,
		}

		this.textarea = React.createRef();
		this.searchMessages = React.createRef();
	}

	componentDidMount(){
		if(this.props.selectedID){
			this.getMessagesSelected(this.props.selectedID);
		}else{
			this.getMessages();
		}
		
	}

	getMessages(){
		axios.get(`http://localhost:8080/users/` + this.props.currentUser._id + '/messageStreams')
	    .then(res => {
	    	this.setState({
	    		messageStreams: res.data,
	    	})

		})
		.catch((error) => {
			console.log(error);
		})
	}

	getMessagesSelected(selectedID){
		axios.get(`http://localhost:8080/users/` + this.props.currentUser._id + '/messageStreams')
	    .then(res => {
	    	let temp = null;
	    	let showNew = false;
	    	let preSelectedUserID = null;
	    	if(selectedID !== this.props.currentUser._id){
		    	for(let i =0; i<res.data.length; i++){
		    		for(let j =0; j<res.data[i].communicators.length; j++){
		    			const communicator = res.data[i].communicators[j];
		    			if(communicator._id===selectedID && communicator._id !== this.props.currentUser._id){
		    				temp =i;
		    				i=res.data.length;
		    				j=res.data[i].communicators.length;
		    			}
		    		}
		    	}
		    }

		    if(temp===null){
		    	showNew = true;
		    	preSelectedUserID = selectedID;
		    }

	    	this.setState((state, props) => ({
	    		messageStreams: res.data,
	    		selectedIndex: temp,
	    		showNew: showNew,
	    		preSelectedUserID: preSelectedUserID,
	    	}))

		})
		.catch((error) => {
			console.log(error);
		})
	}

	messageSelectorClick(i){
		let messageStreams = this.state.messageStreams;

		messageStreams[i].sentMessages.forEach(function(sentMessage){
			if(sentMessage.sender !== this.props.currentUser._id){
				sentMessage.read = true;
			}
		}.bind(this));

		this.updateMessageStreams(messageStreams[i]);

		this.setState({
			selectedIndex: i,
			messageStreams: messageStreams,
		})
	}

	updateMessageStreams(messageStream){
		axios.put(`http://localhost:8080/messageStream/` + messageStream._id, {messageStream: messageStream})
	    .then(res => {
	    	console.log(res);
		})
		.catch((error) => {
			console.log(error);
		})
	}

	deleteMessageStream(i){
		const messageStream = this.state.messageStreams[i];

		axios.delete(`http://localhost:8080/user/` + this.props.currentUser._id + '/messageStream/' + messageStream._id)
	    .then(res => {
	    	console.log(res);
	    	this.setState({
	    		selectedIndex: null,
	    		preSelectedUserID: null,
	    	})
	    	this.getMessages();
		})
		.catch((error) => {
			console.log(error);
		})

	}

	handleTextInput(e){
		if(e.key === 'Enter'){
			const newMessage = {
				sender: this.props.currentUser._id,
				message: this.textarea.current.value.trim(),
				date: new Date(),
			}
			this.textarea.current.value = '';
			
			let messageStreams = this.state.messageStreams;
			messageStreams[this.state.selectedIndex].sentMessages.push(newMessage);

			this.setState({
				messageStreams: messageStreams,
			})

			this.updateMessageStreams(messageStreams[this.state.selectedIndex]);
		}
	}

	handleSearch(){
		this.setState({
			searchString: this.searchMessages.current.value,
		})
	}


	showNew(val){
		this.setState({
			showNew: val,
		})

		if(!val){ //new message closed
			this.getMessages();
			this.setState({
				preSelectedUserID: null,
			})
		}
	}




	render(){
		const showNewStyle = this.state.showNew ? {opacity: .2, transition: '.2s'} : null;

		const messageSelectors = this.state.messageStreams.map((data, index) => {
			const communicator = findCommunicator(data.communicators, this.props.currentUser._id);
			if(communicator.name.toLowerCase().match(this.state.searchString.toLowerCase())){
				return <MessageSelector 
					communicator={communicator}
					messageData={data.sentMessages}
					currentUser={this.props.currentUser}
					key={index}
					handleClick={() => this.messageSelectorClick(index)}
					selected={index===this.state.selectedIndex}
					delete={() => this.deleteMessageStream(index)}
				/>
			}
			return null;
		});

		return(
			<React.Fragment>
				<Header currentUser={this.props.currentUser}/>
				<div className='page-container message-center'>
					<div className='row' style={showNewStyle}>
						<div className='col-lg-4 left' style={{borderRight: '1px solid', height: 600}}>
							<div className='row'>
								<div className='col-lg-10'>
									<input 
										placeholder='Find classmates' 
										type="text" 
										onKeyUp={() => this.handleSearch()}
										ref={this.searchMessages}
									/>
								</div>
								<div className='col-lg-2'>
									<button onClick={() => this.showNew(true)}>+</button>
								</div>
							</div>
							<div className='message-selector-container'>
								<FadeInOutHandleState condition={this.state.messageStreams.length > 0}>
									<React.Fragment>
										{messageSelectors}
									</React.Fragment>
								</FadeInOutHandleState>
								{this.state.messageStreams.length===0 ? <p className='muted-c'>No Messages</p> : null}
							</div>
						</div>
						<div className='col-lg-8'>
							<div className='right'>
							{this.state.selectedIndex === null ? 
									<div className='no-select'>
										<h2>Start or select a previous conversation</h2>
									</div>
								:
									<div>
										<MessageContainer
											messageData={this.state.messageStreams[this.state.selectedIndex].sentMessages}
											communicator={findCommunicator(this.state.messageStreams[this.state.selectedIndex].communicators, this.props.currentUser._id)}
											noneSelected={!this.state.selectedIndex}
											currentUser={this.props.currentUser}
										/>
										<div className='reply'>
											<textarea placeholder='Write a message...' ref={this.textarea} onKeyUp={(e) => this.handleTextInput(e)}></textarea>
										</div>
									</div>
								}
							</div>
						</div>
					</div>
					<FadeInOutHandleState condition={this.state.showNew}>
						<NewMessage 
							closeNew={() => this.showNew(false)}
							currentUser={this.props.currentUser}
							preSelectedUserID={this.state.preSelectedUserID}
							removePreSelectedUserID={() => this.setState({preSelectedUserID: null})}
						/>
					</FadeInOutHandleState>
				</div>
			</React.Fragment>
			
		)
	}
}

function findCommunicator(communicators, currUserId){
	let foundUser = null;

	communicators.forEach(function(communicator){
		if(communicator._id !== currUserId){
			foundUser= communicator;
		}
	});
	//should add array functionality to get all correspondents

	return foundUser;
}


class MessageContainer extends React.Component{

	scrollToBottom = () => {
	  this.messagesEnd.scrollIntoView();
	}

	componentDidMount() {
	  this.scrollToBottom();
	}

	componentDidUpdate() {
	  this.scrollToBottom();
	}

	render(){
	
		const messages = this.props.messageData.map((data, index) =>
			<Message 
				key={index}
				date={data.date}
				fromCorrespondent={this.props.currentUser._id !== data.sender}
				message={data.message}
			/>
		)

		return(
			<div className='messages-container'>
				<div className='header'>
					<img src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + this.props.communicator.profilePictureURL} alt="Can't display"/>
					<h1>{this.props.communicator.name}</h1>
				</div>
				<div className='messages-body'>
					{messages}
					<div style={{ float:"left", clear: "both" }}
			            ref={(el) => { this.messagesEnd = el; }}>
			        </div>
				</div>
			</div>
		);
	}
}

function Message(props){
	const receivedOrSent = props.fromCorrespondent ? 'received' : 'sent';
	return (
		<div className='messages'>
			<h5>{new Date(props.date).toDateString()}</h5>
			<div className={receivedOrSent}>
				<p>{props.message}</p>
			</div>
		</div>
	)
}


class MessageSelector extends React.Component{
	constructor(props){
		super(props);

		this.state={
			mouseOver: false,
		}
	}

	render(){
		const unReadMessageCount = findUnReadMessageCount(this.props.currentUser._id, this.props.messageData);
		const newMessages = unReadMessageCount > 0 ? <h2>{unReadMessageCount} New Message</h2>: null;
		const lastMessage = this.props.messageData[this.props.messageData.length-1].message;

		const selected = this.props.selected ? 'selected': null;

		return(
			<div className={'message-selector ' + selected}>
				<div className='row'>
					<div className='col-lg-1'>
						<img src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + this.props.communicator.profilePictureURL} alt="Can't display"/>
					</div>
					<div className='col-lg-7'>
						<h1>{this.props.communicator.name}</h1>
					</div>
					<div className='col-lg-4'>
						{newMessages}
					</div>
				</div>
				<h3>{timeDifString(new Date(this.props.messageData[this.props.messageData.length-1].date))} ago</h3>
				<p>{lastMessage}</p>
				<div className='selector' onClick={() => this.props.handleClick(this.props.i)}/>
				<div className='delete' onMouseEnter={() => this.setState({mouseOver:true})} onMouseLeave={() => this.setState({mouseOver:false})}>
					<FadeRightHandleState condition={this.state.mouseOver === true}>
						<button onClick={() => this.props.delete()}>
							<i className='fas fa-trash'></i>
						</button>
					</FadeRightHandleState>
				</div>
			</div>
		);
	}
}

function findUnReadMessageCount(currUserId, messages){
	let ct =0;
	messages.forEach(function(message){
		if(message.sender !== currUserId && !message.read){
			ct++;
		}
	})

	return ct;
}

export default MessageCenter;