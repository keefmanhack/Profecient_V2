import moment from 'moment';

function dayHeading(date){
    const d = moment(date).startOf('day');
    const now = moment().startOf('day');
    const diff = d.diff(now, 'days');

    if(diff < 0){
        return 'Overdue';
    }else if(diff === 0){
        return 'Today';
    }else if(diff === 1){
        return 'Tomorrow';
    }else{
        return d.format('dddd');
    }
}

export default dayHeading;