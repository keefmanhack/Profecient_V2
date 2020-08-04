import React from 'react';
import {FlipInOut, FadeInOut_HandleState} from '../../CustomTransition';

class SuggestedLinksContainer extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			testData: [
				{
					name: 'Algebra 1',
					links: 25,
					user: {
						name: 'Sarah Steel',
						image: './generic_person.jpg',
						links: 500,
					},
					location: 'Zurn 101',
					instructor: 'Dr. Lee',
					weekDays: {
						monday: false,
						tuesday: false,
						wednesday: false,
						thursday: false,
						friday: false,
						saturday: false,
						sunday: false,
					},
				},
				{
					name: 'Algebra 1',
					links: 25,
					user: {
						name: 'Sarah Steel',
						image: './generic_person.jpg',
						links: 500,
					},
					location: 'Zurn 101',
					instructor: 'Dr. Lee',
					weekDays: {
						monday: false,
						tuesday: false,
						wednesday: false,
						thursday: false,
						friday: false,
						saturday: false,
						sunday: false,
					},
				},
				{
					name: 'Algebra 1',
					links: 25,
					user: {
						name: 'Sarah Steel',
						image: './generic_person.jpg',
						links: 500,
					},
					location: 'Zurn 101',
					instructor: 'Dr. Lee',
					weekDays: {
						monday: false,
						tuesday: false,
						wednesday: false,
						thursday: false,
						friday: false,
						saturday: false,
						sunday: false,
					},
				}
			]
		}
	}

	render(){
		const links = this.state.testData.map((data, index) =>
			this.props.currentClass.name && this.props.currentClass.name===data.name ? <Link data={data} key={index}/> : null
		)
		return(
			<div className='suggested-links'>
				<FadeInOut_HandleState condition={links[0] !== null}> 
					<React.Fragment>
						{links}
					</React.Fragment>
				</FadeInOut_HandleState>
				<FadeInOut_HandleState condition={links[0] === null}>
					<p>No links match this class</p>
				</FadeInOut_HandleState>
			</div>
		)
	}
}

class Link extends React.Component{
	constructor(props){
		super(props);

		this.state={
			isExpanded: false,
		}
	}

	toggleExpanded(){
		const isExpandedCopy = this.state.isExpanded;

		this.setState({
			isExpanded: ! isExpandedCopy
		})
	}

	render(){
		const display = this.state.isExpanded ? <ExpandedLink data={this.props.data} toggleExpanded={() => this.toggleExpanded()}/> : <ShortLink data={this.props.data} toggleExpanded={() => this.toggleExpanded()}/>
		return(
			<React.Fragment>
				<FlipInOut condition={this.state.isExpanded}>
					{display}
				</FlipInOut>
			</React.Fragment>
		);
	}
}

function ExpandedLink(props){
	return(
		<div className='link'>
			<h1>{props.data.name}</h1>
			<h5>{props.data.links} Links</h5>
			<h2>{props.data.location}</h2>
			<h3>{props.data.instructor}</h3>
			<div className='week-days'>
				<span className={props.data.weekDays.monday ? 'active' : null}>M</span>
				<span className={props.data.weekDays.tuesday ? 'active' : null}>T</span>
				<span className={props.data.weekDays.wednesday ? 'active' : null}>W</span>
				<span className={props.data.weekDays.thursday ? 'active' : null}>T</span>
				<span className={props.data.weekDays.friday ? 'active' : null}>F</span>
				<span className={props.data.weekDays.saturday ? 'active' : null}>S</span>
				<span className={props.data.weekDays.sunday ? 'active' : null}>S</span>
			</div>
			<div className='user'>
				<img src={props.data.user.image} alt=""/>
				<a href=''>{props.data.user.name}</a>
				<h5>{props.data.user.links} Classmates Link to this Profile</h5>
			</div>
			<button><i class="fas fa-plus-square"></i> Link</button>
			<button onClick={() => props.toggleExpanded()} className='drop-down'><i class="fas fa-caret-down"></i></button>
		</div>
	)
}

function ShortLink(props){
	return(
		<div className='short-link link'>
			<div className='row'>
				<div className='col-lg-8'>
					<h1>{props.data.name}</h1>
					<h5>{props.data.links} Links</h5>
					<a href=''>{props.data.user.name}</a>
				</div>
				<div className='col-lg-4'>
					<button><i class="fas fa-plus-square"></i> Link</button>
				</div>
			</div>
			<button onClick={() => props.toggleExpanded()} className='drop-down'><i class="fas fa-caret-up"></i></button>
		</div>
	);
}

export default SuggestedLinksContainer;