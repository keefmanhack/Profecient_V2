import React from 'react';
import {convertToAgendaFormat} from './helperFunc';
import {findProportionalTimeDif} from '../StartEndTimeComp/helperFunc';

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

export default SevenDayAgenda;