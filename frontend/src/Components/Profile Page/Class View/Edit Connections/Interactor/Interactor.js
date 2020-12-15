import React from 'react';

import './index.css';
function Interactor(props){
    return(
        <div className='interactor'>
            <button onClick={() => props.selectAll()}>Select All</button>
            <button onClick={() => props.unSelectAll()}>UnSelect All</button>
            <h5>{props.selectCount} Selected</h5>
            <DeleteRenderer delete={()=>props.delete()} selectCount={props.selectCount}/>
        </div>
    )
}

function DeleteRenderer(props){
    return(
        <FadeInRightHandleState condtion={props.selectCount>0}>
            <button onClick={()=>props.delete()}>Delete {props.selectCount} Connections</button>
        </FadeInRightHandleState>
    )
}

export default Interactor;