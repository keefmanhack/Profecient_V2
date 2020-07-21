import React from 'react';
import StartEndTime from './StartEndTimeComp/StartEndTime';

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
								<div className='suggested-links'>
									<div className='short-link link'>
										<div className='row'>
											<div className='col-lg-8'>
												<h1>Algebra 1</h1>
												<h5>25 Links</h5>
												<a href=''>Sarah Steel</a>
											</div>
											<div className='col-lg-4'>
												<button><i class="fas fa-plus-square"></i> Link</button>
											</div>
										</div>
										<button className='drop-down'><i class="fas fa-caret-down"></i></button>
									</div>
									<div className='link'>
										<h1>Algebra 1</h1>
										<h5>25 Links</h5>
										<h2>Zurn 101</h2>
										<h3>Dr. Lee</h3>
										<div className='week-days'>
											<span>M</span>
											<span>M</span>
											<span>M</span>
											<span>M</span>
											<span>M</span>
											<span>M</span>
											<span>M</span>
										</div>
										<div className='user'>
											<img src="/generic_person.jpg" alt=""/>
											<a href=''>Sarah Steel</a>
											<h5>500 Classmates Link to this Profile</h5>
										</div>
										<button><i class="fas fa-plus-square"></i> Link</button>
									</div>
								</div>
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