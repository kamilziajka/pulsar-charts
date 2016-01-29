'use strict';

import React, { Component } from 'react';
import config from 'config';
import Receiver from './receiver';
import Chart from './chart';
import { range } from './helpers';

const Grid = function () {
  Component.call(this);

  const options = config.get('receiver');
  this.receiver = new Receiver(options);

  this.state = {
    channels: range(options.channels).map(() => range(options.samples))
  };
};

Grid.prototype = Object.create(Component.prototype);
Grid.prototype.constructor = Grid;

Grid.prototype.componentDidMount = function () {
  this.receiver
    .on('channels', channels => this.setState({ channels }))
    .start();
};

Grid.prototype.render = function () {
  const { channels } = config.get('receiver');
  const { rowSize } = config.get('window');

  let rows = range(channels)
    .reduce((previous, current, index) => {
      if (!(index % rowSize)) {
        previous.push([]);
      }

      previous[previous.length - 1].push(current);
      return previous;
    }, []);

  rows = rows.map(row => row.map((value, index) => (
    <div className="grid-child" key={`chart-${index}`}>
      <div className="grid-container">
        <Chart samples={this.state.channels[index]}/>
      </div>
    </div>
  )));

  rows = rows.map((row, index) => (
    <div className="grid-horizontal" key={`row-${index}`}>{ row }</div>
  ));

  return <div className="grid-vertical">{ rows }</div>;
};

export default Grid;
