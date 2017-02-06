const piblaster = require('pi-blaster.js');
const log4js    = require('log4js');
const logger    = log4js.getLogger('core-plugins-hw-blaster.controller');

module.exports = class controller {
  constructor(pin) {
    this.pin = pin;
    this.setValue(0);
  }

  setValue(value) {
    value /= 100;
    logger.info(`set pin ${this.pin}: ${value}`)
    piblaster.setPwm(this.pin, value, (err) => {
      if(err) {
        logger.error(`error setting pin ${this.pin} to ${value}: `, err);
      }
    });
  }

  close(done) {
    logger.info(`release pin ${this.pin}`)
    piblaster.release(this.pin, (err) => {
      if(err) {
        logger.error(`error releasing pin ${this.pin}: `, err);
      }
      return done();
    });
  }
};