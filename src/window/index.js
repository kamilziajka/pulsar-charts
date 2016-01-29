'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Grid from './grid';

export default () => {
  ReactDOM.render(<Grid/>, document.getElementsByTagName('root')[0]);
};
