<template>
  <div class="measure">
    <div class="panel">
      <DisplayArea :value="value" :tip="tip" :records="records"/>
      <MenuArea @startMear="startMear"/>
    </div>
  </div>
</template>

<script>
// import serialPort from '../../lib/serialport';
import DisplayArea from './DisplayArea';
import MenuArea from './MenuArea';
import { ZERO, STABLE_NORMAL } from '../../constant/ack.js';
import stateMachine from '../../common/stateMachine';
import { STATE } from '../../common/stateMachine';

const serialPort = window.serialPort;
let queue = [];

export default {
  name: 'measure',
  components: {
    DisplayArea,
    MenuArea
  },
  data () {
    return {
      timer: null,
      latestValue: 0,
      value: '0.000',
      tip: '准备就绪',
      records: [],
      mearCount: 0
    }
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    onZero () {
      window.serialPort.write('Z\r\n', function (err) {
        console.log(err);
      });
    },
    test () {
      window.serialPort.write('S\r\n', function (err) {
        if (err) {
          console.log(err);
        }
      });
    },
    getStableValue () {
      let self = this;
      window.serialPort.send('S\r\n', (data) => {

      });
    },
    startMear () {
      // window.serialPort.send('Z\r\n', (data) => {
      //   console.log(data, data === ZERO);
      //   if (data === ZERO) {
      //     setTimeout(() => {
      //       this.getStableValue();
      //     }, 100);
      //   }
      // });
      this.timer = setInterval(() => {
        this.task()
      }, 1000);
      queue.push(STATE.ZERO);
    },

    task () {
      const self = this;
      if (queue.length > 0) {
        let state = queue.shift();
        stateMachine.transState(state);
        stateMachine.execute()
        .then((data) => {
          switch (state) {
            case STATE.ZERO:
              if (data === ZERO) {
                queue.push(STATE.MEASURE);
                self.tip = '请滴入液体';
                self.latestValue = 0;
              }
              break;
            case STATE.MEASURE:
              if (data.substring(0, 3) === STABLE_NORMAL) {
                const weight = data.substr(4, 10);
                const unit = data.substr(-1);
                if (Number(weight.trim()) - this.latestValue < 2) {
                  queue.push(STATE.MEASURE);
                }
                else {
                  self.tip = '正在读取数据并等待清零';
                  self.value = weight.trim()+unit;
                  self.records.push(weight.trim()+unit);
                  self.latestValue = Number(weight.trim());
                  self.mearCount ++;

                  if (self.mearCount < 5) {
                    queue.push(STATE.ZERO);
                  }
                  else {
                    clearInterval(self.timer);
                    self.measCount = 0;
                    self.tip = '测量完成';
                  }
                }
              }
              break;
            default:
          }
        });
      }
    }
  }
}
</script>

<style>
  .measure {
    height: 100vh;
    width: 100vw;
    padding: 10px;
    box-sizing: border-box;
  }
  .panel {
    width: 100%;
    height: 100%;
    border: 1px solid #ebebeb;
    border-radius: 3px;
  }
</style>
