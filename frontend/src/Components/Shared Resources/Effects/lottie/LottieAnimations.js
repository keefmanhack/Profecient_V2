import React from 'react';
import Lottie from 'react-lottie';

import checkSuccess from './success-check';
import sentSuccess from './sent-success';
import failed from './failed';

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

function SentSuccess(props){
	return(
		<div className='lottie-overlay'>
			<Lottie 
			    options={{loop: false, animationData: sentSuccess}}
			    height={'99%'}
			    width={'99%'}
			    speed={10}
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

function FailedSent(props){
	return(
		<div className='lottie-overlay'>
			<Lottie 
			    options={{loop: false, animationData: failed}}
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
export {FailedSent};
export {SentSuccess};