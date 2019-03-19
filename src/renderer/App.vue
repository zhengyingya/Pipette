<template>
  <div id="app">
    <Header/>
    <div class="wrap">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Header from './components/header'
  import comNedb from '../database/comNedb'
  export default {
    name: 'my-project',
    components: {
      Header
    },
    created () {
      comNedb.find({})
      .then((res) => {
        if (res.length === 0) {
          this.$alert('请到串口菜单配置串口', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${ action }`
              });
            }
          })
        } else {
          const sensorCom = res[0].portName
          if (window.serialPort.open(sensorCom) === -1) {
            this.$message.error('打开串口失败');
          }
        }  
      })
    }
  }
</script>

<style>
  #app {
    min-width: 1000px;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .wrap {
    display: flex;
    flex: 1;
    overflow: auto;
  }
</style>
