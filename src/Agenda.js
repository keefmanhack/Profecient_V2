import React from 'react';

class Agenda extends React.Component{
	constructor(props){
		super(props);
		
		this.times = ['12:00AM', '12:30AM', '1:00AM', '1:30AM', '2:00AM', '2:30AM', '3:00AM', '3:30AM', '4:30AM', '5:00AM', '5:30AM', '6:00AM', '6:30AM', '7:00AM', '7:30AM', '8:00AM', '8:30AM', '9:00AM', '9:30AM', '10:00AM', '10:30AM', '11:00AM', '11:30AM', '12:00PM', '12:30PM', '1:00PM', '1:30PM', '2:00PM', '2:30PM', '3:00PM', '3:30PM', '4:30PM', '5:00PM', '5:30PM', '6:00PM', '6:30PM', '7:00PM', '7:30PM', '8:00PM', '8:30PM', '9:00PM', '9:30PM', '10:00PM', '10:30PM', '11:00PM', '11:30PM' ]
		
		this.itemData = [{
			name: 'Algebra',
			location: 'Zurn 101',
			startTime: '10:00AM',
			endTime: '11:00AM'
		},
		{
			name: 'Geometry',
			location: 'Zurn 101',
			startTime: '1:30PM',
			endTime: '11:00PM'
		}]
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
			/>
		);

		return(
			<div className='background'>
				<h1>Agenda</h1>
				<div className='foreground'>
					{timeHRs}
					{AgendaItems}
				</div>
			</div>
		);
	}

}

function findTopPosition(start){
	const startMT = convertToMilitary(start);

	let time =0;

	let ct = 0;

	while(time !== startMT){
		if((time + '').includes('59')){
			time-= 59;
			time+= 99;
			ct++;
		}else if((time + '').includes('30')){
			ct++;
		}

		time++;
	}

	console.log(ct);

	return ct * 25;


}

function findHeightProportion(start, end){
	const startMT = convertToMilitary(start);
	const endMT = convertToMilitary(end);

	return (endMT - startMT)/100 * 50;
}

function convertToMilitary(stdTime){
	const minute = parseInt(stdTime.substring(stdTime.length-4 ,stdTime.length-2));
	const hour = parseInt(stdTime.substring(0 ,stdTime.length-5));

	if(stdTime.includes('PM')){
		return (hour * 100 + minute) + 1200;
	}else if(stdTime.includes('12')){
		return minute; 
	}else{
		return hour * 100 + minute;
	}
}


function AgendaItem(props){
	return(
		<div style={{height: props.height, top: props.top}} className='item-container'>
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