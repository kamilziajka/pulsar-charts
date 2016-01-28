'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ChartCanvas, Chart, DataSeries, EventCapture, series, axes, helper } from 'react-stockcharts';
const { AreaSeries } = series;
const { XAxis, YAxis } = axes;
const { fitWidth } = helper;

class ChannelChart extends Component {
  static prepareData(samples) {
    return samples.map((value, index) => ({value, index}));
  }

  componentDidMount() {
    const { receiver, channel } = this.props;
    const { chart } = this.refs;

    receiver.on(`channel-${channel}`, (samples) => {
      const data = ChannelChart.prepareData(samples);
      chart.alterData(data);
    });
  };

  render() {
    const { samples, type, width } = this.props;
    const data = ChannelChart.prepareData(samples);

    return (
      <ChartCanvas width={width} height={300} margin={{left: 50, right: 50, top: 10, bottom: 30}} data={data} type={type} ref='chart'>
        <Chart id={0} xAccessor={sample => sample.index}>
          <XAxis axisAt="bottom" orient="bottom" ticks={6}/>
          <YAxis axisAt="left" orient="left"/>
          <DataSeries id={0} yAccessor={sample => sample.value}>
            <AreaSeries/>
          </DataSeries>
        </Chart>
        <EventCapture mouseMove={true} zoom={true} pan={true} mainChart={0} defaultFocus={false}/>
      </ChartCanvas>
    );
  }
}

ChannelChart.defaultProps = { type: 'svg' };
ChannelChart = fitWidth(ChannelChart);

export default ChannelChart;
