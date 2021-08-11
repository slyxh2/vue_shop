<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    :clearable="true"
                    @keyup.enter.native="searchGood"
                    @clear="searchGood">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="searchGood"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodList"
                :stripe="true"
                :border="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name"
                         label="商品名称"></el-table-column>
        <el-table-column prop="goods_price"
                         label="价格（元）"
                         width="100"></el-table-column>
        <el-table-column prop="goods_weight"
                         label="商品重量"
                         width="100"></el-table-column>
        <el-table-column prop="add_time"
                         label="创建时间"
                         width="200">
          <template slot-scope="scope">
            {{scope.row.add_time | getTime}}</template>
        </el-table-column>
        <el-table-column label="操作"
                         width="150">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"></el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="deleteGood(scope.row)"></el-button>
          </template>
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
  </div>
</template>

<script>
export default {
  created () {
    this.getGoodList()
  },
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodList: [],
      total: 0 //总数据个数
    }
  },
  methods: {
    async getGoodList () {
      const { data: result } = await this.$http.get('goods', { params: this.queryInfo })
      //console.log(result)
      this.goodList = result.data.goods
      this.total = result.data.total
      //console.log(this.goodList)
    },
    handleSizeChange (newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getGoodList()
    },
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getGoodList()
    },
    searchGood () {
      this.getGoodList()
    },
    async deleteGood (inf) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //console.log(result)
      if (result === 'cancel') return
      const { data: delRes } = await this.$http.delete(`goods/${inf.goods_id}`)
      //console.log(delRes)
      if (delRes.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getGoodList()
    },
    goAddPage () {
      this.$router.push('/goods/add')
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