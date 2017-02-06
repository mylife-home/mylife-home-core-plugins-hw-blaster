const piblaster = require('pi-blaster.js');
const log4js    = require('log4js');
const logger    = log4js.getLogger('core-plugins-hw-blaster.controller');

module.exports = class controller {
  constructor(pin) {
    this.pin = pin;
    setValue(0);
  }

  setValue(value) {
    value /= 100;
    logger.info(`set pin ${this.pin}: ${value}`)
    piblaster.setPwm(this.pin, value);
  }

  close(done) {
    logger.info(`release pin ${this.pin}`)
    piblaster.release(this.pin, done);
  }
};