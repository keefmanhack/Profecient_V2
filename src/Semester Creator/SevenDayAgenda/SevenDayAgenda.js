import React from 'react';
import {convertToAgendaFormat} from './helperFunc';
import {findProportionalTimeDif} from '../StartEndTimeComp/helperFunc';

class SevenDayAgenda extends React.Component{

	render(){
		const agendaData = convertToAgendaFormat(this.props.data);
		const heightOfTable = 588;

		const agenda = agendaData.map((data, index) =>
			<AgendaRow 
				key={index} 
				row={data.weekArr}
				time={data.time}
				evItClick={(i) => this.props.evItClick(i)}
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
							<th></th>
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
		<AgendaData evItClick={(i) => props.evItClick(i)} time={props.time} key={index} tableData={tableData}/>
	)

	return(
		<tr>
			{agendaData}
			<td className='time-td'><p>{props.time}</p></td>
		</tr>
	)
}

function AgendaData(props){
	const dis = props.tableData.map((data, index) =>
		<EventItem evItClick={(i) => props.evItClick(i)} i={index} time={props.time} data={data} key={index}/>
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
		<div onClick={(i) => props.evItClick(props.i)} className='event-item' style={{position: 'absolute', top: topDis, height: height}}>
			<h5>{props.data.name}</h5>
		</div>
	)
}

export default SevenDayAgenda;