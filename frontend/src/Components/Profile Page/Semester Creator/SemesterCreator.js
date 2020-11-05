import React from 'react';
import moment from 'moment';

import {BackInOutHandleState, FadeInOutHandleState, FadeRightHandleState} from '../../Shared Resources/Effects/CustomTransition';
import SuggestedLinksContainer from './SuggestedLinks/SuggestedLinksContainer';
import SevenDayAgenda from './SevenDayAgenda/SevenDayAgenda';
import ClassEditor from './ClassEditor/ClassEditor';
import {SuccessCheck} from '../../Shared Resources/Effects/lottie/LottieAnimations';

import SemesterRequests from '../../../APIRequests/Semester';
import ClassRequests from '../../../APIRequests/Class';

import './semester-creator.css';


class SemesterCreator extends React.Component{
	constructor(props){
		super(props);

		this.semReq = new SemesterRequests(this.props.currentUser._id);
		this.classReq = new ClassRequests(this.props.currentUser._id);

		this.state ={
			semData: {
				name: null,
				_id: null, //for edit mode
				classes: [],
			},
			currentClass: {
				name: '',
				instructor: '',
				location: '',
				daysOfWeek: [false, false, false, false, false, false, false],
				time: {
					start: new Date(moment()),
					end: new Date(moment().add(3, 'hours')),
				},
				date: {
					start: new Date(moment()),
					end: new Date(moment().add(2, 'months')),
				},
				links: [],
			},
			editMode: false,
			suggestedUserLinks: [],
			selectedIndex: null,
			successful: false,
		}
	}

	componentDidMount(){
		if(this.props.updateData !== null){
			let semData = this.state.semData;
			semData.name = this.props.updateData.name;
			semData.classes = this.props.updateData.classes;
			semData._id = this.props.updateData._id;
			this.setState({
				semData: semData,
			})
		}
	}

	async createSemester(){
		await this.semReq.create(this.state.semData);
		this.setState({successful: true});
	}

	async updateSemester(){
		await this.semReq.update(this.state.semData);
		this.setState({successful: true});
	}

	createDefaultClass(){
		const classData_copy = JSON.parse(JSON.stringify(currentClass_default)); //makes deep copy

		classData_copy.time.start = new Date(moment());
		classData_copy.time.end = new Date(moment().add(3, 'hours'));
		classData_copy.date.start = new Date(moment());
		classData_copy.date.end = new Date(moment().add(2, 'months'));

		return classData_copy;
	}

	async getSuggestedLinks(data){
		this.setState({suggestedUserLinks: await this.classReq.findLinks(data, this.state.currentClass.links)});
	}

	toggleSelected(i){
		let currentClass_copy = this.state.currentClass;
		currentClass_copy.daysOfWeek[i] = !currentClass_copy.daysOfWeek[i];

		this.setState({
			currentClass: currentClass_copy,
		})
	}

	semName(key, text){
		let semData_copy = this.state.semData;
		semData_copy.name= text;
		this.setState({
			semData: semData_copy,
		});
	}

	addClass(){
		const semData_copy = this.state.semData;
		const currentClass = this.state.currentClass;
		const defaultCopy = this.createDefaultClass();

		semData_copy.classes.push(currentClass);

		this.setState({
			semData: semData_copy,
			currentClass: defaultCopy,
			suggestedUserLinks: [],
		})
	}

	updateClass(){
		const semData_copy = this.state.semData;
		const currentClass = this.state.currentClass;
		const defaultCopy = this.createDefaultClass();


		semData_copy.classes[this.state.selectedIndex] = currentClass;

		this.setState({
			semData: semData_copy,
			currentClass: defaultCopy,
			selectedIndex: null,
			editMode: false,
			suggestedUserLinks: [],
		})
	}

	removeClassItem(i){
		let semData_copy = this.state.semData;
		const defaultCopy = this.createDefaultClass();

		semData_copy.classes.splice(i, 1);
		
		this.setState({
			semData: semData_copy,
			currentClass: defaultCopy,
		})
	}

	classItemSelected(i){
		const classData_copy = JSON.parse(JSON.stringify(this.state.semData.classes[i])); //makes deep copy

		classData_copy.time.start = new Date(moment(this.state.semData.classes[i].time.start));
		classData_copy.time.end = new Date(moment(this.state.semData.classes[i].time.end));
		classData_copy.date.start = new Date(moment(this.state.semData.classes[i].date.start));
		classData_copy.date.end = new Date(moment(this.state.semData.classes[i].date.end));

		this.setState({
			editMode: true,
			selectedIndex: i,
			currentClass: classData_copy,
		})
	}

	updateCurrent(key, e){
		const currentClass_copy = this.state.currentClass;
		currentClass_copy[key] = e.target.value;

		this.setState({
			currentClass: currentClass_copy,
		});
		this.getSuggestedLinks(currentClass_copy);
	}

	updateCurrent_2Key(key1, key2, text){
		const currentClass_copy = this.state.currentClass;
		currentClass_copy[key1][key2] = text;

		this.setState({
			currentClass: currentClass_copy,
		});
		this.getSuggestedLinks(currentClass_copy);
	}

	cancelUpdate(){
		const defaultCopy = this.createDefaultClass();

		this.setState({
			currentClass: defaultCopy,
			editMode: false,
			selectedIndex: null,
			suggestedUserLinks: [],
		})
	}

	addLink(i){
		const currentClass = this.state.currentClass;
		currentClass.links.push(this.state.suggestedUserLinks[i]);

		this.setState({
			currentClass: currentClass,
		})
	}

	removeLink(i){
		const currentClass = this.state.currentClass;
		currentClass.links.splice(i, 1);

		this.setState({
			currentClass: currentClass,
		})
	}

	render(){
		const classItems = this.state.semData.classes.map((data, index) =>
			<ClassItem 
				key={index}
				i={index} 
				itemSelected={(i) => this.classItemSelected(i)} 
				removeClassItem={(i) => this.removeClassItem(i)} 
				data={data}
				selected={index === this.state.selectedIndex ? true: false}
			/>
		);
		return(
			<React.Fragment>
				<div className='background-shader'/>
				<div className='semester-creator-container'>
					<FadeInOutHandleState condition={this.state.successful}>
		 				<SuccessCheck onCompleted={() =>this.props.hideNewSemForm()}/>
		 			</FadeInOutHandleState>


					<button onClick={() => this.props.hideNewSemForm()} id='exit'>Exit</button>
					<FadeRightHandleState condition={this.state.semData.classes.length > 0}>
						{this.props.updateData === null ?
							<button onClick={() => this.createSemester()} className='create-semester'>Create Semester</button>
						:
							<button onClick={() => this.updateSemester()} className='update-semester'>Edit Semester</button>	
						}
					</FadeRightHandleState>

					<BackInOutHandleState condition={this.state.semData.name === null} >
						<NameSemester semName={(key, text) => this.semName(key, text)}/>
					</BackInOutHandleState>
					<FadeInOutHandleState condition={this.state.semData.name !== null}>
						<div>
							<h1>{this.state.semData.name}</h1>
							<hr/>
							<div className='row'>
								<div className='col-lg-6'>
									<FadeInOutHandleState condition={this.state.semData.classes.length>0}>
										<div className='class-item-container'>
											{classItems}
										</div>
									</FadeInOutHandleState>

									<div className='row'>
										<div className='col-lg-6'>
											<ClassEditor
												updateCurrent={(key, text) => this.updateCurrent(key, text)}
												updateCurrent_2Key={(key1, key2, text) => this.updateCurrent_2Key(key1, key2, text)}
												currentClass={this.state.currentClass}
												addClass={() => this.addClass()}
												editMode={this.state.editMode}
												toggleSelected={(i) => this.toggleSelected(i)}
												cancelUpdate={() => this.cancelUpdate()}
												updateClass={() => this.updateClass()}
											/>
										</div>
										<div className='col-lg-6'>
											<SuggestedLinksContainer 
												suggestedUserLinks={this.state.suggestedUserLinks}
												addLink={(i) => this.addLink(i)}
												removeLink={(i) => this.removeLink(i)}
												currentLinks={this.state.currentClass.links}
											/>
										</div>
									</div>
								</div>
								<div className='col-lg-6'>
									{this.state.semData.classes.length > 0 ?
										<SevenDayAgenda 
											evItClick={(i) => this.classItemSelected(i)} 
											data={this.state.semData.classes}
											selectedIndex={this.state.selectedIndex}
										/> : null}
								</div>
							</div>
						</div>
					</FadeInOutHandleState>
				</div>
			</React.Fragment>
		);
	}
}

const currentClass_default = {
	name: '',
	instructor: '',
	location: '',
	daysOfWeek: [false, false, false, false, false, false, false],
	time: {
			start: new Date(moment()),
			end: new Date(moment().add(3, 'hours')),
	},
	date: {
		start: new Date(moment()),
		end: new Date(moment().add(2, 'months')),
	},
	links: [],
}

class NameSemester extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			error: false,
		}

		this.input = React.createRef();
	}

	componentDidMount(){
		this.input.current.focus();
	}

	semName(key, text){
		if(key === 'Enter'){
			if(text=== null || text.length<1){
				this.setState({
					error: true,
				})
			}else{
				this.props.semName(key, text)
			}
		}
	}

	render(){
		return(
			<div className='name-semester'>
				<h1>Let's Get Started</h1>
				<h2>Create a</h2>
				<h3>SEMESTER</h3>
				<input 
					ref={this.input} 
					onKeyPress={(e) => this.semName(e.key, this.input.current.value)} 
					type="text" 
					placeholder='e.g. Freshman 1st Semester'
					style={this.state.error ? {border: '2px solid red'}: null}
				/>
				<button onClick={() => this.semName('Enter', this.input.current.value)}>Create New Semester</button>
			</div>
		);
	}
}

class ClassItem extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			mouseOver: false
		}

		this.days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
	}

	toggleMouseOver(isMouseOver){
		this.setState({
			mouseOver: isMouseOver,
		})
	}
	
	
	render(){
		const daySpans = this.days.map((day, index)=>
			<span style={this.props.data.daysOfWeek[index] ? {fontWeight: 800}: {fontWeight: 200}} key={index}> {day} </span>
		);
		return(
			<div
				style={this.props.selected ? {border: '2px solid #4F9AF1', transition: '.3s'} : null}
				onClick={() => this.props.itemSelected(this.props.i)}
				onMouseEnter={() => this.toggleMouseOver(true)} 
				onMouseLeave={() => this.toggleMouseOver(false)} 
				className='class-item'
			>
				<div className='row'>
					<div className='col-lg-3'>
						<h1>{this.props.data.name}</h1>
					</div>
					<div className='col-lg-3'>
						<h2>{this.props.data.instructor}</h2>
					</div>
					<div className='col-lg-4'>
						<h3>{daySpans}</h3>
					</div>
					<div className='col-lg-2'>
						
					</div>
				</div>
				<FadeRightHandleState condition={this.state.mouseOver}>
					<button onClick={() => this.props.removeClassItem(this.props.i)}><i class="fas fa-trash"></i></button>
				</FadeRightHandleState>
			</div>
		)
	}
}

export default SemesterCreator;