import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import {FadeInOutHandleState} from '../../Shared Resources/Effects/CustomTransition';
import MenuDropDown, {DropDownMain, Item, Options} from '../../Shared Resources/Drop Down/MenuDropDown';


function SemesterEditorDialog(props){
	const [shouldShow, setShouldShow] = useState(false);
	const areSemesters = props.semesters.length >0;
	return(
		<React.Fragment>
			<button className='white-c' onClick={() => setShouldShow(true)}>...</button>
			<FadeInOutHandleState condition={!!shouldShow}>
				<MenuDropDown hideDropDown={() => props.hideDialog()}>
					<DropDownMain>
                        {props.isCurrentUserViewing ?
                            <React.Fragment>
                                <NewSemesterItem/>
                                <DeleteCurrSemester/>
                            </React.Fragment>
                        :null}
                        <SelectSemester/>
					</DropDownMain>
				</MenuDropDown>
			</FadeInOutHandleState>
		</React.Fragment>
	)
}

function NewSemesterItem(props){
	return(
		<Item>
			<Link to='/newSemester'>
				<button> 
					<i style={{color: 'lightgreen'}} className="fas fa-plus-circle"></i> New Semester
				</button>
			</Link>
		</Item>
	)
}

function DeleteCurrSemester(props){
	return(
		<Item>
			<Link>
				<button onClick={() => props.deleteSemester()}> 
					<i style={{color: 'red'}} className="fas fa-trash"></i> Delete Current Semester
				</button>
			</Link>
		</Item>
	)
}

function SelectSemester(props){
	return(
		<Item>
			<Options 
				text={'Semester'} 
				icon={<i class="fas fa-caret-right"></i>} 
				options={props.semesters}
				selected={props.currSemID}
				clickEvent={(i) => props.setCurrSemesterID(props.semesters[i]._id)}
			/>
		</Item>
	)
}

export default SemesterEditorDialog;