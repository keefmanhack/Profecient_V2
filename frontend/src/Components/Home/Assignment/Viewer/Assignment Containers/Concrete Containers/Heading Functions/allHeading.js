import moment from 'moment';
import weekHeading from './weekHeading';

function allHeading(date){
    const d = moment(date).startOf('day');
    const now = moment().startOf('day');
    const diff = d.diff(now, 'days');

    if(diff>7){return d.format('MMM DD YY')}
    return weekHeading();
}

export default allHeading;