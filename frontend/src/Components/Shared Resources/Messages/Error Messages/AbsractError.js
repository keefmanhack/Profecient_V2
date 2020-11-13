import React from 'react';

import './index.css';

function AbsractError(props){
    return (
        <div className='error-message'>
            <p>{props.errorMessage}</p>
        </div>
    )
}

export default AbsractError;