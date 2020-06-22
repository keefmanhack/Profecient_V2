import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Header from './header';
import Feed from './feed';
import AssignmentDashboard from './AssignmentDashboard';


ReactDOM.render(<Header />, document.querySelector('.header'));
ReactDOM.render(<AssignmentDashboard />, document.querySelector('.assignments-container'));
// ReactDOM.render(<Feed />, document.querySelector('.make-post'));
