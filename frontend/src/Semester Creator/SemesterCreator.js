import React from 'react';
import $ from 'jquery'; 
import {BackInOut_HandleState, FadeInOut_HandleState, FadeInOut, FadeRight_HandleState} from '../CustomTransition';
import SuggestedLinksContainer from './SuggestedLinks/SuggestedLinksContainer';
import SevenDayAgenda from './SevenDayAgenda/SevenDayAgenda';
import ClassEditor from './ClassEditor/ClassEditor';

class SemesterCreator extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			semData: {
				name: null,
				classData: [],
			},
			currentClass: {
				name: null,
				instructor: null,
				location: null,
				daysOfWeek: [false, false, false, false, false, false, false],
				time: {
					start: '2:00PM',
					end: '4:00PM',
				},
				date: {
					start: null,
					end: null,
				},
			},
			editMode: false,
			selectedIndex: null,
		}

		this.currentClass_default = {
			name: null,
			instructor: null,
			location: null,
			daysOfWeek: [false, false, false, false, false, false, false],
			time: {
				start: '2:00PM',
				end: '4:00PM',
			},
			date: {
				start: null,
				end: null,
			}
		}
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

	addClass(val){
		const semData_copy = this.state.semData;
		semData_copy.classData.push(val);

		this.setState({
			semData: semData_copy,
			currentClass: this.currentClass_default,
		})
	}

	updateClass(){
		const semData_copy = this.state.semData;
		semData_copy.classData[this.state.selectedIndex] = this.state.currentClass;

		this.setState({
			semData: semData_copy,
			currentClass: this.currentClass_default,
			selectedIndex: null,
			editMode: false,
		})
	}

	removeClassItem(i){
		let semData_copy = this.state.semData;
		semData_copy.classData.splice(i, 1);
		
		this.setState({
			semData: semData_copy,
			currentClass: this.currentClass_default
		})
	}

	classItemSelected(i){
		console.log(i);
		const classData_copy = JSON.parse(JSON.stringify(this.state.semData.classData[i])); //makes deep copy

		this.setState({
			editMode: true,
			selectedIndex: i,
			currentClass: classData_copy,
		})
	}

	updateCurrent(key, text){
		const currentClass_copy = this.state.currentClass;
		currentClass_copy[key] = text;

		this.setState({
			currentClass: currentClass_copy,
		});
	}

	updateCurrent_2Key(key1, key2, text){
		const currentClass_copy = this.state.currentClass;
		currentClass_copy[key1][key2] = text;

		this.setState({
			currentClass: currentClass_copy,
		});
	}

	cancelUpdate(){
		this.setState({
			currentClass: this.currentClass_default,
			editMode: false,
			selectedIndex: null,
		})
	}

	render(){
		const classItems = this.state.semData.classData.map((data, index) =>
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
			<div className='semester-creator-container'>
				<button onClick={() => this.props.showNewSem(false)} id='exit'>Exit</button>

				<BackInOut_HandleState condition={this.state.semData.name === null} >
					<NameSemester semName={(key, text) => this.semName(key, text)}/>
				</BackInOut_HandleState>
				<FadeInOut_HandleState condition={this.state.semData.name !== null}>
					<div>
						<h1>{this.state.semData.name}</h1>
						<hr/>
						<div className='row'>
							<div className='col-lg-6'>
								<FadeInOut_HandleState condition={this.state.semData.classData.length>0}>
									<div className='class-item-container'>
										{classItems}
									</div>
								</FadeInOut_HandleState>

								<div className='row'>
									<div className='col-lg-6'>
										<ClassEditor
											updateCurrent={(key, text) => this.updateCurrent(key, text)}
											updateCurrent_2Key={(key1, key2, text) => this.updateCurrent_2Key(key1, key2, text)}
											currentClass={this.state.currentClass}
											addClass={(val) => this.addClass(val)}
											editMode={this.state.editMode}
											toggleSelected={(i) => this.toggleSelected(i)}
											cancelUpdate={() => this.cancelUpdate()}
											updateClass={() => this.updateClass()}
										/>
									</div>
									<div className='col-lg-6'>
										<SuggestedLinksContainer 
											currentClass={this.state.currentClass}
										/>
									</div>
								</div>
							</div>
							<div className='col-lg-6'>
								{this.state.semData.classData.length > 0 ?
									<SevenDayAgenda 
										evItClick={(i) => this.classItemSelected(i)} 
										data={this.state.semData.classData}
										selectedIndex={this.state.selectedIndex}
									/> : null}
							</div>
						</div>
					</div>
				</FadeInOut_HandleState>
			</div>
		);
	}
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
				<h2>Create your first</h2>
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

		this.days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
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
				<FadeRight_HandleState condition={this.state.mouseOver}>
					<button onClick={() => this.props.removeClassItem(this.props.i)}><i class="fas fa-trash"></i></button>
				</FadeRight_HandleState>
			</div>
		)
	}
}

export default SemesterCreator;