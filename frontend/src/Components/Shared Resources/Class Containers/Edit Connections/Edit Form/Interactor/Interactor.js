import React from 'react';

import {FadeInOutHandleState} from '../../../../../Shared Resources/Effects/CustomTransition';

import './index.css';
function Interactor(props){
    return(
        <div className='interactor'>
            <button className='gray-bc' onClick={() => props.selectAll()}>Select All</button>
            <button className='gray-bc' onClick={() => props.unSelectAll()}>UnSelect All</button>
            <h5><span className='blue-c'>{props.selectCount}</span> Selected</h5>
            <DeleteRenderer delete={()=>props.delete()} selectCount={props.selectCount}/>
        </div>
    )
}

function DeleteRenderer(props){
    if(props.selectCount> 0){
        return(
            <button onClick={()=>props.delete()} className='animate__animated animate__faster animate__fadeInRight remove white-c black-bc'>
                Delete <span className='red-c'>{props.selectCount}</span>
            </button>
        )
    }
    return null;
}

export default Interactor;