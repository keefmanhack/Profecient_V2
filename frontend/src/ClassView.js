import React from 'react';
import moment from 'moment';

import {FadeDownUp_HandleState, FadeInOut, FadeInOut_HandleState} from './CustomTransition';

class ClassView extends React.Component{
	constructor(props){
		super(props);

		this.state={
			testData: {
				name: 'Freshman 1st Semester',
				showDialog: false,
				classes: [
					{
						name: 'Algebra',
						instructor: 'Dr. Lee',
						location: 'Zurn 101',
						startTime: '10:15AM',
						endTime: '11:05AM',
						assignments: [
							{
								name: 'Hw1',
								dueDate: new Date(2020, 5, 10),
								description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint cum iure, velit soluta. Sapiente sint unde quasi sequi reiciendis, eaque molestias, similique saepe doloribus consequatur, ratione doloremque odio rerum tempora!',
								completed: false,
							},
							{
								name: 'Hw1',
								dueDate: new Date(),
								description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint cum iure, velit soluta. Sapiente sint unde quasi sequi reiciendis, eaque molestias, similique saepe doloribus consequatur, ratione doloremque odio rerum tempora!',
								completed: true,
							}
						]
					},
					{
						name: 'Algebra',
						instructor: 'Dr. Lee',
						location: 'Zurn 101',
						startTime: '10:15AM',
						endTime: '11:05AM',
						assignments: [
							{
								name: 'Hw1',
								dueDate: new Date(),
								description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint cum iure, velit soluta. Sapiente sint unde quasi sequi reiciendis, eaque molestias, similique saepe doloribus consequatur, ratione doloremque odio rerum tempora!',
								completed: false,
							},
							{
								name: 'Hw1',
								dueDate: new Date(),
								description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint cum iure, velit soluta. Sapiente sint unde quasi sequi reiciendis, eaque molestias, similique saepe doloribus consequatur, ratione doloremque odio rerum tempora!',
								completed: true,
							}
						]
					}
				]
			}
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
				name={data.name}
				instructor={data.instructor}
				location={data.location}
				days={data.daysOfWeek}
				startTime={moment(data.time.start).format('h:mm a')}
				endTime={moment(data.time.end).format('h:mm a')}
				assignments={data.assignments}
				key={index}
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
					<button className='white-c' onClick={() => this.showDialog()}>...</button>
				</div>
				<h5 className='muted-c'>{this.props.currSemExists ? currSem.classes.length + ' Classes' : null}</h5>
				<hr/>
				<div style={{minHeight: 150, maxHeight: 250, overflow: 'scroll'}}>
					{classes}
				</div>
				<FadeInOut_HandleState condition={this.state.showDialog}>
					<MenuDropDown hideDropDown={() => this.hideDialog()}>
						<DropDownMain>
							<button onClick={() => this.props.showNewSem(true)}> 
								<i style={{color: 'lightgreen'}} class="fas fa-plus-circle"></i> New Semester
							</button>
							{this.props.semesters.length>0 ?
								<React.Fragment>
									<button onClick={() => this.props.editCurrSem()}> 
										<i style={{color: 'orange'}} class="far fa-edit"></i> Edit Current Semester
									</button>
									<button onClick={() => this.props.deleteCurrSem()}> 
										<i style={{color: 'red'}} class="fas fa-trash"></i> Delete Current Semester
									</button>
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
				</FadeInOut_HandleState>
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

		this.days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
	}

	toggleShowAssignment(){
		const showAssCopy = this.state.showAssignment;

		this.setState({
			showAssignment: !showAssCopy,
		})
	}

	render(){
		const daySpans = this.days.map((day, index)=>
			<span style={this.props.days[index] ? {fontWeight: 800}: {fontWeight: 200}} key={index}> {day} </span>
		);

		const dropDownDis = this.state.showAssignment ? <i class="fas fa-chevron-up"></i> : <i class="fas fa-chevron-down"></i>;
		return(
			<div className='class-container'>
				<button className='link' >Link</button>
				<h1>{this.props.name}</h1>
				<h2>{this.props.instructor}</h2>
				<h3>{this.props.location}</h3>
				<h4 style={{marginBottom: 0}}>{daySpans}</h4>
				<h4>{this.props.startTime} - {this.props.endTime}</h4>
				<button className='see-assign' onClick={() => this.toggleShowAssignment()}>
					{dropDownDis} {this.state.showAssignment ? 'Close' : 'See'} Assignments 
				</button>
				<div style={{position: 'relative'}}>
					<FadeDownUp_HandleState condition={this.state.showAssignment}>
						<AssignContainer assignments={this.props.assignments}/>
					</FadeDownUp_HandleState>
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
			<h2>{dueDateString(props.dueDate)}</h2>
			<button>...</button>
			<p>{props.description}</p>
		</div>
	);
}

function dueDateString(dueDate){
	const today = new Date();

	if(today.getFullYear() === dueDate.getFullYear()){
		if(today.getMonth() === dueDate.getMonth()){
			if(today.getDate()-dueDate.getDate() === 0){
				return 'Today';
			}else if(today.getDate()-dueDate.getDate() === 1){
				return 'Tomorrow';
			}else if(today.getDate()-dueDate.getDate() < 7){
				return today.getDate()-dueDate.getDate() + 'days';
			}
		}
	}

	return dueDate.toDateString();
}

function findColor(dueDate){
	const today = new Date();

	if(today.getFullYear() === dueDate.getFullYear()){
		if(today.getMonth() === dueDate.getMonth()){
			if(today.getDate()-dueDate.getDate() === 0){
				return 'rgb(255, 206, 206)'; //red
			}else if(today.getDate()-dueDate.getDate() < 7){
				return 'rgb(249, 231, 205)'; //orange
			}
		}
	}
	return 'rgb(210, 244, 219)'; //green
}

export {MenuDropDown};
export{DropDownMain};
export default ClassView;