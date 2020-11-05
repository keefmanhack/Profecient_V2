import React from 'react';
import moment from 'moment';

import Loader from '../Effects/loader';
import {FadeRightHandleState, FadeInOutHandleState} from '../Effects/CustomTransition';
import {SuccessCheck} from '../Effects/lottie/LottieAnimations';

import SemesterRequests from '../../../APIRequests/Semester';
import ClassRequests from '../../../APIRequests/Class';

import './LinkSelector.css';

class LinkSelector extends React.Component{
	constructor(props){
		super(props);

		this.semReq = new SemesterRequests(this.props.currentUser._id);
		this.classReq = new ClassRequests(this.props.currentUser._id);

		this.state={
			currSemester: null,
			selectedIndex: -1,
			success: false,
		}
	}

	componentDidMount(){
		this.getClassData();
	}

	async getClassData(){
		this.setState({currSemester: await this.semReq.getCurrSemWClasses()});
	}

	async addNewLink(){
		await this.classReq.addNewConnection(this.props.otherUserID, this.props.linkClass._id, this.state.currSemester.classes[this.state.selectedIndex]._id, this.props.currentUser._id);
		this.setState({success: true});
	}

	render(){
		const classItems = this.state.currSemester ? this.state.currSemester.classes.map((data, index) => 
			<ClassItem 
				data={data} 
				selected={this.state.selectedIndex>-1 && this.state.selectedIndex===index} 
				classItemClicked={() => this.setState({selectedIndex: index})} key={index}
			/>
		) : null;

		const linkClass= this.props.linkClass;
		const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
		const daySpans = days.map((day, index)=>
				<span style={linkClass.daysOfWeek[index] ? {fontWeight: 800}: {fontWeight: 200}} key={index}> {day} </span>
		);
		const startTime = moment(linkClass.time.start).format('h:mm a');
		const endTime = moment(linkClass.time.end).format('h:mm a');
		return(
			<React.Fragment>
				<div className='background-shader'/>
				<div className='link-selector form-bc sans-font'>
					<FadeInOutHandleState condition={this.state.success}>
		 				<SuccessCheck onCompleted={() =>this.props.hideForm()}/>
		 			</FadeInOutHandleState>
					<button onClick={() => this.props.hideForm()} className='cancel red-c'>Cancel</button>
					<FadeRightHandleState condition={this.state.selectedIndex>-1}>
						<button onClick={() => this.addNewLink()} className='add blue-bc'>Add Link</button>
					</FadeRightHandleState>
					{this.state.currSemester ?
						<React.Fragment>	
							<h1 className='bold-text'>{this.state.currSemester.name}</h1>
							<h5 className='light-text muted-c'>Add new link</h5>
							<hr/>
							<div className='gray-bc link-info'>
								<h2>{linkClass.name}</h2>
								<h3>{linkClass.instructor}</h3>
								<h4>{linkClass.location}</h4>
								<h4 className='indent light-text'>{daySpans}</h4>
								<h4 className='indent light-text'>{startTime} - {endTime}</h4>
							</div>
							<div className='class-items white-bc'>
								{classItems}
							</div>
						</React.Fragment>
					:
						<Loader/>
					}
				</div>
			</React.Fragment>
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
		<div 
			className='class-item' 
			onClick={() => props.classItemClicked()} 
			style={props.selected ? {border: '4px solid #007bff', transition: '.3s'} : null}
		>
			<h2>{props.data.name}</h2>
			<h3>{props.data.instructor}</h3>
			<h4>{props.data.location}</h4>
			<h4 className='indent light-text'>{daySpans}</h4>
			<h4 className='indent light-text'>{startTime} - {endTime}</h4>
		</div>
	)
}

export default LinkSelector;