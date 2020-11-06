import React from 'react';
import './index.css';

function LogoResults(props){
    const results =  props.items ? props.items.map((item, index) => 
        <Result handleClick={() => props.itemSelected(item)} logo={item.logo} domain={item.domain} name={item.name} key={index}/>
    ) : null;
    return(
        <div className='logo-results'>
            {results}
        </div>
    )
}

function Result(props){
    return(
        <div onClick={() => props.handleClick()} className='result'>
            <img src={props.logo}/>
            <h5 className='name'>{props.name}</h5>
            <h5 className='domain'>{props.domain}</h5>
        </div>
    )
}

export default LogoResults;