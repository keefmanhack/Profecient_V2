import React from 'react';

import AbstractError from '../AbsractError';

function EmailErr(props){
    return(
        <AbstractError 
            errorMessage={<span>An account already exists with this <strong>Email</strong>.</span>}
        />
    ) 
}

export default EmailErr;