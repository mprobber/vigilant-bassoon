// @flow
import React from 'react';
import ReactDOM from 'react-dom';

const rootNode = document.getElementById('root');

if (rootNode) {
  ReactDOM.render(<div>hi</div>, rootNode);
} else {
  throw new Error('Could not get root node');
}

