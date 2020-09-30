import React from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';


export function FlipInOutHandleState(props){
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

export function FlipInOut(props){
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

export function RotateInOutLeftHandleState(props){
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

export function RotateInOutRightHandleState(props){
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

export function FadeInOutHandleState(props){
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

export function FadeDownUpHandleState(props){
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

export function FadeInOut(props){
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

export function BackInOutHandleState(props){
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

export function FadeRightHandleState(props){
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