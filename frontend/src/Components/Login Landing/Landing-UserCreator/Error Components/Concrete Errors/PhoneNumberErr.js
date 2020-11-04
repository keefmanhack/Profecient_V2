import React from 'react';

import AbstractError from '../AbsractError';

function PhoneNumberErr(props){
    return(
        <AbstractError 
            errorMessage={'An account already exists with this ' +<strong>'Phone Number'</strong> + '.'}
        />
    ) 
}

export default PhoneNumberErr;