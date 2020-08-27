import React from 'react';
import {findTopPosition, findHeightProportion} from './Agenda_Helper'

class Agenda extends React.Component{
	constructor(props){
		super(props);
		
		this.times = ['12:00AM', '12:30AM', '1:00AM', '1:30AM', '2:00AM', '2:30AM', '3:00AM', '3:30AM', '4:00AM', '4:30AM', '5:00AM', '5:30AM', '6:00AM', '6:30AM', '7:00AM', '7:30AM', '8:00AM', '8:30AM', '9:00AM', '9:30AM', '10:00AM', '10:30AM', '11:00AM', '11:30AM', '12:00PM', '12:30PM', '1:00PM', '1:30PM', '2:00PM', '2:30PM', '3:00PM', '3:30PM', '4:00PM', '4:30PM', '5:00PM', '5:30PM', '6:00PM', '6:30PM', '7:00PM', '7:30PM', '8:00PM', '8:30PM', '9:00PM', '9:30PM', '10:00PM', '10:30PM', '11:00PM', '11:30PM' ]
		
		this.itemData = [{
			name: 'Algebra',
			location: 'Zurn 101',
			startTime: '12:00PM',
			endTime: '9:00PM'
		},
		{
			name: 'Geometry',
			location: 'Zurn 101',
			startTime: '1:30PM',
			endTime: '11:00PM'
		}
		]
	}
	
	render(){
		const timeHRs = this.times.map((time, index) =>
			<TimeHR time={time} spacing={index*25} key={index}/>
		);

		const AgendaItems = this.itemData.map((data, index) =>
			<AgendaItem 
				key={index}
				height={findHeightProportion(data.startTime, data.endTime)} 
				top={findTopPosition(data.startTime)} 
				name={data.name} 
				location={data.location}
				zIndex={index}
			/>
		);

		return(
			<div className='agenda sans-font' style={{position: 'relative'}}>
				<h1 className=' gray-c'>Agenda</h1>
				<button className='add green-bc'>Add</button>
				<div className='foreground'>
					{timeHRs}
					{AgendaItems}
				</div>
			</div>
		);
	}

}


function AgendaItem(props){
	return(
		<div style={{height: props.height, top: props.top, zIndex: props.zIndex}} className='item-container'>
			<h2>{props.name}</h2>
			<h3>{props.location}</h3>
		</div>
	);
}

function TimeHR(props){

	const hrStyle= !props.time.includes('3') ? {borderTopWidth: 2} : null;

	return(
		<div style={{top: props.spacing}} className='time-hr'>
			<hr style={hrStyle}/>
			<h5>{props.time}</h5>
		</div>
	);
}

export default Agenda;