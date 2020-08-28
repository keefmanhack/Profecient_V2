import React from 'react';
import {FadeInOut_HandleState, FadeInOut} from '../CustomTransition';
import {toSingleCharArr, Soundex, findSimilarity} from './helperFunc';

class NewMessage extends React.Component{
	constructor(props){
		super(props);

		this.search = React.createRef();

		this.state ={
			inputText: null,
			selectedIndex: null
		}
	}
	
	handleSearch(){
		this.setState({
			inputText: this.search.current.value,
		})
	}

	handleClick(i){
		this.setState({
			selectedIndex: i,
		})
	}

	removeSelected(){
		this.setState({
			selectedIndex: null,
			inputText: null,
		})
	}


	render(){
		let testVal, searchLength;
		if(this.state.inputText){
			testVal = Soundex(this.state.inputText);
			searchLength = this.state.inputText.length;
		}

		const searchItems = this.props.classmates.map((data, index) =>
			findSimilarity(searchLength, toSingleCharArr(testVal), toSingleCharArr(Soundex(data.name))) > .3 ?
				<SearchItem 
					handleClick={(i) => this.handleClick(i)} 
					key={index} 
					image={data.profileImage} 
					text={data.name} 
					i={index}
				/>
			: null
		);

		const searchItemDis = (searchItems.length > 0 && this.state.inputText && this.state.selectedIndex === null) ?
								<FadeInOut condition={this.state.inputText}>
									<div className='search-container'>
										{searchItems}
									</div>
								</FadeInOut>
							: null

		const pushDown = this.state.selectedIndex !== null ? {position: 'relative', height: 65} : {position: 'relative', height: 30};

		return(
			<div className='new-message-container'>
				<div className='new-message'>
					<button onClick={() => this.props.closeNew()} className='close-new-message'>Cancel</button>
					<div style={pushDown}>
						<FadeInOut condition={this.state.selectedIndex}>
						{this.state.selectedIndex !== null ? 	
							<SelectedClassmate 
								image={this.props.classmates[this.state.selectedIndex].profileImage}
								name={this.props.classmates[this.state.selectedIndex].name}
								removeSelected={() => this.removeSelected()}
							/>
						:
							<input style={{position: 'absolute'}} ref={this.search} onKeyUp={() => this.handleSearch()} placeholder='Find classmate' type="text"/>
						}
						</FadeInOut>
					</div>
					{searchItemDis}

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
				className='selected-classmate-container'
			>
				<img src={this.props.image} alt="Can't display image"/>
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
		<div onClick={() => props.handleClick(props.i)} className='search-item'>
			<img src={props.image} alt="Can't display image"/>
			<h1>{props.text}</h1>
		</div>
	);
}

export default NewMessage;