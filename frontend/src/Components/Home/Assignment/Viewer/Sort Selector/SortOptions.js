import WeekContainer from '../Assignment Containers/Concrete Containers/WeekContainer';
import ClassContainer from '../Assignment Containers/Concrete Containers/ClassContainer';
import AllContainer from '../Assignment Containers/Concrete Containers/AllContainer';

const sortOptions = [
	{
		name: 'This Week',
		object: WeekContainer,
	},
	{
		name: 'By Class',
		object: ClassContainer,
	},
	{
		name: 'All',
		object: AllContainer
	}
]

export default sortOptions;