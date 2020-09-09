import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {SuccessCheck} from './lottie/LottieAnimations';

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
			<div style={this.props.backgroundColor} className='assignment sans-font'>
				<div className='row'>
					<div className='col-lg-7 truncate'>
						<h1>{this.props.name}</h1>
					</div>
					<div className='col-lg-3 truncate'>
						<h2>{this.props.dueDate}</h2>
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

		this.state = {
			date: new Date(),
		}

		this.wrapperRef = React.createRef();
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.name = React.createRef();
		this.dueTime = React.createRef();
		this.description = React.createRef();
	}

	componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target) && !this.dueTime.current.contains(event.target)) {
            this.props.hideNewAssForm();
        }
    }

    dateChanged(date){
		this.setState({
			date: date
		})
	}

	render(){
		const classes = this.props.classes.map((o, index) =>
			<div key={index} className='col-lg-3'>
		       <button 
		       		className={this.props.selectedIndex===index ? 'class green-bc' : 'class off-blue-bc'} 
		       		onClick={() => this.props.handleClassClick(index)} 
		       		key={index}
		       	>
	       			<h5 
	       				className='truncate'
	       			>{o.name}
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
						<input ref={this.name} placeholder='Assignment Name' className='name' type='text' />
					</div>
				</div>

				<div className='row'>
					<div className='col'>
						<DatePicker
				        	selected={this.state.date}
				        	onChange={(date) => this.dateChanged(date)}
				      	/>
					</div>
					<div className='col'>
						
					</div>
				</div>
				<div className='col textarea-col'>
					<textarea ref={this.description} placeholder='Description'></textarea>
				</div>
				<button className='submit blue-bc'>Submit</button>
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