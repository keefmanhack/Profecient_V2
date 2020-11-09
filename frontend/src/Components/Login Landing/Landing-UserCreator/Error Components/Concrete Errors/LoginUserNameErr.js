import React from 'react';

import AbstractError from '../AbsractError';

function LoginUserNameErr(props){
    return(
        <AbstractError 
            errorMessage={<span>Looks like the <strong>username</strong> is incorrect</span>}
        />
    ) 
}

export default LoginUserNameErr;