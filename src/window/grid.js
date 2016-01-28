'use strict';

import React, { Component } from 'react';
import config from 'config';


class Grid extends Component {
  render() {
    const { children } = this.props;

    const rowSize = config.get('window.row');
    const rows = [];
    let row = [];

    let r = 0;
    for (let i = 0; i < children.length; i++) {
      row.push(children[r]);

      if (++r === rowSize) {
        rows.push(<div key={`row-${rows.length}`} className="grid-horizontal">{row}</div>);
        row = [];
        r = 0;
      }
    }

    return (
      <div className="grid-vertical">{rows}</div>
    )
  }
}

export default Grid;
