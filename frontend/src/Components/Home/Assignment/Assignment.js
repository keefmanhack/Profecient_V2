import React from 'react';
import moment from 'moment';

import Loader from '../../Shared Resources/Effects/Loader/loader';
import {FadeInOutHandleState, FadeDownUpHandleState} from '../../Shared Resources/Effects/CustomTransition';

class Assignment extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			showDialog: false,
			completed: false,
			mouseOver: false,
			deleting: false,
		}

		this.timeOut = null;
	}

	toggleDropDown(){
		const showDialog_copy = this.state.showDialog;

		this.setState({
			showDialog: !showDialog_copy,
		})
	}

	toggleComplete(){
		const completed_copy = this.state.completed;

		this.props.toggleCompleted(this.props.data._id, !completed_copy);

		this.setState({
			completed: !completed_copy,
		})
	}

	deleteItem(){
		this.setState({deleting: true});
		this.timeOut = setTimeout(function(){
			this.setState({deleting: false});
		}.bind(this), 3000);
		this.props.deleteAssignment();
	}

	componentWillUnmount(){
		clearTimeout(this.timeOut);
	}

	render(){
		let colorClass = 'muted-green-bc';

		if(moment().add(1, 'days') >= moment(this.props.dueDate)){
			colorClass = 'muted-red-bc';
		}else if(moment().add(3, 'days') >= moment(this.props.dueDate)){
			colorClass = 'muted-orange-bc';
		}

		return(
			<div onMouseEnter={() => this.setState({mouseOver: true})} onMouseLeave={() => this.setState({mouseOver: false})} className={'assignment animate__animated animate__faster animate__fadeInDown sans-font ' + colorClass}>
				{this.state.deleting ? <Loader/>: null}
				<div className='row'>
					<div className='col-lg-6'>
						<h1>{this.props.name}</h1>
					</div>
					<div className='col-lg-4'>
						<h2 className='truncate'>{moment(this.props.dueDate).format('dddd')}</h2>
					</div>
					<div className='col-lg-2'>
						<button onClick={() => this.toggleComplete()} className={this.state.completed ? 'light-green-bc completed' : 'completed'}>
							<i class="fas fa-check"></i>
						</button>
					</div>
				</div>
				<FadeDownUpHandleState condition={this.state.showDialog}>
					<div className='more-info'>
						<p>{this.props.description}</p>
						<h5>{moment(this.props.dueTime).format('h:mm a')}</h5>
						<button onClick={() => this.props.editAssignment()}>Edit</button>
						<button onClick={() => this.deleteItem()}>Delete</button>
					</div>
				</FadeDownUpHandleState>
				<FadeInOutHandleState condition={this.state.mouseOver}>
					<button className='see-more' onClick={()=> this.toggleDropDown()}>
						{this.state.showDialog ? <i className='fas fa-chevron-up'></i> : <i className='fas fa-chevron-down'></i>}
					</button>
				</FadeInOutHandleState>	
			</div>
		);
	}
}

export default Assignment;