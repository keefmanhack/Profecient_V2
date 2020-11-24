import React from 'react';

function CurrentSemesterView(props){
	const semReq = new SemesterRequests(props.currentUserID);
	const [isLoading, setIsLoading] = useState(true);
	const [sem, setSem] = useState(null);
	const [errMsg, setErrMsg] = useState('');

	useEffect(() => {
		getCurrentSem();
	}, []);

	const getCurrentSem = async () => {
		setIsLoading(true)
		const res = await semReq.getCurrentSem();
		setIsLoading(false);
		if(res.success){
			setSem(res.currentSemester);
		}else{
			setErrMsg(res.error);
		}
	}


	return(
		<div className='semester-container white-c'>
			{!isLoading ? <Loader/> : null}
			<MessageFlasher condition={errMsg!==''} resetter={setErrMsg('')}>
				<AbsractError errorMessage={errMsg}/>
			</MessageFlasher>
			{props.isCurrentUserViewing ? 
				<button className='white-c' onClick={() => props.setShowDialog()}>...</button>
			: null}
			
			{!sem ? 
				<NoSemester/>
			:
				<Semester name={sem.name} classesLength={sem.classes.length}/>
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