'use strict';

import React, { Component, PropTypes } from 'react';

import { ChartCanvas, Chart as StockChart, DataSeries, EventCapture, series, axes } from 'react-stockcharts';
const { AreaSeries } = series;
const { XAxis, YAxis } = axes;

const Chart = function () {
  Component.call(this);
};

Chart.prototype = Object.create(Component.prototype);
Chart.prototype.constructor = Chart;

Chart.prototype.prepareData = (samples) => samples.map((value, index) => ({value, index}));

Chart.prototype.componentWillReceiveProps = function (props) {
  const { samples } = props;
  const { chart } = this.refs;

  if (samples) {
    const data = this.prepareData(samples);
    chart.alterData(data);
  }
};

Chart.prototype.render = function () {
  const { width, height, type, samples } = this.props;

  const data = this.prepareData(samples);
  const margin = { left: 70, right: 10, top: 10, bottom: 30 };

  return (
    <ChartCanvas width={width} height={height} margin={margin} data={data} type={type} ref="chart">
      <StockChart id={0} xAccessor={sample => sample.index}>
        <XAxis axisAt="bottom" orient="bottom" ticks={6}/>
        <YAxis axisAt="left" orient="left"/>
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
  width: 400,
  height: 200,
  type: 'svg'
};

export default Chart;
