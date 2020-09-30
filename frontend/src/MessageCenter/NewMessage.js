import React from 'react';
import axios from 'axios';

import {FadeInOutHandleState} from '../Shared Resources/Effects/CustomTransition';
// import {toSingleCharArr, Soundex, findSimilarity} from './helperFunc';
import {SentSuccess} from '../Shared Resources/Effects/lottie/LottieAnimations';

class NewMessage extends React.Component{
	constructor(props){
		super(props);

		
		this.state ={
			selectedUser: null,
			searchedUsers: [],
			errors: {
				selectedUser: false,
				message:false,
			},
			success: false,
		}

		this.search = React.createRef();
		this.message = React.createRef();
	}

	componentDidMount(){
		if(this.props.preSelectedUserID !== null){
			axios.get(`http://localhost:8080/users/` + this.props.preSelectedUserID)
			.then(res => {
				this.setState({
					selectedUser: res.data,
				})
			})
		}
	}
	
	handleSearch(){
		const searchString = this.search.current.value;
		if(searchString !== ''){
			axios.post(`http://localhost:8080/users`, {searchString: searchString})
		    .then(res => {
				this.setState({
					searchedUsers: res.data
				})
			});
		}else{
			this.setState({
				searchedUsers: []
			})
		}
	}

	searchItemClicked(i){
		const searchedUsers = this.state.searchedUsers;
		this.setState({
			selectedUser: searchedUsers[i],
		})
	}

	removeSelected(){
		this.setState({
			selectedUser: null,
			searchedUsers: []
		})
	}

	sendNewMessage(){
		if(!this.checkErrors()){
			const endPoint = 'http://localhost:8080/messageStream';

			const data= {
				communicators: [this.props.currentUser._id, this.state.selectedUser._id],
				sentMessages: [{
					message: this.message.current.value,
					sender: this.props.currentUser._id,
				}]
			}

			axios.post(endPoint, data)
			.then((response) => {
				this.setState({
					success: true,
				})
				if(this.props.preSelecteUserID){
					this.props.removePreSelectedUserID();
				}
			}).catch((error) => {
				console.log(error);
			});
		}
	}

	checkErrors(){
		let error_copy = this.state.errors;
		if(this.state.selectedUser===null){
			error_copy.searchedUsers = true;
		}else{
			error_copy.selectedUser = false;
		}

		if(this.message.current.value === ''){
			error_copy.message=true;
		}else{
			error_copy.message=false;
		}

		this.setState({
			errors: error_copy
		});

		if(error_copy.searchedUsers || error_copy.message){
			return true;
		}else{
			return false;
		}
	}


	render(){
		const searchItems = this.state.searchedUsers.map((data, index) =>
			<SearchItem 
				handleClick={(i) => this.searchItemClicked(i)} 
				key={index} 
				image={data.profilePictureURL} 
				text={data.name} 
				i={index}
			/>
		);

		const pushDown = this.state.selectedUser !== null ? {position: 'relative', height: 65} : {position: 'relative', height: 30};


		return(
			<div className='new-message-container sans-font'>
				<FadeInOutHandleState condition={this.state.success}>
	 				<SentSuccess onCompleted={() =>this.props.closeNew()}/>
	 			</FadeInOutHandleState>
				<div className='new-message'>
					<button onClick={() => this.props.closeNew()} className='close-new-message'>Cancel</button>
					<div style={pushDown}>
						{this.state.selectedUser!==null ? 
							<SelectedClassmate 
								image={this.state.selectedUser.profilePictureURL}
								name={this.state.selectedUser.name}
								removeSelected={() => this.removeSelected()}
							/>
						:null}
						<FadeInOutHandleState condition={this.state.selectedUser === null}>
							<input 
								style={this.state.errors.message ? {border: '1px solid red', position: 'absolute'} : {position: 'absolute'}}
								ref={this.search} 
								onKeyUp={() => this.handleSearch()} 
								placeholder='Find classmate' 
								type="text"
							/>
						</FadeInOutHandleState>
					</div>
					<FadeInOutHandleState condition={this.state.searchedUsers.length>0 && this.state.selectedUser===null}>
						<div className='search-container'>
							{searchItems}
						</div>
					</FadeInOutHandleState>

					<hr/>
					
					<textarea ref={this.message} style={this.state.errors.message ? {border: '1px solid red'} : null} placeholder='Write message'></textarea>

					<button onClick={() => this.sendNewMessage()} className='send'><i class="fas fa-paper-plane"></i> Send</button>

				</div>
			</div>
		);
	}
}

class SelectedClassmate extends React.Component{
	constructor(props){
		super(props);

		this.state={
			removeBtn: false,
		}
	}

	showRemoveBtn(){
		this.setState({
			removeBtn: true,
		})
	}

	hideRemoveBtn(){
		this.setState({
			removeBtn: false,
		})
	}
	
	render(){
		return(
			<div 
				onMouseOver={() => this.showRemoveBtn()}
				onMouseLeave={() => this.hideRemoveBtn()} 
				style={{position: 'absolute'}} 
				className='selected-classmate-container light-green-bc'
			>
				<img src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + this.props.image} alt="Can't display"/>
				<h1>{this.props.name}</h1>
				<FadeInOutHandleState condition={this.state.removeBtn} >
					<button onClick={() => this.props.removeSelected()}>X</button>
				</FadeInOutHandleState>
			</div>
		);
	}
	
}

function SearchItem(props){

	return(
		<div onClick={() => props.handleClick(props.i)} className='search-item light-green-bc'>
			<img src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + props.image} alt="Can't display"/>
			<h1>{props.text}</h1>
		</div>
	);
}

export default NewMessage;