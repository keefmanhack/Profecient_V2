import React from 'react';

import AbstractError from '../AbsractError';

function GenericErr(props){
    return(
        <AbstractError 
            errorMessage='Sorry, something went wrong creating this account.'
        />
    ) 
}

export default GenericErr;