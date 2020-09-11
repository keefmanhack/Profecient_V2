import React from 'react';
import axios from 'axios';

import {FadeInOut_HandleState, FadeInOut} from '../CustomTransition';
import {toSingleCharArr, Soundex, findSimilarity} from './helperFunc';

class NewMessage extends React.Component{
	constructor(props){
		super(props);

		this.search = React.createRef();

		this.state ={
			selectedUser: null,
			searchedUsers: [],
		}
	}
	
	handleSearch(){
		console.log('b'+this.search.current.innerText+'b');
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
		
		// this.setState({
		// 	inputText: this.search.current.value,
		// })
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


	render(){
		// let testVal, searchLength;
		// if(this.state.inputText){
		// 	testVal = Soundex(this.state.inputText);
		// 	searchLength = this.state.inputText.length;
		// }

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
						<FadeInOut_HandleState condition={this.state.selectedUser === null}>
							<input style={{position: 'absolute'}} ref={this.search} onKeyUp={() => this.handleSearch()} placeholder='Find classmate' type="text"/>
						</FadeInOut_HandleState>
					</div>
					<FadeInOut_HandleState condition={this.state.searchedUsers.length>0 && this.state.selectedUser===null}>
						<div className='search-container'>
							{searchItems}
						</div>
					</FadeInOut_HandleState>

					<hr/>
					
					<textarea placeholder='Write message'></textarea>

					<button className='send'><i class="fas fa-paper-plane"></i> Send</button>

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
				<img src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + this.props.image} alt="Can't display image"/>
				<h1>{this.props.name}</h1>
				<FadeInOut_HandleState condition={this.state.removeBtn} >
					<button onClick={() => this.props.removeSelected()}>X</button>
				</FadeInOut_HandleState>
			</div>
		);
	}
	
}

function SearchItem(props){

	return(
		<div onClick={() => props.handleClick(props.i)} className='search-item light-green-bc'>
			<img src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + props.image} alt="Can't display image"/>
			<h1>{props.text}</h1>
		</div>
	);
}

export default NewMessage;