import React from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';


function FlipInOut(props){
	return(
		<CSSTransition
			in={props.condition}
			timeout={500}
			classNames={{
				enter: 'animate__animated animate__faster',
				enterActive: 'animate__flipInX',
				exit: 'animate__animated',
				exitActive: 'animate__flipOutX animate__faster'
			}}
			unmountOnExit
		>
			{props.children}
		</CSSTransition>
	);
}

function RotateInOutLeft(props){
	return(
		<CSSTransition
			in={props.condition}
			timeout={500}
			classNames={{
				enter: 'animate__animated animate__faster',
				enterActive: 'animate__rotateInUpLeft',
				exit: 'animate__animated',
				exitActive: 'animate__rotateOutDownLeft animate__faster'
			}}
			unmountOnExit
		>
			{props.children}
		</CSSTransition>
	);
}

function RotateInOutRight(props){
	return(
		<CSSTransition
			in={props.condition}
			timeout={500}
			classNames={{
				enter: 'animate__animated animate__faster',
				enterActive: 'animate__rotateInUpRight',
				exit: 'animate__animated',
				exitActive: 'animate__rotateOutDownRight animate__faster'
			}}
			unmountOnExit
		>
			{props.children}
		</CSSTransition>
	);
}

function FadeInOut(props){
	return(
		<TransitionGroup component={null}>
			<CSSTransition
				key={props.condition}
				timeout={500}
				classNames={{
					enter: 'animate__animated animate__faster',
					enterActive: 'animate__fadeIn',
					exit: 'animate__animated animate__faster',
					exitActive: 'animate__fadeOut',
				}}
			>
				{props.children}
			</CSSTransition>
		</TransitionGroup>

	);
}

export {RotateInOutLeft};
export {RotateInOutRight};
export {FadeInOut};
export {FlipInOut};