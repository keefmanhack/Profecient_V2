import React from 'react';

import Toggler from '../../../Shared Resources/Toggler/toggler';

const initialState = false;
class CompletedTogler extends React.Component{
	constructor(props){
		super(props);
		this.initialState=initialState;
	}

	static getInitial(){
		return initialState;
	}

	render(){
		return(
			<Toggler
				name={'Completed'}
				toggled={(state) => this.props.toggled(state)}
				defaultToggle={this.initialState}
			/>
		)
	}
}

export default CompletedTogler;