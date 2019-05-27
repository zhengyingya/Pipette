<template>
  <div class="measure">
    <div class="panel">
      <Info :sampleIndex="sampleIndex"></Info>
      <div class="cnt">
        <DisplayArea 
          :value="value" 
          :tip="tip" 
          :records="records" 
          :sampleIndex="sampleIndex" 
          :isWork="timer"
          @startMear="startMear" 
          @stopMear="stopMear"
        />
        <Record @recordRowClick="recordRowClick"></Record>
      </div>
      <!-- <MenuArea @startMear="startMear"/> -->
    </div>
  </div>
</template>

<script>
// import serialPort from '../../lib/serialport';
import DisplayArea from './DisplayArea';
import MenuArea from './MenuArea';
import Record from './Record';
import Info from './Info';
import { ZERO, STABLE_NORMAL } from '../../constant/ack.js';
import stateMachine from '../../common/stateMachine';
import { STATE } from '../../common/stateMachine';
import { mapState, mapActions } from 'vuex'
import makeTrashable from 'trashable';

const serialPort = window.serialPort;
let queue = [];

export default {
  name: 'measure',
  components: {
    DisplayArea,
    MenuArea,
    Info,
    Record
  },
  data () {
    return {
      timer: null,
      latestValue: 0,
      value: '0.0000',
      tip: '准备就绪',
      records: [],
      mearCount: 0,
      sampleIndex: this.$route.params.selectIndex         // 存在store中的样品表中的序号
    }
  },
  mounted () {
      stateMachine.transState(STATE.INIT);
      stateMachine.execute()
      .then((data) => {
        // data.substring(0, 3) === STABLE_NORMAL
      })
  },
  beforeDestroy () {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions(['saveMeasureData', 'changeCurrentNum']),
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    onZero () {
      window.serialPort.write('ZI\r\n', function (err) {
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
      const self = this;
      this.timer = setInterval(() => {
        this.task()
        // self.mearCount ++;
        // this.saveMeasureData({
        //   mass: 0.2
        // })
        // if (self.mearCount >= 18) {
        //   clearInterval(self.timer);
        // }
      }, 500);
      queue.push(STATE.ZERO);
    },
    stopMear () {
      clearInterval(this.timer);
      this.timer = null
      this.tip = '准备就绪'
      if (this.trashablePromise) {
        this.trashablePromise.trash();
      }
    },
    task () {
      const self = this;
      if (queue.length > 0) {
        let state = queue.shift();     
        stateMachine.transState(state);
        this.trashablePromise = makeTrashable(stateMachine.execute())
        this.trashablePromise
        .then((data) => {
          switch (state) {
            case STATE.ZERO:
              console.log('------', data);
              if (data === ZERO) {
                queue.push(STATE.MEASURE);
                self.value = '0.0000g'
                self.tip = '请滴入液体';
                self.latestValue = 0;
              }
              break;
            case STATE.MEASURE:
              if (data.substring(0, 3) === STABLE_NORMAL) {
                const weight = data.substr(4, 10);
                const unit = data.substr(-1);
                if (Number(weight.trim()) - this.latestValue < 0.01) {
                  queue.push(STATE.MEASURE);
                }
                else {
                  self.tip = '正在读取数据并等待清零';
                  self.value = weight.trim()+unit;
                  self.records.push(weight.trim()+unit);
                  self.latestValue = Number(weight.trim());
                  self.mearCount ++;

                  this.saveMeasureData({
                    mass: weight.trim()
                  })
                  if (self.mearCount === 6 || self.mearCount === 12) {
                    this.$message({
                      message: '请注意调整移液器的检定点',
                      type: 'warning',
                      duration: 100000,
                      customClass: 'mymessage'
                    })
                  }
                  if (self.mearCount < 18) {
                    queue.push(STATE.ZERO);
                  }
                  else {
                    clearInterval(self.timer);
                    self.measCount = 0;
                    self.tip = '测量完成';
                    this.$message({
                      message: '测量已完成，请点击提交生成原始记录',
                      type: 'success',
                      duration: 5000
                    })
                  }
                }
              }
              break;
            default:
          }
        });
      }
    },
    recordRowClick(index) {
      if (this.timer) {
        this.$message({
          message: '请先停止测量',
          type: 'warning',
          duration: 3000
        })
      } else {
        this.changeCurrentNum({index})
        this.mearCount = index
      }
    }
  }
}
</script>
<style>
  .mymessage .el-message {
    top: 400px;
  }
  .mymessage .el-message__icon, .mymessage .el-message__content {
    font-size: 30px;
  }
</style>

<style scoped>
  .measure {
    height: 100%;
    width: 100vw;
    padding: 10px 20px;
    box-sizing: border-box;
  }
  .panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    /* border: 1px solid #ebebeb;
    border-radius: 3px; */
  }
  .panel .cnt {
    display: flex;
    flex: 1;
  }
</style>
