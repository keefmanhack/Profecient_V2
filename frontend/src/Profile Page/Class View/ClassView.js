import React, {useState, useEffect} from 'react';
import moment from 'moment';

import LinkSelector from '../../Shared Resources/Link Selector/LinkSelector';
import {FadeDownUpHandleState, FadeInOutHandleState} from '../../Shared Resources/Effects/CustomTransition';
import MenuDropDown, {DropDownMain, Options} from '../../Shared Resources/MenuDropDown';
import Loader from '../../Shared Resources/Effects/loader';

import SemesterRequests from '../../APIRequests/Semester';
import ClassRequests from '../../APIRequests/Class';

import './class-view.css';

function ClassView(props){
	const semReq = new SemesterRequests(props.otherUserID);
	const classReq = new ClassRequests(props.otherUserID);

	const [semesters, setSemesters] = useState(null);
	const [classes, setClasses] = useState(null);
	const [currSemesterID, setCurrSemesterID] = useState(null);
	// const [linkID, setLinkID] = useState(null);
	const [showDialog, setShowDialog] = useState(false);
	const [showNewSemForm, setShowNewSemForm] = useState(false);

	useEffect(() => {
		const getSemesters = async () => {
			const data = await semReq.getAllSems();	
			setSemesters(data);
			setCurrSemesterID(data[data.length-1]._id)
		}
		getSemesters();
	}, [])

	useEffect(() => {
		const getClasses = async () => {
			setClasses(await semReq.getClasses(currSemesterID));
		}
		if(currSemesterID!==null) getClasses();
	}, [currSemesterID])

	const currSem = currSemesterID ? findSem(semesters, currSemesterID) : null;
	const classContainers =  classes ? classes.map((data, index) =>
		<ClassCon
			data={data}
			key={index}
			isCurrentUserViewing={props.isCurrentUserViewing}
			currentUser={props.currentUser}
			otherUserID={props.otherUserID}
			classReq={classReq}
		/> 
	): null

	return(
		<div className='class-view-container'>
			<div className='semester-container white-c'>
				{semesters ?
					<React.Fragment>
						<div className='sem-title'>
							<h1 className={!currSemesterID ? 'muted-c': null}>
								{currSemesterID ? currSem.name : 'No Semester Exists'}
							</h1>
						</div>
						<FadeInOutHandleState condition={props.isCurrentUserViewing || semesters.length>0}>
							<button className='white-c' onClick={() => setShowDialog(true)}>...</button>
						</FadeInOutHandleState>
					</React.Fragment>
				: 
					<Loader/>
				}
			</div>
			<h5 className='muted-c'>{classes ? classes.length + ' Classes' : null}</h5>
			<hr/>
			<div style={{minHeight: 150, maxHeight: 350, overflow: 'scroll', position: 'relative', borderRadius: 5}}>
				{classes ? classContainers: <Loader/>}
			</div>
			<FadeInOutHandleState condition={showDialog}>
				<MenuDropDown hideDropDown={() => setShowDialog(false)}>
					<DropDownMain>
						{props.isCurrentUserViewing ?
							<button onClick={() => setShowNewSemForm(true)}> 
								<i style={{color: 'lightgreen'}} class="fas fa-plus-circle"></i> New Semester
							</button>
						: null}
						{semesters && semesters.length>0 ?
							<React.Fragment>
								{props.isCurrentUserViewing ?
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
									options={semesters}
									selected={currSem}
									clickEvent={(i) => setCurrSemesterID(semesters[i]._id)}
								/>
							</React.Fragment>
						: null}
					</DropDownMain>
				</MenuDropDown>
			</FadeInOutHandleState>
		</div>
	);
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
			showLinkSelector: false,
			linkAddedSuccess: false
		})
	}

	addNewLink(data){
		console.log(data);
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
			linkBtn = <button onClick={() => this.setState({showLinkSelector: true})} className='link blue-bc'>Link</button>
		}

		const dropDownDis = this.state.showAssignment ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>;
		return(
			<div className='class-container'>
				<FadeInOutHandleState condition={this.state.showLinkSelector}>
					<LinkSelector
						otherUserID={this.props.otherUserID}
						linkClass={this.props.data}
						currentUser={this.props.currentUser}
						addNewLink={(data) => this.addNewLink(data)}
						success={this.state.linkAddedSuccess}
						hideForm={() => this.setState({showLinkSelector: false})}
					/>
				</FadeInOutHandleState>
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
						<AssignContainer classID={this.props.data._id} classReq={this.props.classReq}/>
					</FadeDownUpHandleState>
				</div>
			</div>
		);
	}
}

function AssignContainer(props){
	const [assignments, setAssignments] = useState(null);

	useEffect(() => {
		const getAssignments = async () => {
			setAssignments(await props.classReq.getAssignments(props.classID));
		}
		getAssignments();
	}, [])

	const upComAssign = assignments ? assignments.map((data, index) =>
		data.completed ? null : 
			<Assign
				name={data.name}
				dueDate={data.dueDate}
				description={data.description}
				style={{background: findColor(data.dueDate)}}
			/>
	) : null;

	const compAssign = assignments ? assignments.map((data, index) =>
		data.completed ? 
			<Assign
				name={data.name}
				dueDate={data.dueDate}
				description={data.description}
				key={index}
				style={{background: 'rgb(211, 227, 246)'}}
			/>
		: null
	): null;

	return(
		<div className='assign-container'>
			<h5>Upcomming</h5>
			<hr/>
			{assignments ? upComAssign : <Loader/>}
			<h5 style={{marginTop: 10}}>Completed</h5>
			<hr/>
			{assignments ? compAssign : <Loader/>}
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

function findSem(allSems, selectedID){
	for(let i =0; i<allSems.length; i++){
		if(allSems[i]._id === selectedID){
			return allSems[i];
		}
	}
}

function findColor(date){
	const today = moment();
	const dueDate = moment(date);
	const dayDiff = today.diff(dueDate, 'days');

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