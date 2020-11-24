import React, { useEffect, useState } from 'react';
import ClassRequests from '../../../../APIRequests/Class';
import { FadeInOutHandleState } from '../../../Shared Resources/Effects/CustomTransition';
import LinkSelector from '../../../Shared Resources/Link Selector/LinkSelector';
import MessageFlasher from '../../../Shared Resources/MessageFlasher';
import AbsractError from '../../../Shared Resources/Messages/Error Messages/AbsractError';

import './index.css';
function ClassList(props){
    const containers = props.classes.map(classData =>
        <ClassContainer
            name={classData.name}
            instructor={classData.instructor}
            location={classData.location}
            daysOfWeek={classData.daysOfWeek}
            time={classData.time}
            classID={classData._id}
            currentUserID={props.currentUserID}
        />    
    )
    return(
        <div className='class-list'>
            {containers}
            {containers.length === 0 ? 
                <div className='light-grey-bc animate__animated animate__faster animate__fadeIn' style={{textAlign: 'center', borderRadius:5}}>
                    <p className='white-c'>You don't have any classes</p>
                </div>
            : null}
        </div>
    )
}

function ClassContainer(props){
    return(
        <div className='class-container'>
            <LinkButton/>
            <h1>{props.name}</h1>
            <h2>{props.instructor}</h2>
            <h3>{props.location}</h3>
            <DayList daysOfWeek={props.daysOfWeek}/>
            <ToFromTime start={props.time.start} end={props.time.end}/>
            <AssignmentShower classID={props.classID} currentUserID={props.currentUserID}/>
        </div>
    )
}

function LinkButton(props){
    const isLinked = false;
    const button = isLinked ?  <UnLinkButton/> : <LinkButton/>
    return(
       {button}
    )
}

function UnLinkButton(props){
    const classReq = new ClassRequests(props.otherUserID);
    const [errMsg, setErrMsg] = useState('');

    const removeLink = async () => {
        props.setLoading(true);
        const res = await classReq.removeAConnection(props.classID, props.currentUserID);
        props.setLoading(false);
        if(res.success){
           props.reload(); 
        }else{
            setErrMsg(res.error);
        }
    }
    return(
        <React.Fragment>
            <MessageFlasher condition={errMsg !== ''} resetter={() => setErrMsg('')}>
                <AbsractError errorMessage={errMsg}/>
            </MessageFlasher>
            <button onClick={() => removeLink()} className='link orange-bc white-c' >
                UnLink
            </button>
        </React.Fragment>

    )
}

function LinkButton(props){
    const [linkSelector, setLinkSelector] = useState(null);
    const [shouldShowLinkSelector, setShouldShowLinkSelector] = useState(false);

    useEffect(() => {
        props.reload();
    }, [shouldShowLinkSelector]);

    const showLinkSelector = () => {
        const t = <LinkSelector 
                    otherUserID={props.otherUserID}
                    linkClass={props.classData}
                    currentUser={props.currentUserID}
                    hideForm={() => setShouldShowLinkSelector(false)}
        />

        setLinkSelector(t);
        shouldShowLinkSelector(true);
    }


    return(
        <React.Fragment>
            <button onClick={() => showLinkSelector()} className='link blue-bc'>
                Link
            </button>
            <FadeInOutHandleState condition={shouldShowLinkSelector}>
                {linkSelector}
            </FadeInOutHandleState>
        </React.Fragment>

    )
}

function AssignmentShower(props){
    const [showAsses, setShowAsses] = useState(false);

    const dropDownDis = <i className={"fas fa-chevron-" + showAsses ? 'up' : 'down'}></i> 
    return(
        <React.Fragment>
            <button className='see-assign' onClick={() => {const t = showAsses; setShowAsses(!t)}}>
                {dropDownDis} {showAsses ? 'Close' : 'See'} Assignments 
            </button>
            <div style={{position: 'relative'}}>
                <FadeDownUpHandleState condition={showAsses}>
                    <AssignContainer classID={props.classID} currentUserID={props.currentUserID}/>
                </FadeDownUpHandleState>
            </div>
        </React.Fragment>
    )
}




class ClassCon extends React.Component{


	addNewLink(data){
		console.log(data);
	}

	async removeLink(classID){
		this.setState({reloading: true});
		await this.props.classReq.removeAConnection(this.props.otherUserID, classID, this.props.data._id, this.props.currentUser._id);
		this.props.reloadClasses();
		this.setState({reloading: false})
	}


	render(){


		let connectedToClassID = null;

		this.props.data.connectionsFrom.forEach(function(connection){
			if(connection.userID + '' === this.props.currentUser._id + ''){
				connectedToClassID = connection.classID;
			}
		}.bind(this))

		let linkBtn;




		return(
			<div className='class-container'>
				{this.state.reloading ? <Loader/> : null}
				<FadeInOutHandleState condition={this.state.showLinkSelector}>
					<LinkSelector
						otherUserID={this.props.otherUserID}
						linkClass={this.props.data}
						currentUser={this.props.currentUser}
						addNewLink={(data) => this.addNewLink(data)}
						success={this.state.linkAddedSuccess}
						hideForm={() => {this.setState({showLinkSelector: false}); this.props.reloadClasses()}}
					/>
				</FadeInOutHandleState>
				{this.props.isCurrentUserViewing ? null :
					<React.Fragment>
					{linkBtn}
					</React.Fragment>
				}
			</div>
		);
	}
}

export default ClassList;