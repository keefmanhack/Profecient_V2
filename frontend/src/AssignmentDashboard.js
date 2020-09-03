import React from 'react';

class AssignmentDashboard extends React.Component{
	constructor(props){
		super(props);
	}

	

	render(){
		return(
			<div className='assignment-dashboard sans-font' style={this.props.style}>
				<h1 className='gray-c '>Upcomming</h1>
				<button onClick={() => this.props.showNewAssForm()} className='add green-bc'>Add</button>
				<hr/>
				<Assignment backgroundColor={{backgroundColor:'#FFCECE'}} dueDate='Tomorrow' name='Algebra HW'/>
				<Assignment backgroundColor={{backgroundColor:'#F9E7CD'}} dueDate='Wed.' name='Geometry HW'/>
				<Assignment backgroundColor={{backgroundColor:'#D3E3F6'}} dueDate='Thurs.' name='English Paper'/>
			</div>	
		);
	}
}

class Assignment extends React.Component{
	render(){
		return(
			<div style={this.props.backgroundColor} className='assignment'>
				<div className='row'>
					<div className='col-lg-7'>
						{this.props.name}
					</div>
					<div className='col-lg-3'>
						{this.props.dueDate}
					</div>
					<div className='col-lg-2'>
						<button>...</button>
					</div>
				</div>
			</div>
		);
	}
}

class NewAssignment extends React.Component{
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
            this.props.hideNewAssForm();
        }
    }

	render(){
		const classes = this.props.classes.map((o, index) =>
				<div key={index} className='col-lg-3'>
			       <button 
			       		className='class' 
			       		onClick={() => this.props.handleClassClick(index)} 
			       		key={index}
			       	>
			       			<h5 
			       				className='truncate'
			       			>{o}
			       			</h5>
			       	</button>
			      </div>
			)

		return(
			<div ref={this.wrapperRef} className='new-assignment new-form sans-font'>
				<button onClick={()=> this.props.hideNewAssForm()} id='X'>Cancel</button>
				<div className='row'>
					{classes}
				</div>

				<div className='row'>
					<div className='col'>
						<input placeholder='Assignment Name' className='name' type='text' />
					</div>
				</div>

				<div className='row'>
					<div className='col'>
						<input placeholder='Date due' type='text' />
					</div>
					<div className='col'>
						<input placeholder='Time due' type='text' />
					</div>
				</div>
				<div className='col textarea-col'>
					<textarea placeholder='Description'></textarea>
				</div>
				<button className='submit'>Submit</button>
			</div>
		);
	}
}

class ToDo extends React.Component{
	render(){
		return(
			<div className='to-do'>
				<button>{this.props.text}</button>
			</div>
		);
	}
}

export {NewAssignment};
export default AssignmentDashboard;