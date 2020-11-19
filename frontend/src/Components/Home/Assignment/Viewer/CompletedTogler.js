import React from 'react';

import Toggler from '../../../Shared Resources/Toggler/toggler';

class CompletedTogler extends React.Component{
	constructor(props){
		super(props);
		this.initialState=true;
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