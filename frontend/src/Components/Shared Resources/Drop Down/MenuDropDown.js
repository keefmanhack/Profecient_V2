import React from 'react';

import {FadeInOut} from '../Effects/CustomTransition';

import './index.css';

class MenuDropDown extends React.Component{
	constructor(props){
		super(props);

		this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.props.hideDropDown();
        }
    }

	render(){
		return(
			<div ref={this.wrapperRef} className='drop-down-con'>
				{this.props.children}
			</div>
		);
	}
}

class DropDownMain extends React.Component{
	render(){
		return(
			<div className='main'>
				{this.props.children}
			</div>
		);
	}
}

function Divider(props){
	return <hr/>
}

class Options extends React.Component{
	constructor(props){
		super(props);

		this.state={
			showOptions: false,
		}
	}

	showOptions(){
		this.setState({
			showOptions: true,
		})
	}

	hideOptions(){
		this.setState({
			showOptions: false,
		})
	}

	render(){
		let options;
		if(this.state.showOptions){
			options = this.props.options.map((data, index) =>
				<button 
					onClick={() => this.props.clickEvent(index)}
					style={data._id === this.props.selectedID ? {fontWeight: 600}: null}
					key={index}
				>{data.name}</button>
			);
		}
		return(
			<div className='option' onMouseEnter={() => this.showOptions()} onMouseLeave={() => this.hideOptions()}>
				<button >{this.props.text} {this.props.icon}</button>
				<FadeInOut condition={this.state.showOptions}>
					<div className='perif'>
						{options}
					</div>
				</FadeInOut>
			</div>
		);
	}
}

function Item(props){
	return (<div className='item'>{props.children}</div>)
}

export default MenuDropDown;
export {DropDownMain, Options, Divider, Item};