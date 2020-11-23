import React, { useState } from 'react';

import AssignmentRequests from '../../../../APIRequests/Assignment';

import Form from './Form';

class UpdateAssignmentForm extends React.Component{
    constructor(props){
        super(props);

        this.assReq = new AssignmentRequests(this.props.currentUserID);

        this.state={  
            selectedID: this.props.selectedID,
            dueDate: new Date(this.props.dueDate),
            dueTime: new Date(this.props.dueTime),
            name: this.props.name,
            description: this.props.description,
        }
    }

    updateAssignment = async data => {
        const res = await this.assReq.update(this.props.selectedID, this.props.assignmentID, this.state.selectedID, data);
        return res;
    }

    updateData = (key, value) => {
       const t = this.state;
       t[key] = value;
       this.setState({t});
    }

    render(){
        return(
            <Form
                handleSubmit={async (data) => await this.updateAssignment(data)}
                currentUserID={this.props.currentUserID}
                data={this.state}
                updateData={(key, value) => this.updateData(key, value)}
                submit={{name: 'Update', cssClass: 'orange-bc' }}
                hideForm={() => this.props.hideForm()}
            />
        )
    }
}

export default UpdateAssignmentForm;