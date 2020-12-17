import { Checkbox } from '@thumbtack/thumbprint-react';
import React, {useState} from 'react';

function CheckBox(props){
    const [checked, setChecked] = useState(props.defaultCheck);
    const handleClick=()=>{
        const t = !checked;
        setChecked(t);
        props.onCheck(t);
    }
    return(
        <button onClick={() => handleClick()} className={checked ? 'green-bc white-c checkbox' : 'checkbox'}>
            <i class="fas fa-check"></i>
        </button>
    )
}


export default Checkbox;