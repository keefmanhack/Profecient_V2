import React from 'react';
import {Link} from 'react-router-dom';
import LogoRequester from '../../../../../LogoRequester';
import { FadeInOutHandleState } from '../../../../Shared Resources/Effects/CustomTransition';
import LogoResults from '../../../../Shared Resources/Logo Requests/LogoResults';


import './index.css';

class LandingPage2 extends React.Component{
    constructor(props){
        super(props);

        this.fileReader = new FileReader();
        this.logoReq = new LogoRequester();

        this.state ={
            profileImage: null,
            foundLogos: [],
            logo: null,
            username: '',
            errors: {
                username: false,
            }
        }
    }

    setProfileImage(file){
        console.log(file);
        this.fileReader.onload = function(e){
            this.setState({profileImage: e.target.result});
        }.bind(this);
        this.fileReader.readAsDataURL(file[0]);
    }
    
    checkErrors(){
        let errors = this.state.errors;
        this.state.username=== '' ? errors.username = true : errors.username =false;

        this.setState({errors: errors});
        return errors.username;
    }

    submitForm(){
        if(!this.checkErrors()){
            const school = this.state.logo ? {name: this.state.logo.name, logoURL: this.state.logo.logo} : null;
            const data = {
                username: this.state.username,
                school: school,
                profilePictureData: this.state.profileImage,
            }
            this.props.handleEvent(data);
        }
    }

    render(){
        return(
            <div className='final mont-font'>
                <Link className='mont-font blue-c header-tag' to="/">Profecient</Link>
                <div className='final-form'>
                    <h1>Sign Up</h1>
                    <hr/>
                    <label>Username *</label>
                    <input 
                        onChange={(e) => this.setState({username: e.target.value})} 
                        style={this.state.errors.username ? {fontSize: 30, border: '1px solid red'} : {fontSize: 30}} 
                        type='text' 
                        placeholder='Username'
                    />
                    <label style={{marginTop: 10}}>Select Profile Picture</label>
                    <div className='img-selector'>
                        <div style={{height: 'inherit'}} className='row'>
                            <div style={{height: 'inherit'}} className='col-lg-8'>
                                <input 
                                    accept="image/png, image/jpeg"
                                    multiple={false} 
                                    onChange={(e) => this.setProfileImage(e.target.files)} 
                                    type='file' 
                                />
                            </div>
                            <div style={{height: 'inherit'}} className='col-lg-4'>
                                <div  className='photo-container'>
                                    <img 
                                        src={this.state.profileImage ? this.state.profileImage : '/generic_person.jpg'}
                                        onError={(e) => {e.target.onerror= null; e.target.src='/generic_person.jpg'}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <label>Find School</label>
                    <div className='img-selector'>
                        <div style={{height: 'inherit'}} className='row'>
                            <div style={{height: 'inherit'}} className='col-lg-8'>
                                {this.state.logo ?
                                    <div className='selected-school'>
                                        <button onClick={() => this.setState({logo: null})}>X</button>
                                        <h5>{this.state.logo.name}</h5>
                                    </div>
                                : null}
                                <FadeInOutHandleState condition={!this.state.logo}>
                                    <React.Fragment>
                                        <input 
                                            ref={this.logoSearch}
                                            onChange={async (e) => this.setState({foundLogos: await this.logoReq.findLogos(e.target.value)})} 
                                            placeholder='Find School' 
                                            type='text'
                                        />
                                        <FadeInOutHandleState condition={this.state.foundLogos.length>0}>
                                            <LogoResults items={this.state.foundLogos} itemSelected={(item) => this.setState({logo: item, foundLogos: []})}/>
                                        </FadeInOutHandleState>
                                    </React.Fragment>
                                </FadeInOutHandleState>
                            </div>
                            <div style={{height: 'inherit'}} className='col-lg-4'>
                                <div  className='photo-container'>
                                    <img src={this.state.logo ? this.state.logo.logo : '/generic_school.jpg'}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={() => this.submitForm()} className='blue-c black-bc submit'>Join Now</button>
                </div>
                <Link id='footer-tag'>A Gregoire Design Production</Link>
            </div>
        )
    }
}

export default LandingPage2