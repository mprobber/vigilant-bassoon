// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './scenes/Root';

const root = document.createElement('div');
if (document.body) document.body.appendChild(root);
root.style.setProperty('height', '100%');
ReactDOM.render(<Root />, root);
