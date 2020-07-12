import React from 'react';
import {FadeInOut, FadeInOut_HandleState} from '../CustomTransition';
import NewMessage from './NewMessage';
import {toSingleCharArr, Soundex, findSimilarity, timeDifString} from './helperFunc';

class MessageCenter extends React.Component{
	constructor(props){
		super(props);

		this.textarea = React.createRef();
		this.searchMessages = React.createRef();

		this.state ={
			selectedIndex: null,
			searchString: null,
			showNew: false,
			classMates: [
				{
					name: 'Sarah Steel',
					profileImage: 'generic_person.jpg'
				},
				{
					name: 'John Doe',
					profileImage: 'morganFreeman.jpg'
				},
				{
					name: 'Jason Deurluo',
					profileImage: 'markWalberg.jpg'
				},
				{
					name: 'Patrick Steel',
					profileImage: 'generic_person.jpg'
				},
				{
					name: 'Jessica Jack',
					profileImage: 'markWalberg.jpg'
				},

			],
			testData: [
				{
					correspondent: {
						name: 'Sarah Steel',
						profileImage: 'generic_person.jpg',
					},
					unReadMessages: 1,
					messageData: [
						{
							date: new Date(),
							fromCorrespondent: true,
							message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
						},
						{
							date: new Date(),
							fromCorrespondent: false,
							message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
						},
						{
							date: new Date(2020, 6, 11, 12, 7, 0),
							fromCorrespondent: true,
							message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
						}

					]



				},
				// {
				// 	correspondent: {
				// 		name: 'John Doe',
				// 		profileImage: 'morganFreeman.jpg',
				// 	},
				// 	unReadMessages: 6,
				// 	messageData: [
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: true,
				// 			message: 'ciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		},
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: false,
				// 			message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		},
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: true,
				// 			message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		}

				// 	]
				// },
				// {
				// 	correspondent: {
				// 		name: 'Sarah Steel',
				// 		profileImage: 'generic_person.jpg',
				// 	},
				// 	unReadMessages: 1,
				// 	messageData: [
				// 		{
				// 			date: new Date().toDateString() ,
				// 			fromCorrespondent: true,
				// 			message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		},
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: false,
				// 			message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		},
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: true,
				// 			message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		}

				// 	]



				// },
				// {
				// 	correspondent: {
				// 		name: 'John Doe',
				// 		profileImage: 'morganFreeman.jpg',
				// 	},
				// 	unReadMessages: 6,
				// 	messageData: [
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: true,
				// 			message: 'ciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		},
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: false,
				// 			message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		},
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: true,
				// 			message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		}

				// 	]
				// },
				// {
				// 	correspondent: {
				// 		name: 'Sarah Steel',
				// 		profileImage: 'generic_person.jpg',
				// 	},
				// 	unReadMessages: 1,
				// 	messageData: [
				// 		{
				// 			date: new Date().toDateString() ,
				// 			fromCorrespondent: true,
				// 			message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		},
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: false,
				// 			message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		},
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: true,
				// 			message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		}

				// 	]



				// },
				// {
				// 	correspondent: {
				// 		name: 'John Doe',
				// 		profileImage: 'morganFreeman.jpg',
				// 	},
				// 	unReadMessages: 6,
				// 	messageData: [
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: true,
				// 			message: 'ciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		},
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: false,
				// 			message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		},
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: true,
				// 			message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		}

				// 	]
				// },
				// {
				// 	correspondent: {
				// 		name: 'Bartholemu Jankins',
				// 		profileImage: 'markWalberg.jpg',
				// 	},
				// 	unReadMessages: 6,
				// 	messageData: [
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: true,
				// 			message: 'ciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		},
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: false,
				// 			message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		},
				// 		{
				// 			date: new Date().toDateString(),
				// 			fromCorrespondent: true,
				// 			message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!'
										
				// 		}

				// 	]
				// }

			]
		}
	}

	messageSelectorClick(i){
		let testDataCopy = this.state.testData;

		testDataCopy[i].unReadMessages = 0;

		this.setState({
			selectedIndex: i,
			testData: testDataCopy
		})

		this.textarea = React.createRef();
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

	closeNew(){
		this.setState({
			showNew: false,
		})
	}

	showNew(){
		this.setState({
			showNew: true,
		})
	}




	render(){
		const showNewStyle = this.state.showNew ? {opacity: .2, transition: '.2s'} : null;

		let testVal, searchLength;
		if(this.state.searchString){
			testVal = Soundex(this.state.searchString);
			searchLength = this.state.searchString.length;
		}

		const messageSelectors = this.state.testData.map((data, index) =>
			findSimilarity(searchLength, toSingleCharArr(testVal), toSingleCharArr(Soundex(data.correspondent.name))) > .3 ?	
				<MessageSelector 
					name={data.correspondent.name} 
					profileImage={data.correspondent.profileImage}
					newMessages={data.unReadMessages}
					messageData={data.messageData}
					key={index}
					i={index}
					handleClick={(i) => this.messageSelectorClick(i)}
					selected={index===this.state.selectedIndex}
				/>
			: null
		)

		return(
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
								<button onClick={() => this.showNew()}>+</button>
							</div>
						</div>
						<div className='message-selector-container'>
							{messageSelectors}
						</div>
					</div>
					<div className='col-lg-8'>
						<div className='right'>
							{this.state.selectedIndex || this.state.selectedIndex===0 ? 
								<div style={{position: 'relative'}}>
									<FadeInOut condition={this.state.selectedIndex}>
										<div style={{position: 'absolute'}}>
											<MessageContainer
												messageData={this.state.testData[this.state.selectedIndex].messageData}
												profileImage={this.state.testData[this.state.selectedIndex].correspondent.profileImage}
												name={this.state.testData[this.state.selectedIndex].correspondent.name}
												noneSelected={!this.state.selectedIndex}
												key={this.state.testData[this.state.selectedIndex].messageData.length}
											/>
											<div className='reply'>
												<textarea ref={this.textarea} onKeyUp={(e) => this.handleTextInput(e)}></textarea>
											</div>
										</div>
									</FadeInOut>
								</div>
								:
								<div className='no-select'>
									<h2>Start or select a previous conversation</h2>
								</div>
							}
						</div>
					</div>
				</div>
				<FadeInOut_HandleState condition={this.state.showNew}>
					<NewMessage 
						classmates={this.state.classMates}
						closeNew={() => this.closeNew()}
					/>
				</FadeInOut_HandleState>
			</div>
			
		)
	}
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
				fromCorrespondent={data.fromCorrespondent}
				message={data.message}
			/>
		)

		return(
			<div className='messages-container'>
				<div className='header'>
					<img src={this.props.profileImage} alt="Can't display photo"/>
					<h1>{this.props.name}</h1>
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
			<h5>{props.date.toDateString()}</h5>
			<div className={receivedOrSent}>
				<p>{props.message}</p>
			</div>
		</div>
	)
}


function MessageSelector(props){
	const newMessages = props.newMessages > 0 ? <h2>{props.newMessages} New Message</h2>: null;
	const lastMessage = props.messageData[props.messageData.length-1].message;

	const selected = props.selected ? 'selected': null;

	return(
		<div className={'message-selector ' + selected} onClick={() => props.handleClick(props.i)}>
			<div className='row'>
				<div className='col-lg-1'>
					<img src={props.profileImage} alt="Can't display photo"/>
				</div>
				<div className='col-lg-7'>
					<h1>{props.name}</h1>
				</div>
				<div className='col-lg-4'>
					{newMessages}
				</div>
			</div>
			<h3>{timeDifString(props.messageData[props.messageData.length-1].date)} ago</h3>
			<p>{lastMessage}</p>
		</div>
	);
}

export default MessageCenter;