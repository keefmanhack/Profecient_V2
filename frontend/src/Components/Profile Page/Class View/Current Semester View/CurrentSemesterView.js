import React from 'react';

function CurrentSemesterView(props){
	console.log(props.sem);
	return(
		<div className='semester-container white-c'>
			{!props.sem ? 
				<NoSemester/>
			:
				<Semester name={props.sem.name} classesLength={props.sem.classes.length}/>
			}
		</div>
	)
}

function Semester(props){
	return(
		<BaseSemester
			semHeader={<h1>{props.name}</h1>}
			classText={props.classesLength + ' Classes'}
		/>
	)
}

function NoSemester(props){
	return(
		<BaseSemester
			semHeader={<h1 className='muted-c'>No Semester Exists</h1>}
		/>
	)
}

function BaseSemester(props){
	return(
		<div className='sem-title'>
			{props.semHeader}
			<h5 className='muted-c'>{props.classText}</h5>
		</div>
	)
}

export default CurrentSemesterView;