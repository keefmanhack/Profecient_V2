import React from 'react';

import AbstractError from '../AbsractError';

function EmailNotExist(props){
    return(
        <AbstractError 
            errorMessage={<span>Can't find an account with this <strong>Email</strong>.</span>}
        />
    ) 
}

export default EmailNotExist;