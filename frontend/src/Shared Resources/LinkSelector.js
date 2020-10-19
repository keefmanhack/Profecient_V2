import React from 'react';
import moment from 'moment';

import Loader from '../Effects/loader';

import SemesterRequests from '../APIRequests/Semester';
import ClassRequests from '../APIRequests/Class';

import './LinkSelector.css';

class LinkSelector extends React.Component{
	constructor(props){
		super(props);

		this.semReq = new SemesterRequests(this.props.currentUser._id);
		this.classReq = new ClassRequests(this.props.currentUser._id);

		this.state={
			currSemester: null,
		}
	}

	componentDidMount(){
		this.getClassData();
	}

	async getClassData(){
		this.setState({currSemester: await this.semReq.getCurrSemWClasses()});
	}

	async classSelected(i){
		const data = await this.classReq.addNewConnection(this.props.otherUserID, this.props.linkClass._id, this.state.currSemester.classes[i]._id);
	}

	render(){
		const classItems = this.state.currSemester ? this.state.currSemester.classes.map((data, index) => 
			<ClassItem data={data} classItemClicked={() => this.classSelected(index)} key={index}/>
		) : null;

		const linkClass= this.props.linkClass;
		const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
		const daySpans = days.map((day, index)=>
				<span style={linkClass.daysOfWeek[index] ? {fontWeight: 800}: {fontWeight: 200}} key={index}> {day} </span>
		);
		const startTime = moment(linkClass.time.start).format('h:mm a');
		const endTime = moment(linkClass.time.end).format('h:mm a');
		return(
			<div className='link-selector'>
				<button>Cancel</button>
				{this.state.currSemester ?
					<React.Fragment>	
						<h1>Add Link to your</h1>
						<h1>{this.state.currSemester.name}</h1>
						<h1>Semester</h1>
						<div>
							<div className='row'>
								<div className='col-lg-10'>
									<h1>{linkClass.name}</h1>
									<h3>{linkClass.instructor}</h3>
									<h4>{linkClass.location}</h4>
									<h4>{daySpans}</h4>
									<h4>{startTime} - {endTime}</h4>
								</div>
							</div>
						</div>
						<div>
							{classItems}
						</div>
					</React.Fragment>
				:
					<Loader/>
				}
			</div>
		);
	}
}

function ClassItem(props){
	const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
	const daySpans = days.map((day, index)=>
			<span style={props.data.daysOfWeek[index] ? {fontWeight: 800}: {fontWeight: 200}} key={index}> {day} </span>
	);
	const startTime = moment(props.data.time.start).format('h:mm a');
	const endTime = moment(props.data.time.end).format('h:mm a');
	return(
		<div className='class-item'>
			<div className='row'>
				<div className='col-lg-10'>
					<h1>{props.data.name}</h1>
					<h3>{props.data.instructor}</h3>
					<h4>{props.data.location}</h4>
					<h4>{daySpans}</h4>
					<h4>{startTime} - {endTime}</h4>
				</div>
				<div className='col-lg-2'>
					<button onClick={() => props.classItemClicked()} className='link'>Link</button>
				</div>
			</div>
			

		</div>
	)
}

export default LinkSelector;