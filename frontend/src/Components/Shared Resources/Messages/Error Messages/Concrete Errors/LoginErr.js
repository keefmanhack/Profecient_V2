import React from 'react';

import AbstractError from '../AbsractError';

function LoginErr(props){
    return(
        <AbstractError 
            errorMessage={<span>Looks like the <strong>username</strong> or <strong>password</strong> is incorrect</span>}
        />
    ) 
}

export default LoginErr;