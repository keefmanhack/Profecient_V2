import React, { useEffect, useState } from 'react';

import SimpleAssignment from './SimpleAssignment';

import {FadeRightHandleState} from '../Effects/CustomTransition';

let actingTimeout = null;
function InteractAssignment(props){
    const [hovering, setHovering] = useState(false);
    const [acting, setActing]     = useState(false);

    const handleActing = ()=>{
		setActing(true);
		actingTimeout = setTimeout(function(){
			setActing(false);
		},5000);
	}

	useEffect(() =>{
		return () => {
			//functional equivalent to componentWillUnmount
			clearTimeout(actingTimeout);
		}
	}, [])
    return(
        <SimpleAssignment
            name={props.name}
            color={props.color}
            dueDate={props.dueDate}
            description={props.description}
            dueTime={props.dueTime}
            acting={acting}
            entered={() => setHovering(true)}
            left={() => setHovering(false)}
            editDelete={
                <FadeRightHandleState condition={hovering}>
                    <EditDelete 
                        delete={() => {handleActing(); props.delete()}} 
                        edit={() => props.edit()}
                    />
			    </FadeRightHandleState>
            }
            completed={
                <Completed setCompleted={(b) => props.setCompleted(b)} completed={props.completed}/>
            }
        />
    )
   
}


function EditDelete(props){
	return(
		<div className='edit-delete'>
			<button onClick={() => props.edit()} className='orange-bc white-c'><i class="fas fa-edit"></i></button>
			<button onClick={() => props.delete()} className='red-bc white-c'><i class="fas fa-trash"></i></button>
		</div>
	)
}



function Completed(props){
	const [complete, setComplete] = useState(props.completed);
	const handleClick=()=>{
		const t = !complete;
		setComplete(t);
		props.setCompleted(t);
	}
	return(
		<button onClick={() => handleClick()} className={complete ? 'green-bc white-c completed' : 'completed'}>
			<i class="fas fa-check"></i>
		</button>
	)
}

export default InteractAssignment;