import React from 'react';
import StartEndTime from './StartEndTimeComp/StartEndTime';
import {FlipInOut} from './CustomTransition';

class SemesterCreator extends React.Component{
	render(){
		return(
			<div className='semester-creator-container'>
				<div className='row'>
					<div className='col-lg-6'>
						<div className='class-item-container'>
							<ClassItem/>
							<ClassItem/>
							<ClassItem/>
							<ClassItem/>	
						</div>

						<hr/>
						<div className='row'>
							<div className='col-lg-6'>
								<div className='class-editor'>
									<input className='class-name' type="text" placeholder='Class Name'/>
									<div className='row instruct-loc'>
										<div className='col-lg-6'>
											<input type="text" placeholder='Instructor'/>
										</div>
										<div className='col-lg-6'>
											<input type="text" placeholder='Location'/>
										</div>
									</div>

									<div className='day-buttons'>
										<button>M</button>
										<button>T</button>
										<button>W</button>
										<button>T</button>
										<button>F</button>
										<button>S</button>
										<button>S</button>
									</div>

									<div className='row start-end-date'>
										<div className='col-lg-6'>
											<input type="text" placeholder='Start Date'/>
										</div>
										<div className='col-lg-6'>
											<input type="text" placeholder='End Date'/>
										</div>
									</div>

									<StartEndTime/>
									
								</div>
							</div>
							<div className='col-lg-6'>
								<SuggestedLinksContainer/>
							</div>
						</div>
						
						
					</div>
					<div className='col-lg-6'>
						<div className='seven-day-agenda'>
							<table>
								<thead>
									<tr>
										<th>Mon.</th>
										<th>Tue.</th>
										<th>Wed.</th>
										<th>Thu.</th>
										<th>Fri.</th>
										<th>Sat.</th>
										<th>Sun.</th>
									</tr>
								</thead>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

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
			<Link data={data} key={index}/>
		)
		return(
			<div className='suggested-links'>
				{links}
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

function ClassItem(props){
	return(
		<div className='class-item'>
			<div className='row'>
				<div className='col-lg-3'>
					<h1>Algebra</h1>
				</div>
				<div className='col-lg-3'>
					<h2>Dr. Lee</h2>
				</div>
				<div className='col-lg-4'>
					<h3>M T W Th F S S</h3>
				</div>
				<div className='col-lg-2'>
					
				</div>
			</div>
			<button><i class="fas fa-trash"></i></button>
		</div>
	)
}

export default SemesterCreator;