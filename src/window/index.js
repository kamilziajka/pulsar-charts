'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import config from 'config';
import Receiver from './receiver';

import Grid from './grid';

import ChannelChart from './channel-chart';
import { helper } from 'react-stockcharts';
const { TypeChooser } = helper;

export default () => {
  const root = document.getElementsByTagName('root')[0];
  const options = config.get('receiver');
  const receiver = new Receiver(options);

  const range = (size) => {
    const g = function *(n) {
      while (n--) yield n;
    };

    return [ ...g(size) ];
  };

  const samples = range(options.samples).map(() => 0);

  const charts = range(options.channels).map((v, i) => {
    return (
      <div className="grid-child" key={`chart-${i}`}>
        <TypeChooser type="hybrid">
          { type => <div className="container"><ChannelChart samples={samples} type={type} receiver={receiver} channel={i}/></div> }
        </TypeChooser>
      </div>
    )
  });

  ReactDOM.render(<Grid>{charts}</Grid>, root);
  receiver.start();
};
