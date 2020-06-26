import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Header from './header';



ReactDOM.render(<Header />, document.querySelector('.header'));
ReactDOM.render(<App />, document.querySelector('.root'));
// ReactDOM.render(<Feed />, document.querySelector('.make-post'));
