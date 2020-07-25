import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import ProfilePage from './profile-page';
// import MessageCenter from './MessageCenter/Message-Center'
import Header from './header';



ReactDOM.render(<Header />, document.querySelector('.header'));
ReactDOM.render(<ProfilePage />, document.querySelector('.root'));
// ReactDOM.render(<Feed />, document.querySelector('.make-post'));
