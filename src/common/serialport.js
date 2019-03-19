var _SerialPort = require("serialport");

class SerialPort {
  constructor () {
    let self = this;

    self.cb = null;
    self.buffer = '';

    _SerialPort.list(function (err, ports) {
      self.ports = ports;
      ports.forEach(function(port) {
        console.log(port.comName);
        console.log(port.pnpId);
        console.log(port.manufacturer);
      });
    });
  }
  
  getPort() {
    return this.ports
  }

  open (com) {
    let self = this;
    self.serialPort = new _SerialPort(com, {
      baudRate: 9600
    });

    if (self.serialPort) {
      this.serialPort.on('data', function (data) {
        for (let i=0,len=data.length; i<len; i++) {
          if (data[i] === 10) {                          // 回车符表示串口接受完一段数据
            if (self.cb) {
              console.log(self.buffer)
              self.cb(self.buffer);
              self.cb = null;
            }
            self.buffer = '';
          }
          else if (data[i] === 13){

          }
          else {
            self.buffer += String.fromCharCode(data[i]);
          }
        }
      })
      return 1;
    }
    else {
      return -1;
    }
  }

  close () {
    this.serialPort.on('data', () => {})
  }

  send (data, cb) {
    this.cb = cb;
    this.serialPort.write(data, function( err ) {
      if (err) {
        cb(err);
      }
    });
  }
}

var serialPort = new SerialPort();
window.serialPort = serialPort;
