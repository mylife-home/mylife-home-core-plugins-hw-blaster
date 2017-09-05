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
    this.color = 0;
  }

  _refresh() {
    if(this.active === 'off') {
      logger.info('blaster: OFF');
      this._r.setValue(0);
      this._g.setValue(0);
      this._b.setValue(0);
      return;
    }

    const r = ((this.color >> 16) & 255) / 255;
    const g = ((this.color >> 8) & 255) / 255;
    const b = (this.color & 255) / 255;

    logger.info(`blaster: R=${r}, G=${g}, B=${b}`);

    this._r.setValue(r);
    this._g.setValue(g);
    this._b.setValue(b);
  }

  setActive(arg) {
    this.active = arg;
    this._refresh();
  }

  setColor(arg) {
    this.color = arg;
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
    const binary = builder.enum('off', 'on');
    const color  = builder.range(0, 16777215);

    builder.usage.driver();

    builder.attribute('active', binary);
    builder.attribute('color', color);

    builder.action('setActive', binary);
    builder.action('setColor', color);

    builder.config('redGpio', 'integer');
    builder.config('greenGpio', 'integer');
    builder.config('blueGpio', 'integer');
  }
};
