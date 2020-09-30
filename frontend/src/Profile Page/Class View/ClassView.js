import React from 'react';
import moment from 'moment';

import {FadeDownUpHandleState, FadeInOut, FadeInOutHandleState} from '../../Shared Resources/Effects/CustomTransition';

import './class-view.css';

class ClassView extends React.Component{
	constructor(props){
		super(props);

		this.state={
			showDialog: false,
		}
	}

	showDialog(){
		this.setState({
			showDialog: true,
		})
	}

	hideDialog(){
		this.setState({
			showDialog: false,
		})
	}

	render(){
		let currSem = this.props.currSemExists ? this.props.semesters[this.props.currSemesterIndex] : null;

		const classes =  this.props.currSemExists ? currSem.classes.map((data, index) =>
			<ClassCon
				data={data}
				key={index}
				isCurrentUserViewing={this.props.isCurrentUserViewing}
				currentUser={this.props.currentUser}
				addLink={() => this.props.addLink(data._id)}
				removeLink={() => this.props.removeLink(data._id)}
			/> 
		): null

		return(
			<div className='class-view-container'>
				<div className='semester-container white-c'>
					<div className='sem-title'>
						<h1 className={!this.props.currSemExists ? 'muted-c': null}>
							{this.props.currSemExists ? currSem.name : 'No Semester Exists'}
						</h1>
					</div>
					<FadeInOutHandleState condition={this.props.isCurrentUserViewing || this.props.semesters.length>0}>
						<button className='white-c' onClick={() => this.showDialog()}>...</button>
					</FadeInOutHandleState>
				</div>
				<h5 className='muted-c'>{this.props.currSemExists ? currSem.classes.length + ' Classes' : null}</h5>
				<hr/>
				<div style={{minHeight: 150, maxHeight: 350, overflow: 'scroll'}}>
					{classes}
				</div>
				<FadeInOutHandleState condition={this.state.showDialog}>
					<MenuDropDown hideDropDown={() => this.hideDialog()}>
						<DropDownMain>
							{this.props.isCurrentUserViewing ?
								<button onClick={() => this.props.showNewSem(true)}> 
									<i style={{color: 'lightgreen'}} class="fas fa-plus-circle"></i> New Semester
								</button>
							: null}
							{this.props.semesters.length>0 ?
								<React.Fragment>
									{this.props.isCurrentUserViewing ?
										<React.Fragment>
											<button onClick={() => this.props.editCurrSem()}> 
												<i style={{color: 'orange'}} class="far fa-edit"></i> Edit Current Semester
											</button>
											<button onClick={() => this.props.deleteCurrSem()}> 
												<i style={{color: 'red'}} class="fas fa-trash"></i> Delete Current Semester
											</button>
										</React.Fragment>
									:null}
									<Options 
										text={'Current Semester'} 
										icon={<i class="fas fa-caret-right"></i>} 
										options={this.props.semesters}
										selected={currSem}
										clickEvent={(i) => this.props.changeCurrentSem(i)}
									/>
								</React.Fragment>
							: null}
						</DropDownMain>
					</MenuDropDown>
				</FadeInOutHandleState>
			</div>
		);
	}
}

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
					style={data === this.props.selected ? {fontWeight: 600}: null}
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


class ClassCon extends React.Component{
	constructor(props){
		super(props);

		this.state={
			showAssignment: false,
		}

		this.days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
	}

	toggleShowAssignment(){
		const showAssCopy = this.state.showAssignment;

		this.setState({
			showAssignment: !showAssCopy,
		})
	}


	render(){
		const daySpans = this.days.map((day, index)=>
			<span style={this.props.data.daysOfWeek[index] ? {fontWeight: 800}: {fontWeight: 200}} key={index}> {day} </span>
		);

		const startTime = moment(this.props.data.time.start).format('h:mm a');
		const endTime = moment(this.props.data.time.end).format('h:mm a');

		let connectedTo = false;

		this.props.data.connectionsFrom.forEach(function(connection){
			if(connection.user === this.props.currentUser._id){
				connectedTo = true;
			}
		}.bind(this))

		let linkBtn;

		if(connectedTo){
			linkBtn = <button onClick={() => this.props.removeLink()} className='link orange-bc white-c' >UnLink</button>
		}else{
			linkBtn = <button onClick={() => this.props.addLink()} className='link blue-bc'>Link</button>
		}

		const dropDownDis = this.state.showAssignment ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>;
		return(
			<div className='class-container'>
				{this.props.isCurrentUserViewing ? null :
					<React.Fragment>
					{linkBtn}
					</React.Fragment>
				}
				<h1>{this.props.data.name}</h1>
				<h2>{this.props.data.instructor}</h2>
				<h3>{this.props.data.location}</h3>
				<h4 style={{marginBottom: 0}}>{daySpans}</h4>
				<h4>{startTime} - {endTime}</h4>
				<button className='see-assign' onClick={() => this.toggleShowAssignment()}>
					{dropDownDis} {this.state.showAssignment ? 'Close' : 'See'} Assignments 
				</button>
				<div style={{position: 'relative'}}>
					<FadeDownUpHandleState condition={this.state.showAssignment}>
						<AssignContainer assignments={this.props.data.assignments}/>
					</FadeDownUpHandleState>
				</div>
			</div>
		);
	}
}

function AssignContainer(props){
	const upComAssign = props.assignments.map((data, index) =>
		data.completed ? null : 
			<Assign
				name={data.name}
				dueDate={data.dueDate}
				description={data.description}
				style={{background: findColor(data.dueDate)}}
			/>
	);

	const compAssign = props.assignments.map((data, index) =>
		data.completed ? 
			<Assign
				name={data.name}
				dueDate={data.dueDate}
				description={data.description}
				key={index}
				style={{background: 'rgb(211, 227, 246)'}}
			/>
		: null
	);

	return(
		<div className='assign-container'>
			<h5>Upcomming</h5>
			<hr/>
			{upComAssign}
			<h5 style={{marginTop: 10}}>Completed</h5>
			<hr/>
			{compAssign}
		</div>
	);
}

function Assign(props){

	return(
		<div style={props.style} className='assign'>
			<h1>{props.name}</h1>
			<h2>{moment(props.dueDate).format('LL')}</h2>
			
			<p>{props.description}</p>
		</div>
	);
}


function findColor(date){
	const today = moment();
	const dueDate = moment(date);
	const dayDiff = today.diff(dueDate, 'days');

	// if(today.getFullYear() === dueDate.getFullYear()){
	// 	if(today.getMonth() === dueDate.getMonth()){
	// 		if(today.getDate()-dueDate.getDate() === 0){
	// 			return 'rgb(255, 206, 206)'; //red
	// 		}else if(today.getDate()-dueDate.getDate() < 7){
	// 			return 'rgb(249, 231, 205)'; //orange
	// 		}
	// 	}
	// }

	console.log(dayDiff);
	if(dayDiff === 0){
		return 'rgb(255, 206, 206)'; //red
	}else if(dayDiff <7){
		return 'rgb(249, 231, 205)'; //orange
	}

	return 'rgb(210, 244, 219)'; //green
}

export {MenuDropDown};
export{DropDownMain};
export default ClassView;