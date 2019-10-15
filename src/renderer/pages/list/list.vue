<template>
  <div class="page-list">
    <el-table
      :data="sampleList"
      height="100%"
      border
      stripe
      style="width: 100%"
      header-row-class-name="u-table-head"
      class="u-table"
    >
      <el-table-column prop="clientName" label="委托单位"></el-table-column>
      <el-table-column prop="sampleName" label="样品名称" width="90"></el-table-column>
      <el-table-column prop="certCode" label="证书编号" width="120"></el-table-column>
      <el-table-column prop="entrustDate" label="委托日期" width="120">
        <template slot-scope="scope">
          <span>{{dateFormat(scope.row.entrustDate, 'yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="typeRule" label="型号规格"></el-table-column>
      <el-table-column width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="onConfirm(scope.$index, scope.row)">测量</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-dialog
      title="选择配置文件"
      :visible.sync="dialogVisible"
      width="30%">
      <el-select v-model="configIndex" style="width:100%">    
        <el-option
          v-for="(item, index) in configData"
          :key="item.index"
          :label="item.name"
          :value="index">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
// import oracleManage from '../../../database/oracle'
import { dateFormat } from "../../../utils/commonMethod.js";
import { mapActions, mapState } from "vuex";

export default {
  name: "tableData",
  components: {},
  data() {
    return {
      dialogVisible: false,
      configIndex: 0,
      selectIndex: 0
    };
  },
  computed: {
    ...mapState({
      sampleList: state => {
        return state.list.sampleList;
      },
      configData: state => {
        // this.configName = state.mearConfig.configData[0] ? state.mearConfig.configData[0].name : ''
        return state.mearConfig.configData;
      }
    })
  },
  created() {
    this.getSampleList();
    // this.getConfigData()
  },
  methods: {
    ...mapActions(["getSampleList", "changeRouter"]),
    dateFormat,
    handleEdit(index) {
      this.dialogVisible = true;
      this.selectIndex = index;
    },
    onConfirm(index) {
      this.$router.push({ name: "home", params: { selectIndex: index } });
      this.changeRouter({ name: "home" });
    }
  }
};
</script>
<style lang="scss">
.page-list {
  .u-table-head {
    th {
      // background: #409eff;
      // color: #fff;
    }
  }
}
</style>
<style lang="scss" scoped>
.page-list {
  width: 100%;
  padding: 20px 40px;
  box-sizing: border-box;
  .u-table {
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
