<template>
  <div class="page-comconfig">
    <el-row type="flex" justify="center">
      <el-alert
        title="配置各个设备的串口，点保存后会存于数据库中，下次启动软件可自动打开对应的串口，如果要修改配置，在此页面修改保存即可"
        type="success"
        :closable="false"
        style="width:200px;margin-right:120px;">
      </el-alert>
      <el-col type="flex" :span="14">
        <el-row type="flex" justify="center" style="margin-bottom:20px;">
          <div class="tip">传感器串口</div>
          <el-select v-model="sensorCom" style="width:400px;height:40px;">    
            <el-option
              v-for="(item) in ports"
              :key="item.comName"
              :label="item.comName"
              :value="item.comName">
            </el-option>
          </el-select>
        </el-row>
        <el-row type="flex" justify="center" style="margin-bottom:20px;">
          <el-button type="primary" @click="save">保存</el-button>
        </el-row>
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
import comNedb from '../../../database/comNedb'

export default {
  name: 'comConfig',
  components: {
  },
  data () {
    return {
      sensorCom: 0,
      ports: window.serialPort.getPort()
    }
  },
  created () {
    comNedb.find({})
    .then((res) => {
      if (res.length === 0) {
        console.log('====', this.ports)
        this.sensorCom = this.ports[0].comName
      } else {
        console.log(res)
        this.sensorCom = res[0].portName
      }  
    })
  },
  methods: {
    save () {
      comNedb.remove({})
      .then((res) => {
        comNedb.insert({
          type: 'mearSensor',
          portName: this.sensorCom
        })
      })
      .then((res) => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    }
  }
}
</script>
<style lang="scss">
.page-comconfig {
  .el-alert__title {
    font-size: 14px;
    line-height: 28px;
  }
}
</style>

<style lang="scss" scoped>
.page-comconfig {
  width: 100%;
  padding-top: 40px;
  .tip {
    width: 120px;
    height: 40px;
    line-height: 40px;
  }
}
</style>
