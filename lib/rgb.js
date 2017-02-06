'use strict';

const async      = require('async');
const log4js     = require('log4js');
const logger     = log4js.getLogger('core-plugins-hw-blaster.Rgb');
const Controller = require('./controller');

module.exports = class Rgb {
  constructor(config) {

    this._r = new Controller(config.redGpio);
    this._g = new Controller(config.greenGpio);
    this._b = new Controller(config.blueGpio);

    this.active = 'off';
    this.r = 0;
    this.g = 0;
    this.b = 0;
  }

  _refresh() {
    if(this.active === 'off') {
      logger.info('blaster: OFF');
      this._r.setValue(0);
      this._g.setValue(0);
      this._b.setValue(0);
      return;
    }

    logger.info(`blaster: R=${this.r}, G=${this.g}, B=${this.b}`);
    this._r.setValue(this.r);
    this._g.setValue(this.g);
    this._b.setValue(this.b);
  }

  setActive(arg) {
    this.active = arg;
    this._refresh();
  }

  setR(arg) {
    this.r = arg;
    this._refresh();
  }

  setG(arg) {
    this.g = arg;
    this._refresh();
  }

  setB(arg) {
    this.b = arg;
    this._refresh();
  }

  close(done) {
    async.parallel([
      (cb) => this._r.close(cb),
      (cb) => this._g.close(cb),
      (cb) => this._b.close(cb)
    ], done);
  }

  static metadata(builder) {
    const binary  = builder.enum('off', 'on');
    const percent = builder.range(0, 100);

    builder.usage.driver();

    builder.attribute('active', binary);
    builder.attribute('r', percent);
    builder.attribute('g', percent);
    builder.attribute('b', percent);

    builder.action('setActive', binary);
    builder.action('setR', percent);
    builder.action('setG', percent);
    builder.action('setB', percent);

    builder.config('redGpio', 'integer');
    builder.config('greenGpio', 'integer');
    builder.config('blueGpio', 'integer');
  }
};
