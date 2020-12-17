import React, {useState, useEffect} from 'react';

//API Requests
import ClassRequests from '../../../../../APIRequests/Class';

//Composed components
import Interactor from './Interactor/Interactor';
import ConnectionList from './Connection List/ConnectionList';

import {getSelectCount, selectAllHelper, unSelectAllHelper, getSelectedIDs} from './HelperFunctions';

//Effects
import Loader from '../../../../Shared Resources/Effects/Loader/loader';
import MessageFlasher from '../../../MessageFlasher';
import AbsractError from '../../../Messages/Error Messages/AbsractError';

import './index.css';
function EditConnectionsForm(props){
    const classReq = new ClassRequests(props.currUserID);
    const [connections, setConnections] = useState(new Map());
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        getConnections();
    }, []);

    const getConnections = async () => {
        setIsLoading(true);
        const res = await classReq.getFormatedToConnections(props.classID);
        if(res.success){
            console.log(res.connectionMap);
            setConnections(new Map(res.connectionMap));
        }else{
            setErrMsg(res.error);
        }
        setIsLoading(false);
    }

    const deleteConnections =  async () => {
        setIsLoading(true);
        const res = await classReq.removeToConnections(getSelectedIDs(connections));
        res.success ? getConnections() : setErrMsg(res.error);
        setIsLoading(false);
    }

    const addSelected = (id, val) => {
        let t = connections;
        let c = connections.get(id);
        c.selected=val;
        t.set(id, c);

        setConnections(t);
    }

    return(
        <PopUp hideForm={() => props.hideForm()} className='edit-connections'>
                <MessageFlasher resetter={() => setErrMsg('')} condition={errMsg!==''}>
                    <AbsractError errorMessage={errMsg}/>
                </MessageFlasher>

                <h1>Edit Connections</h1>
                <h2>{props.className}</h2>
                <hr/>
                <button onClick={()=>props.hideForm()} className='red-c'>Exit</button>
                <div>
                    <Interactor
                        delete={() => deleteConnections()}
                        selectAll={() => setConnections(selectAllHelper(connections))}
                        unSelectAll={() => setConnections(unSelectAllHelper(connections))}
                        selectCount={getSelectCount(connections)}
                    />
                </div>
                <ConnectionRenderer 
                    isLoading={isLoading}
                    connections={connections}
                    onSelected={(id) => addSelected(id)}
                />
        </PopUp>
    )
}

class PopUp extends React.Component{
    constructor(props){
        super(props)

        this.wrapperRef = React.createRef();
		this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount(){
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount(){
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.props.hideForm();
        }
    }

    render(){
        return(
            <div ref={this.wrapperRef} className={'pop-up ' + this.props.className}>
                {this.props.children}
            </div>
        )
    }
}

function ConnectionRenderer(props){
    return props.isLoading ? <Loader/> : <ConnectionList 
                                            connections={props.connections}
                                            onSelected={(id, val) => props.onSelected(id, val)}    
                                        />;
}

export default EditConnectionsForm;