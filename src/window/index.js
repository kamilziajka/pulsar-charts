'use strict';

import '../set-cwd';
import React from 'react';
import ReactDOM from 'react-dom';
import config from 'config';
import Grid from './grid';
import { setTitle } from './helpers';

export default () => {
  const { channels, samples, frequency } = config.get('receiver');
  setTitle(`Pulsar Charts - ${channels} channels @ ${samples} samples each ${frequency}s`);

  ReactDOM.render(<Grid/>, document.getElementsByTagName('root')[0]);
};
