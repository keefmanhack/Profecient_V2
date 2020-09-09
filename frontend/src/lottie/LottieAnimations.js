import React from 'react';
import Lottie from 'react-lottie';
import checkSuccess from './success-check';

function SuccessCheck(props){
	return(
		<div className='lottie-overlay'>
			<Lottie 
			    options={{loop: false, animationData: checkSuccess}}
			    height={'99%'}
			    width={'99%'}
		        eventListeners={[
		        	{
			    		eventName: 'complete',
			    		callback: () => {props.onCompleted()},
			  		}
			  	]}
		    />
		</div>
	);
}

export {SuccessCheck};