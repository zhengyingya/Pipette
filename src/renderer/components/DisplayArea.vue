<template>
  <div class="display-area">
    <div class="point"><span>序号: {{currentNum+1}}</span><span style="margin-left:80px;">当前检定点: {{records[currentNum].point}}μL</span></div>
    <div class="left">
      <div class="value">{{value}}</div>
      <div class="tip">
        <i class="iconfont" style="font-size: 30px">&#xe635;</i>
        <span style="padding-left:20px">{{tip}}</span>
      </div>
    </div>
    <div class="record" style="margin-top:100px;">
      <!-- <div class="title">读数记录</div>
      <div style="height:300px;">
        <div v-for="(item, index) in records" class="item" :key="index">
          <div class="num">{{index}}</div>
          <div class="val">{{item}}</div>
        </div>
      </div> -->
      <el-button type="primary" plain style="width:200px;height:60px;font-size:26px;" @click="test" :disabled="isWork">开始</el-button>
      <el-button type="danger" plain style="width:200px;height:60px;font-size:26px;" @click="stop" :disabled="!isWork">停止</el-button>
    </div>
    <div class="record">
      <el-button type="success" plain style="width:200px;height:60px;font-size:26px;" @click="onExport" :disabled="isWork">导出记录</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ejsExcel from 'ejsExcel'
var fs = require('fs')
const serialPort = window.serialPort;
export default {
  name: 'displayArea',
  props: [
    'value',
    'tip',
    'sampleIndex',
    'isWork'
    // 'records'
  ],
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      records: (state) => {
        return state.measure.tableData
      },
      currentNum: (state) => {
        return state.measure.currentNum
      },
      basicInfo: (state) => {
        return state.list.sampleList
      }
    })
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
      this.$emit('startMear');
    },
    stop () {
      this.$emit('stopMear');
    },
    onExport () {
      let exlBuf = fs.readFileSync(`./模板/移液器检定原始记录.xlsx`)
      console.log(this.records)
      let data = {
        clientName: this.basicInfo[this.sampleIndex].clientName,
        certCode: this.basicInfo[this.sampleIndex].certCode,
        typeRule: this.basicInfo[this.sampleIndex].typeRule,
        fantoryCode: this.basicInfo[this.sampleIndex].fantoryCode,
        makeUnit: this.basicInfo[this.sampleIndex].makeUnit,
        place: '本院',
        tableData: this.records
      }
      ejsExcel.renderExcel(exlBuf, data)
      .then((outBuf) => {
        fs.writeFileSync(`./原始记录/${this.basicInfo[this.sampleIndex].certCode}.xlsx`, outBuf)
        this.$message({
          message: '原始记录生成成功，请在原始记录目录下查看',
          type: 'success',
          duration: 10000
        })
      })
    }
  }
}
</script>

<style scoped>
  .display-area {
    width: 480px;
    /* height: 500px; */
    /* display: flex; */
  }
  .display-area .left {
    display: flex;
    flex-direction: column;
    flex: 1;
    /* border: 1px solid #ccc; */
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    margin: 40px 0; 
    margin-right: 20px;
    padding: 40px 0;
  }
  .display-area .record {
    /* border-left: 2px solid #f0f0f0; */
    display: flex;
    width: 480px;
    justify-content: center;
    margin-bottom: 20px;
  }
  .display-area .left .value {
    display: flex;
    flex: 2;
    justify-content: center;
    align-items: center;
    font-size: 100px;
    font-style: italic;
    font-weight: bolder;
    color: #69c0ff;
    margin-bottom: 40px;
  }
  .display-area .point {
    padding-top: 20px;
    flex: 1;
    /* text-align: center; */
    font-size: 26px; 
    font-weight: bolder;
    color: #67c23a;
  }
  .display-area .left .tip {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    color: #69c0ff;
    font-size: 30px;
  }

  .record .item {
    display: flex;
    font-family: 'Microsoft YaHei';
    border-bottom: 1px solid #fff;
  }

  .record .title {
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #336699;
    color: #fff;
    font-size: 24px;
  }

  .record .item .num {
    width: 60px;
    height: 40px;
    background: #409eff;
    color: #fff;
    text-align: center;
    line-height: 40px;
    font-size: 26px;
    font-weight: bolder;
  }
  .record .item .val {
    flex: 1;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    background: #ABCDEF;
    color: #fff;
    font-size: 26px;
    font-weight: bolder;
  }
</style>
