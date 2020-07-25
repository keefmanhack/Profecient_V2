import React from 'react';
import StartEndTime from './StartEndTimeComp/StartEndTime';
import {FlipInOut} from './CustomTransition';
import {TimeHR}  from './StartEndTimeComp/StartEndTime';
import {convertToMilitary} from './Agenda_Helper';
import {findProportionalTimeDif, convertToStandardNum, increment, findIncrementVal, decrement, roundTimeDown} from './StartEndTimeComp/helperFunc';

class SemesterCreator extends React.Component{
	render(){
		return(
			<div className='semester-creator-container'>
				<div className='row'>
					<div className='col-lg-6'>
						<div className='class-item-container'>
							<ClassItem/>
							<ClassItem/>
							<ClassItem/>
							<ClassItem/>	
						</div>

						<hr/>
						<div className='row'>
							<div className='col-lg-6'>
								<div className='class-editor'>
									<input className='class-name' type="text" placeholder='Class Name'/>
									<div className='row instruct-loc'>
										<div className='col-lg-6'>
											<input type="text" placeholder='Instructor'/>
										</div>
										<div className='col-lg-6'>
											<input type="text" placeholder='Location'/>
										</div>
									</div>

									<div className='day-buttons'>
										<button>M</button>
										<button>T</button>
										<button>W</button>
										<button>T</button>
										<button>F</button>
										<button>S</button>
										<button>S</button>
									</div>

									<div className='row start-end-date'>
										<div className='col-lg-6'>
											<input type="text" placeholder='Start Date'/>
										</div>
										<div className='col-lg-6'>
											<input type="text" placeholder='End Date'/>
										</div>
									</div>

									<StartEndTime/>
									
								</div>
							</div>
							<div className='col-lg-6'>
								<SuggestedLinksContainer/>
							</div>
						</div>
						
						
					</div>
					<div className='col-lg-6'>
						<SevenDayAgenda/>
					</div>
				</div>
			</div>
		);
	}
}

class SevenDayAgenda extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			testData: [
				{
					name: 'Algebra 1',
					time: {
						start: '8:15AM',
						end: '9:00AM'
					},
					daysOfWeek: {
						monday: false,
						tuesday: false,
						wednesday: true,
						thursday: false,
						friday: false,
						saturday: false,
						sunday: false,
					}
				},
				{
					name: 'Geometry',
					time: {
						start: '1:00PM',
						end: '9:00PM'
					},
					daysOfWeek: {
						monday: true,
						tuesday: false,
						wednesday: true,
						thursday: false,
						friday: true,
						saturday: false,
						sunday: false,
					}
				},
				{
					name: 'Philosphy of the sciences',
					time: {
						start: '9:00AM',
						end: '11:00AM'
					},
					daysOfWeek: {
						monday: false,
						tuesday: true,
						wednesday: true,
						thursday: true,
						friday: false,
						saturday: false,
						sunday: false,
					}
				}
			]
		}
	}

	render(){
		const agendaData = convertToAgendaFormat(this.state.testData);
		const heightOfTable = 588;

		const agenda = agendaData.map((data, index) =>
			<AgendaRow 
				key={index} 
				row={data.weekArr}
				time={data.time}
			/>
		);
		
		return(
			<div className='seven-day-agenda'>
				<table>
					<thead>
						<tr>
							<th>Mon.</th>
							<th>Tue.</th>
							<th>Wed.</th>
							<th>Thu.</th>
							<th>Fri.</th>
							<th>Sat.</th>
							<th>Sun.</th>
						</tr>
					</thead>
					<tbody>
						{agenda}
					</tbody>
				</table>
			</div>
		);
	}
}

function AgendaRow(props){
	const agendaData = props.row.map((tableData, index)=>
		<AgendaData time={props.time} key={index} tableData={tableData}/>
	)

	return(
		<tr>
			{agendaData}
			<h5 className='time'>{props.time}</h5>
		</tr>
	)
}

function AgendaData(props){
	const dis = props.tableData.map((data, index) =>
		<EventItem time={props.time} data={data} key={index}/>
	)
	return(
		<td>
			{dis}
		</td>
	)
}

function EventItem(props){
	const tdHeight = 40;
	const topDis = tdHeight * findProportionalTimeDif(props.time, props.data.time.start)/50;
	const height = tdHeight * findProportionalTimeDif(props.data.time.start, props.data.time.end)/50;

	return(
		<div className='event-item' style={{position: 'absolute', top: topDis, height: height}}>
			<h5>{props.data.name}</h5>
		</div>
	)
}

function convertToAgendaFormat(data){
	const sortedData = sortByStartTime(data);
	
	const incCt =4;
	const intervalDivider = 50;


	const firstEvent = decrement(5,roundTimeDown(sortedData[0].time.start), true);
	const lastEvent = increment(5,roundTimeDown(sortedData[sortedData.length-1].time.end), true);
	const timeDif = findProportionalTimeDif(firstEvent, lastEvent );
	const intervals = Math.ceil(timeDif/intervalDivider) + 1;
	const firstEvent_stdNum = convertToStandardNum(convertToMilitary(firstEvent));

	let arr = []
	
	let timeInc = firstEvent;
	for(let i =0; i < intervals; i++){
		const currentTimeInt = [intervalDivider * i + firstEvent_stdNum, intervalDivider * (i+1) + firstEvent_stdNum-1];

		let weekArr = []
			for(let day in sortedData[0].daysOfWeek){
				let dayArr = [];
				sortedData.forEach(function(o){
					const timeEvent_stdNum = convertToStandardNum(convertToMilitary(o.time.start));
					if(currentTimeInt[0] <= timeEvent_stdNum && timeEvent_stdNum <= currentTimeInt[1] && o.daysOfWeek[day]){
						dayArr.push(o);
					}
				})
				weekArr.push(dayArr);
			}
		arr.push({time: timeInc, weekArr: weekArr});
		timeInc = increment(incCt, timeInc, true);
	}

	return arr;
}

function sortByStartTime(arr){
	let sortedArr = arr;

	for(let i =0; i <sortedArr.length; i++){
		const timeVal = convertToMilitary(sortedArr[i].time.start);

		for(let j =0; j< sortedArr.length; j++){
			const relTimeVal = convertToMilitary(sortedArr[j].time.start);

			if(timeVal < relTimeVal){
				const temp = sortedArr[i];
				sortedArr[i] = sortedArr[j];
				sortedArr[j] = temp;
			}
		}
	}
	return sortedArr;

}

class SuggestedLinksContainer extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			testData: [
				{
					name: 'Algebra 1',
					links: 25,
					user: {
						name: 'Sarah Steel',
						image: './generic_person.jpg',
						links: 500,
					},
					location: 'Zurn 101',
					instructor: 'Dr. Lee',
					weekDays: {
						monday: false,
						tuesday: false,
						wednesday: false,
						thursday: false,
						friday: false,
						saturday: false,
						sunday: false,
					},
				},
				{
					name: 'Algebra 1',
					links: 25,
					user: {
						name: 'Sarah Steel',
						image: './generic_person.jpg',
						links: 500,
					},
					location: 'Zurn 101',
					instructor: 'Dr. Lee',
					weekDays: {
						monday: false,
						tuesday: false,
						wednesday: false,
						thursday: false,
						friday: false,
						saturday: false,
						sunday: false,
					},
				},
				{
					name: 'Algebra 1',
					links: 25,
					user: {
						name: 'Sarah Steel',
						image: './generic_person.jpg',
						links: 500,
					},
					location: 'Zurn 101',
					instructor: 'Dr. Lee',
					weekDays: {
						monday: false,
						tuesday: false,
						wednesday: false,
						thursday: false,
						friday: false,
						saturday: false,
						sunday: false,
					},
				}
			]
		}
	}

	render(){
		const links = this.state.testData.map((data, index) =>
			<Link data={data} key={index}/>
		)
		return(
			<div className='suggested-links'>
				{links}
			</div>
		)
	}
}

class Link extends React.Component{
	constructor(props){
		super(props);

		this.state={
			isExpanded: false,
		}
	}

	toggleExpanded(){
		const isExpandedCopy = this.state.isExpanded;

		this.setState({
			isExpanded: ! isExpandedCopy
		})
	}

	render(){
		const display = this.state.isExpanded ? <ExpandedLink data={this.props.data} toggleExpanded={() => this.toggleExpanded()}/> : <ShortLink data={this.props.data} toggleExpanded={() => this.toggleExpanded()}/>
		return(
			<React.Fragment>
				<FlipInOut condition={this.state.isExpanded}>
					{display}
				</FlipInOut>
			</React.Fragment>
		);
	}
}

function ExpandedLink(props){
	return(
		<div className='link'>
			<h1>{props.data.name}</h1>
			<h5>{props.data.links} Links</h5>
			<h2>{props.data.location}</h2>
			<h3>{props.data.instructor}</h3>
			<div className='week-days'>
				<span className={props.data.weekDays.monday ? 'active' : null}>M</span>
				<span className={props.data.weekDays.tuesday ? 'active' : null}>T</span>
				<span className={props.data.weekDays.wednesday ? 'active' : null}>W</span>
				<span className={props.data.weekDays.thursday ? 'active' : null}>T</span>
				<span className={props.data.weekDays.friday ? 'active' : null}>F</span>
				<span className={props.data.weekDays.saturday ? 'active' : null}>S</span>
				<span className={props.data.weekDays.sunday ? 'active' : null}>S</span>
			</div>
			<div className='user'>
				<img src={props.data.user.image} alt=""/>
				<a href=''>{props.data.user.name}</a>
				<h5>{props.data.user.links} Classmates Link to this Profile</h5>
			</div>
			<button><i class="fas fa-plus-square"></i> Link</button>
			<button onClick={() => props.toggleExpanded()} className='drop-down'><i class="fas fa-caret-down"></i></button>
		</div>
	)
}

function ShortLink(props){
	return(
		<div className='short-link link'>
			<div className='row'>
				<div className='col-lg-8'>
					<h1>{props.data.name}</h1>
					<h5>{props.data.links} Links</h5>
					<a href=''>{props.data.user.name}</a>
				</div>
				<div className='col-lg-4'>
					<button><i class="fas fa-plus-square"></i> Link</button>
				</div>
			</div>
			<button onClick={() => props.toggleExpanded()} className='drop-down'><i class="fas fa-caret-up"></i></button>
		</div>
	);
}

function ClassItem(props){
	return(
		<div className='class-item'>
			<div className='row'>
				<div className='col-lg-3'>
					<h1>Algebra</h1>
				</div>
				<div className='col-lg-3'>
					<h2>Dr. Lee</h2>
				</div>
				<div className='col-lg-4'>
					<h3>M T W Th F S S</h3>
				</div>
				<div className='col-lg-2'>
					
				</div>
			</div>
			<button><i class="fas fa-trash"></i></button>
		</div>
	)
}

export default SemesterCreator;