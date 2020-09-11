import React from 'react';
import axios from 'axios';

import {FadeInOut, FadeInOut_HandleState} from '../CustomTransition';
import NewMessage from './NewMessage';
import {toSingleCharArr, Soundex, findSimilarity, timeDifString} from './helperFunc';
import Header from '../header';

class MessageCenter extends React.Component{
	constructor(props){
		super(props);

		this.textarea = React.createRef();
		this.searchMessages = React.createRef();

		this.state ={
			selectedIndex: null,
			searchString: null,
			showNew: false,
			messageStreams: [],
		}

		this.textarea = React.createRef();
	}

	componentDidMount(){
		this.getMessages();
	}

	getMessages(){
		axios.get(`http://localhost:8080/users/` + this.props.currentUser._id + '/messageStreams')
	    .then(res => {
	    	console.log(res.data);

	    	this.setState({
	    		messageStreams: res.data,
	    	})

		})
		.catch((error) => {
			console.log(error);
		})
	}

	messageSelectorClick(i){
		this.setState({
			selectedIndex: i,
		})


		axios.put(endPoint, data)
	}

	updateMessage(id, data){
		axios.put(`http://localhost:8080/messages/` + id, data)
	    .then(res => {
	    	console.log(res);
		})
		.catch((error) => {
			console.log(error);
		})
	}

	handleTextInput(e){
		if(e.key === 'Enter'){
			const newMessage = {
				date: new Date(),
				fromCorrespondent: false,
				message: this.textarea.current.value.substring(0, this.textarea.current.value.length-1),
			}
			this.textarea.current.value = '';
			
			let testDataCopy = this.state.testData;
			testDataCopy[this.state.selectedIndex].messageData.push(newMessage);

			this.setState({
				testData: testDataCopy,
			})
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
		}
	}




	render(){
		const showNewStyle = this.state.showNew ? {opacity: .2, transition: '.2s'} : null;


		const messageSelectors = this.state.messageStreams.map((data, index) =>
			<MessageSelector 
				communicator={findCommunicator(data.communicators, this.props.currentUser._id)}
				messageData={data.sentMessages}
				currentUser={this.props.currentUser}
				key={index}
				handleClick={() => this.messageSelectorClick(index)}
				selected={index===this.state.selectedIndex}
			/>
		);

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
								<FadeInOut_HandleState condition={this.state.messageStreams.length > 0}>
									<React.Fragment>
										{messageSelectors}
									</React.Fragment>
								</FadeInOut_HandleState>
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
											<textarea ref={this.textarea} onKeyUp={(e) => this.handleTextInput(e)}></textarea>
										</div>
									</div>
								}
							</div>
						</div>
					</div>
					<FadeInOut_HandleState condition={this.state.showNew}>
						<NewMessage 
							closeNew={() => this.showNew(false)}
							currentUser={this.props.currentUser}
						/>
					</FadeInOut_HandleState>
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
	console.log(foundUser);
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
					<img src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + this.props.communicator.profilePictureURL} alt="Can't display photo"/>
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


function MessageSelector(props){
	const unReadMessageCount = findUnReadMessageCount(props.currentUser._id, props.messageData);
	const newMessages = unReadMessageCount > 0 ? <h2>{unReadMessageCount} New Message</h2>: null;
	const lastMessage = props.messageData[props.messageData.length-1].message;

	const selected = props.selected ? 'selected': null;

	return(
		<div className={'message-selector ' + selected} onClick={() => props.handleClick(props.i)}>
			<div className='row'>
				<div className='col-lg-1'>
					<img src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + props.communicator.profilePictureURL} alt="Can't display photo"/>
				</div>
				<div className='col-lg-7'>
					<h1>{props.communicator.name}</h1>
				</div>
				<div className='col-lg-4'>
					{newMessages}
				</div>
			</div>
			<h3>{timeDifString(new Date(props.messageData[props.messageData.length-1].date))} ago</h3>
			<p>{lastMessage}</p>
		</div>
	);
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