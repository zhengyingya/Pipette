<template>
  <div class="menu-area">
    <el-row>
      <el-col :span="4">
        <el-select v-model="portSel" placeholder="请选择">
          <el-option
            v-for="(item, index) in ports"
            :key="index"
            :label="item.comName"
            :value="index">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="1" style="padding-top:3px;"><i class="iconfont" style="font-size:30px;margin-top:5px;" :style="{color: ports[portSel] && ports[portSel].isOpen?'#99CC33':'#aaa'}">&#xe65f;</i></el-col>
      <el-col :span="2"><el-button type="primary" @click="openPort">{{ports[portSel] && ports[portSel].isOpen ? '关闭串口' : '打开串口'}}</el-button></el-col>
    </el-row>
    <el-button type="primary" round style="width:250px;height:60px;font-size:26px;" @click="test">开始测量</el-button>
  </div>
</template>

<script>
// import serialPort from '../../lib/serialport';
var _SerialPort = require("serialport");
var _ports = [];


const serialPort = window.serialPort;
export default {
  name: 'menuArea',
  data () {
    return {
      portSel: 0,
      ports: []
    }
  },
  computed: {
  },
  created () {
    _SerialPort.list((err, ports) => {
      this.ports = ports.map((item) => {
        return {...item, isOpen: false};
      });
      this.portSel = 0;
    });
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
    openPort () {
      const isOpen = this.ports[this.portSel].isOpen;
      if (isOpen) {
        window.serialPort.close();
        this.ports[this.portSel].isOpen = false;
      }
      else {
        if (window.serialPort.open(this.ports[this.portSel].comName) === -1) {
          this.$message.error('打开串口失败');
        }
        else {
          this.ports[this.portSel].isOpen = true;
        }
      }
    }
  }
}
</script>

<style>
  .menu-area {
    height: 30%;
    background: #f0f0f0;
    text-align: center;
  }
</style>
