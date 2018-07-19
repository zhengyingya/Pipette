<template>
  <div class="display-area">
    <div class="left">
      <div class="value">{{value}}</div>
      <div class="tip">
        <i class="iconfont" style="font-size: 40px">&#xe635;</i>
        <span style="padding-left:20px">{{tip}}</span>
      </div>
    </div>
    <div class="record">
      <div class="title">测量记录</div>
      <div v-for="(item, index) in records" class="item">
        <div class="num">{{index}}</div>
        <div class="val">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>

const serialPort = window.serialPort;
export default {
  name: 'displayArea',
  props: [
    'value',
    'tip',
    'records'
  ],
  data () {
    return {

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
    }
  }
}
</script>

<style scoped>
  .display-area {
    height: 70%;
    display: flex;
  }
  .display-area .left {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .display-area .record {
    border-left: 2px solid #f0f0f0;
    width: 400px;
  }
  .display-area .left .value {
    display: flex;
    flex: 2;
    justify-content: center;
    align-items: center;
    font-size: 160px;
    font-style: italic;
    font-weight: bolder;
    font-family: 'Microsoft YaHei';
    color: #409eff;
  }
  .display-area .left .tip {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    color: #409eff;
    font-size: 40px;
  }

  .record .item {
    display: flex;
    font-family: 'Microsoft YaHei';
    border-bottom: 1px solid #fff;
  }

  .record .title {
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #336699;
    color: #fff;
    font-size: 30px;
    font-family: 'Microsoft YaHei';
  }

  .record .item .num {
    width: 60px;
    height: 60px;
    background: #409eff;
    color: #fff;
    text-align: center;
    line-height: 60px;
    font-size: 40px;
    font-weight: bolder;
  }
  .record .item .val {
    flex: 1;
    height: 60px;
    line-height: 60px;
    padding-left: 20px;
    background: #ABCDEF;
    color: #fff;
    font-size: 40px;
    font-weight: bolder;
  }
</style>
