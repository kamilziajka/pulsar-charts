'use strict';

import EventEmitter from 'events';
import { Socket } from 'net';

const Receiver = function ({ hosts, port, channels, samples, frequency }) {
  EventEmitter.call(this);

  this.hasStarted = false;

  const floatSize = 4;
  const channelSize = floatSize * samples;
  const bufferSize = channels * channelSize;

  const emitChannels = (buffer) => {
    const all = [];

    for (let i = 0; i < channels; i++) {
      const channel = new Array(samples);

      for (let j = 0; j < samples; j++) {
        channel[j] = buffer.readFloatLE((i * channelSize) + (j * floatSize));
      }

      all.push(channel);
      this.emit(`channel-${i}`, channel);
    }

    this.emit('channels', all);
  };

  const [ controller, streamer ] = ['controller', 'streamer'].map((name) => {
    return (new Socket)
      .on('connect', () => console.log(`connected to ${name}`))
      .on('error', error => console.log(error))
      .on('closed', () => console.log(`disconnected from ${name}`));
  });

  let buffer = new Buffer(bufferSize);
  let receivedBytes = 0;

  streamer.on('data', (data) => {
    buffer.write(data.toString('binary'), receivedBytes, data.length, 'binary');
    receivedBytes += data.length;

    if (!(receivedBytes % bufferSize)) {
      emitChannels(buffer);
      buffer = new Buffer(bufferSize);
      receivedBytes = 0;
    }
  });

  controller.on('connect', () => {
    controller.write(`niwa start ${port} Mark5B-512-${channels}-2 ${frequency} ${samples}`);

    setTimeout(() => {
      const [ host, port ] = hosts.streamer.split(':');
      streamer.connect(port, host);
    }, 3000);
  });

  this.start = () => {
    if (this.hasStarted) {
      return;
    }

    const [ host, port ] = hosts.controller.split(':');
    controller.connect(port, host);
    this.hasStarted = true;
  };
};

Receiver.prototype = Object.create(EventEmitter.prototype);
Receiver.prototype.constructor = Receiver;

export default Receiver;
