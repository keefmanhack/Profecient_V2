import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import {FadeInOutHandleState} from '../../../Shared Resources/Effects/CustomTransition';
import MenuDropDown, {DropDownMain, Item, Options} from '../../../Shared Resources/Drop Down/MenuDropDown';

import './index.css';
function SemesterEditorDialog(props){
	const [shouldShow, setShouldShow] = useState(false);
	return(
		<React.Fragment>
			<button className='white-c off-black-bc drop-down' onClick={() => setShouldShow(true)}><span>...</span></button>
			<FadeInOutHandleState condition={!!shouldShow}>
				<MenuDropDown hideDropDown={() => setShouldShow(false)}>
					<DropDownMain>
                        {props.isCurrentUserViewing ?
                            <React.Fragment>
                                <NewSemesterItem/>
                                <DeleteCurrSemester/>
                            </React.Fragment>
                        :null}
                        <SelectSemester
							semesters={props.semesters}
							selectedID={props.currSemID}
							setCurrSemesterID={(id) => props.setCurrSemesterID(id)}
						/>
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
				selectedID={props.selectedID}
				clickEvent={(i) => props.setCurrSemesterID(props.semesters[i]._id)}
			/>
		</Item>
	)
}

export default SemesterEditorDialog;