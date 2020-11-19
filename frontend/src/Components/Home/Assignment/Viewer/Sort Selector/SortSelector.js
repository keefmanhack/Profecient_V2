import React from 'react'

import sortOptions from './SortOptions';

import './index.css';
class SortSelector extends React.Component{
	constructor(props){
		super(props);
		this.state={
			selectedOption: sortOptions[0],
		}
	}

	static getInitial(){
		return sortOptions[0];
	}

	handleClick(option){
		this.props.setSortType(option);
		this.setState({selectedOption: option});
	}

	render(){
			const items = sortOptions.map((option, index) => 
				<SortItem 
					isSelected={this.state.selectedOption.object === option.object} 
					name={option.name}  
					handleClick={() => this.handleClick(option)}
				/>
			)
		return(
			<div className='sort-selector'>
				<div className='row'>
					{items}
				</div>
			</div>
		)
	}
}

function SortItem(props){
	const color = props.isSelected ? 'light-green-bc black-c' : 'black-bc white-c'
	return(
		<div className='sort-item col-auto'>
			<button onClick={() => props.handleClick()} className={color}>{props.name}</button>
		</div>
	)
}

export default SortSelector;