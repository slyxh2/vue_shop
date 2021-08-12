<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    :clearable="true"
                    v-model="queryInfo.query"
                    @keyup.enter.native="searchOrder"
                    @clear="searchOrder">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="searchOrder"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList"
                :stripe="true"
                :border="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number"
                         label="订单编号"></el-table-column>
        <el-table-column prop="order_price"
                         label="订单价格"></el-table-column>
        <el-table-column prop="pay_status"
                         label="是否支付">
          <template slot-scope="scope">
            <el-tag type="danger"
                    v-if="scope.row.pay_status === '0'">未支付</el-tag>
            <el-tag type="success"
                    v-else>已支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send"
                         label="是否发货"></el-table-column>
        <el-table-column prop="create_time"
                         label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | getTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary"
                     icon="el-icon-edit"
                     @click="showEditDialog"></el-button>
          <el-button type="success"
                     icon="el-icon-location-outline"
                     @click="showProcessDialog"></el-button>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[10, 15, 20, 30]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改信息对话框 -->
    <el-dialog title="修改订单信息"
               :visible.sync="editDialogVisible"
               width="50%"
               @closed="handleClose">
      <el-form :model="editList"
               :rules="editListRules"
               ref="editListRef"
               label-width="100px">
        <el-form-item label="省市区/县"
                      prop="city">
          <el-cascader v-model="editList.city"
                       :options="cityDate"
                       :props="{ expandTrigger: 'hover' }"
                       style="width: 100%"
                       @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="adress">
          <el-input v-model="editList.adress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="修改订单信息"
               :visible.sync="processDialogVisible"
               width="50%">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in processInf"
                          :key="index"
                          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="processDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="processDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityDate from './citydata.js'
export default {
  created () {
    this.getOrderList()
  },
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      cityDate,
      editDialogVisible: false,
      editList: {
        city: [],
        adress: ''
      },
      editListRules: {
        adress: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
        city: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }]
      },
      processDialogVisible: false,
      processInf: []

    }
  },
  methods: {
    async getOrderList () {
      const { data: result } = await this.$http.get('orders', { params: this.queryInfo })
      if (result.meta.status !== 200) return this.$http.error('获取订单列表失败')
      this.total = result.data.total
      this.orderList = result.data.goods
      //console.log(result)
    },
    handleSizeChange (newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getOrderList()
    },
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getOrderList()
    },
    searchOrder () {
      this.getOrderList()
    },
    handleClose () {
      this.$refs.editListRef.resetFields()
    },
    handleChange () {
      //console.log(this.editList)
    },
    async showProcessDialog () {
      this.processDialogVisible = true
      const { data: result } = await this.$http.get('/kuaidi/1106975712662')
      if (result.meta.status !== 200) return this.$message.error('获取物流信息失败')
      this.processInf = result.data
    },
    showEditDialog () {
      this.editDialogVisible = true
    }
  },
  filters: {
    getTime (originVal) {
      const dt = new Date(originVal)

      const year = dt.getFullYear()
      const month = (dt.getMonth() + 1 + '').padStart(2, '0')
      const date = (dt.getDate() + '').padStart(2, '0')

      const hour = (dt.getHours() + '').padStart(2, '0')
      const minute = (dt.getMinutes() + '').padStart(2, '0')
      const second = (dt.getSeconds() + '').padStart(2, '0')

      return `${year}-${month}-${date} ${hour}:${minute}:${second}`

    }
  }
}
</script>

<style>
</style>