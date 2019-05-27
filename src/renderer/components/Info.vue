<template>
  <div class="info">
    <el-row type="flex" style="margin-bottom:10px;text-align:center;">
      <div class="label">委托单位</div>
      <div class="val">{{sampleList[sampleIndex].clientName}}</div>
      <div class="label">证书编号</div>
      <div class="val">{{sampleList[sampleIndex].certCode}}</div>
      <div class="label">型号规格</div>
      <div class="val">{{sampleList[sampleIndex].typeRule}}</div>
      
      <div class="label" style="margin-left:30px;">标称容量</div>
      <!-- {{errorTable}} -->
      <el-select v-model="capacitySel" placeholder="请选择" @change="capacityChange">
        <el-option
          v-for="item in Object.keys(basis)"
          :key="item"
          :label="item+' μL'"
          :value="item">
        </el-option>
      </el-select>
    </el-row>
    <el-row type="flex" style="margin-bottom:10px;">
      <el-checkbox v-model="isCustomized" @change="customerChange" style="line-height: 36px;">自定义检定点</el-checkbox>
      <label class="custom-label">检定点1</label><el-input class="custom-input" v-model="pointOne"></el-input><span class="custom-span">μL</span>
      <label class="custom-label">检定点2</label><el-input class="custom-input" v-model="pointTwo"></el-input><span class="custom-span">μL</span>
      <label class="custom-label">检定点3</label><el-input class="custom-input" v-model="pointThree"></el-input><span class="custom-span">μL</span>
    </el-row>
    <!-- <el-row type="flex" style="margin-bottom:10px;text-align:center;">
      <div class="label">标称容量</div>
      <el-select v-model="capacitySel" placeholder="请选择" @change="capacityChange">
        <el-option
          v-for="item in Object.keys(basis)"
          :key="item"
          :label="item+' μL'"
          :value="item">
        </el-option>
      </el-select>
    </el-row> -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import basis from '../../constant/basis.js'
export default {
  name: 'info',
  props: [
    'sampleIndex',
  ],
  data () {
    return {
      basis,
      capacitySel: '1',
      isCustomized: false,
      pointOne: '',
      pointTwo: '',
      pointThree: ''
    }
  },
  computed: {
    ...mapState({
      sampleList: (state) => {
        return state.list.sampleList
      }
    })
  },
  methods: {
    ...mapActions(['changeCapacity', 'customizedCapacity']),
    capacityChange (val) {
      this.changeCapacity({ capacity: val })
    },
    customerChange (val) {
      if (val) {
        if (this.pointOne && this.pointTwo && this.pointThree) {
          this.customizedCapacity({pointOne: this.pointOne, pointTwo: this.pointTwo, pointThree:this.pointThree})
        } else {
          this.$message({
            message: '请先输入三个检定点',
            type: 'error',
            duration: 3000
          })
          this.isCustomized = false
        }
      }
    }
  }
}
</script>
<style>
  .info .el-input__inner {
    height: 45px;
    border-radius: 0;
    border: 1px solid #69c0ff;
    color: #69c0ff;
  }
  .custom-input .el-input__inner {
    height: 35px;
    border: 1px solid #ccc;
    color: #000;
  }
</style>

<style scoped>
  .info {
    padding-top: 10px; 
  }
  .label{
    padding: 10px 15px;
    width: 80px;
    background: #69c0ff;
    color: #fff;
    /* border-radius: 5px 0 0 5px; */
  }
  .val {
    /* width: 200px; */
    padding-left: 20px;
    padding-right: 20px; 
    text-align: center;
    border: 1px solid #69c0ff;
    color: #69c0ff;
    /* border-radius: 0 5px 5px 0; */
    height: 43px;
    line-height: 43px;
  }
  .custom-input {
    width: 120px;
  }
  .custom-label {
    height: 35px;
    line-height: 35px;
    color: #333;
    margin-left: 20px;
    margin-right: 10px;
  }
  .custom-span {
    line-height: 35px;
    margin-left: 10px;
  }
</style>
