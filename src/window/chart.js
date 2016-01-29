'use strict';

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { ChartCanvas, Chart as StockChart, DataSeries, EventCapture, series, axes } from 'react-stockcharts';
const { AreaSeries } = series;
const { XAxis } = axes;

const Chart = function () {
  Component.call(this);
};

Chart.prototype = Object.create(Component.prototype);
Chart.prototype.constructor = Chart;

Chart.prototype.prepareData = (samples) => samples.map((value, index) => ({value, index}));

Chart.prototype.shouldComponentUpdate = function (nextProps, nextState) {
  return (
    this.state.width !== nextState.width ||
    this.state.height !== nextState.height
  );
};

Chart.prototype.componentWillMount = function () {
  const { width, height } = this.props;
  this.state = { width, height };
};

Chart.prototype.componentDidMount = function () {
  this.resizeHandler = () => {
    const parent = ReactDOM.findDOMNode(this).parentNode;

    const width = parent.clientWidth < Chart.defaultProps.width ?
      Chart.defaultProps.width :
      parent.clientWidth;

    const height = parent.clientHeight < Chart.defaultProps.height ?
      Chart.defaultProps.height :
      parent.clientHeight;

    this.setState({ width, height });
  };

  window.addEventListener('resize', this.resizeHandler);
  this.resizeHandler();
};

Chart.prototype.componentWillUnmount = function () {
  window.removeEventListener('resize', this.resizeHandler);
};

Chart.prototype.componentWillReceiveProps = function (props) {
  const { samples } = props;
  const { chart } = this.refs;

  const data = this.prepareData(samples);
  chart.alterData(data);
};

Chart.prototype.render = function () {
  const { width, height } = this.state;
  const { type, samples } = this.props;

  const data = this.prepareData(samples);
  //const margin = { left: 70, right: 10, top: 10, bottom: 30 };
  const margin = { left: 10, right: 10, top: 10, bottom: 30 };

  return (
    <ChartCanvas width={width} height={height} margin={margin} data={data} type={type} ref={`chart`}>
      <StockChart id={0} xAccessor={sample => sample.index}>
        <XAxis axisAt="bottom" orient="bottom" ticks={5}/>
        <DataSeries id={0} yAccessor={sample => sample.value}>
          <AreaSeries/>
        </DataSeries>
      </StockChart>
      <EventCapture mouseMove={true} zoom={true} pan={true} mainChart={0} defaultFocus={false}/>
    </ChartCanvas>
  );
};

Chart.propTypes = {
  samples: PropTypes.arrayOf(PropTypes.number).isRequired
};

Chart.defaultProps = {
  width: 240,
  height: 120,
  type: 'svg'
};

export default Chart;
