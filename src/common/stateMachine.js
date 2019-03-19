class StateMechine {
  constructor () {
    this.state = STATE.INIT;
  }

  transState (state) {
    this.state = state;
  }

  execute () {
    switch (this.state) {
      case STATE.INIT:
        return new Promise(function (resolve, reject) {
          window.serialPort.send('@\r\n', (data) => {
            resolve(data);
          });
        })
        break;
      case STATE.ZERO:
        return new Promise(function(resolve, reject) {
          window.serialPort.send('Z\r\n', (data) => {
            resolve(data);
          });
        })
        break;
      case STATE.MEASURE:
        return new Promise(function(resolve, reject) {
          window.serialPort.send('S\r\n', (data) => {
            resolve(data);
          });
        })
        break;
      default:
        break;
    }
  }
}

export const STATE = { INIT: 'INIT', ZERO: 'ZERO', MEASURE: 'MEASURE' };
export default new StateMechine();
