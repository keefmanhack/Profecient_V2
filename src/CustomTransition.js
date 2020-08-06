import React from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';


function FlipInOut_HandleState(props){
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

function FlipInOut(props){
	return(
		<TransitionGroup component={null}>
			<CSSTransition
				key={props.condition}
				timeout={500}
				classNames={{
					enter: 'animate__animated animate__faster',
					enterActive: 'animate__flipInX',
					exit: 'animate__animated',
					exitActive: 'animate__flipOutX animate__faster'
				}}
			>
				{props.children}
			</CSSTransition>
		</TransitionGroup>
	);
}

function RotateInOutLeft_HandleState(props){
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

function RotateInOutRight_HandleState(props){
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

function FadeInOut_HandleState(props){
	return(
		<CSSTransition
			in={props.condition}
			timeout={500}
			classNames={{
				enter: 'animate__animated animate__faster',
				enterActive: 'animate__fadeIn',
				exit: 'animate__animated animate__faster',
				exitActive: 'animate__fadeOut',
			}}
			unmountOnExit
		>
			{props.children}
		</CSSTransition>
	);
}

function FadeDownUp_HandleState(props){
	return(
		<CSSTransition
			in={props.condition}
			timeout={500}
			classNames={{
				enter: 'animate__animated animate__faster',
				enterActive: 'animate__fadeInDown',
				exit: 'animate__animated animate__faster',
				exitActive: 'animate__fadeOutUp',
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

function BackInOut_HandleState(props){
	return(
		<CSSTransition
			in={props.condition}
			timeout={500}
			classNames={{
				enter: 'animate__animated animate__faster',
				enterActive: 'animate__backInDown',
				exit: 'animate__animated animate__faster',
				exitActive: 'animate__backOutUp',
			}}
			unmountOnExit
		>
			{props.children}
		</CSSTransition>
	);
}

function FadeRight_HandleState(props){
	return(
		<CSSTransition
			in={props.condition}
			timeout={500}
			classNames={{
				enter: 'animate__animated animate__faster',
				enterActive: 'animate__fadeInRight',
				exit: 'animate__animated animate__faster',
				exitActive: 'animate__fadeOutRight',
			}}
			unmountOnExit
		>
			{props.children}
		</CSSTransition>
	);
}

export {RotateInOutLeft_HandleState};
export {RotateInOutRight_HandleState};
export {FadeInOut};
export {FlipInOut};
export {FlipInOut_HandleState};
export {FadeInOut_HandleState};
export {FadeDownUp_HandleState};
export {BackInOut_HandleState};
export {FadeRight_HandleState};