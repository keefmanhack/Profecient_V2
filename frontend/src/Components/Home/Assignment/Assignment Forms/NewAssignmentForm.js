import React, { useState } from 'react';

import AssignmentRequests from '../../../../APIRequests/Assignment';

import Form from './Form';

class NewAssignmentForm extends React.Component{
    constructor(props){
        super(props);

        this.assReq = new AssignmentRequests(this.props.currentUserID);

        this.state={  
            selectedID: null,
            dueDate: new Date(),
            dueTime: new Date(),
            name: '',
            description: '',
        }
    }

    createAssignment = async data => {
        const res = await this.assReq.create(this.state.selectedID, data);
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
                handleSubmit={(data) => this.createAssignment(data)}
                currentUserID={this.props.currentUserID}
                data={this.state}
                updateData={(key, value) => this.updateData(key, value)}
                submit={{name: 'Submit', cssClass: 'blue-bc' }}
                hideForm={() => this.props.hideForm()}
            />
        )
    }
}

export default NewAssignmentForm;