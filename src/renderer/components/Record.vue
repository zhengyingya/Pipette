<template>
  <div class="record">
    <el-table
      border
      stripe
      height="100%"
      :span-method="arraySpanMethod"
      :row-style="rowStyle"
      :data="tableData">
      <el-table-column
        width="60"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="remear(scope.$index)">重测</el-button>
        </template>
      </el-table-column>
      <el-table-column
        width="60"
        label="序号">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        prop="point"
        label="检定点/μL">
      </el-table-column>
      <el-table-column
        width="80"
        prop="temp"
        label="温度/℃">
      </el-table-column>
      <el-table-column
        width="80"
        prop="mass"
        label="质量/g">
      </el-table-column>
      <el-table-column
        width="100"
        prop="k"
        label="K(t)值">
      </el-table-column>
      <el-table-column
        prop="v20"
        label="V20时实际容积/μL">
      </el-table-column>
      <el-table-column
        prop="ave"
        label="平均值V/μL">
      </el-table-column>
      <el-table-column
        prop="relativeError"
        label="相对误差E/%">
      </el-table-column>
      <el-table-column
        prop="repeatability"
        label="重复性S/%">
      </el-table-column>
      <el-table-column
        width="60"
        label="结论">
        <template slot-scope="scope">
          <span :style="{color: scope.row.result==='合格'?'#67c23a':'red'}">{{scope.row.result}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import stateMachine from '../../common/stateMachine';
import { STATE } from '../../common/stateMachine';
export default {
  name: 'record',
  computed: {
    ...mapState({
      tableData: (state) => {
        return state.measure.tableData
      },
      currentNum: (state) => {
        return state.measure.currentNum
      }
    })
  },
  methods: {
    ...mapActions(['saveRemearData']),
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex >= 7) {
        if (rowIndex % 6 === 0) {
          return {
            rowspan: 6,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    rowStyle ({row, rowIndex}) {
      if (rowIndex === this.currentNum - 1) {
        return {
          color: '#69c0ff',
          'font-weight': 900
        }
      }
    },
    remear (index) {
      // this.saveRemearData({
      //               mass: 0.1,
      //               index
      //             })
      const state = STATE.ZERO
      stateMachine.transState(state);
        stateMachine.execute()
        .then((data) => {
          switch (state) {
            case STATE.ZERO:
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

                  this.saveRemearData({
                    mass: weight.trim(),
                    index
                  })
                  queue.push(STATE.ZERO);
                }
              }
              break;
            default:
          }
        });
    }
  }
}
</script>
<style>
.record  .el-button--mini {
  padding: 5px 7px;
}
.record .cell {
  font-size: 16px;
}
</style>
<style scoped>
  .record {
    flex: 1;
      
  }
</style>



