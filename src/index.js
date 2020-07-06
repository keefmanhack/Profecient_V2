import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
// import ProfilePage from './profile-page';
import MessageCenter from './Message-Center'
import Header from './header';



ReactDOM.render(<Header />, document.querySelector('.header'));
ReactDOM.render(<MessageCenter />, document.querySelector('.root'));
// ReactDOM.render(<Feed />, document.querySelector('.make-post'));
