import React from 'react';
import { LoaderDots } from '@thumbtack/thumbprint-react';

function Loader(props){
	return(
		<div className='loader'>
			<LoaderDots size="medium" />
		</div>
	);
}

export default Loader;