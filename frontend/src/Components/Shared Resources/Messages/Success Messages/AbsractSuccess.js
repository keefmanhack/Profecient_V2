import React from 'react';

import './index.css';

function AbsractSuccess(props){
    return(
        <div className='success-message blue-c'>
            <p>{props.successMessage}</p>
        </div>
    )
}

export default AbsractSuccess;