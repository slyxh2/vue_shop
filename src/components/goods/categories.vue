<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"
                     class="margin-bottom"
                     @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <zk-table :data="cateList"
                :columns="columns"
                :show-row-hover="false"
                :selection-type="false"
                :expand-type="false"
                :show-index="true"
                index-text=""
                border>
        <template slot="isOK"
                  slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted === false"
             style="color: lightgreen"></i>
          <i class="el-icon-error"
             v-else
             style="color: red"></i>
        </template>
        <template slot="order"
                  slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success"
                  v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning"
                  v-else>三级</el-tag>
        </template>
        <template slot="operation"
                  slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini"
                     @click="showEditCateDialog(scope.row)">编辑</el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     @click="deleteCate(scope.row)">删除</el-button>
        </template>

      </zk-table>
    </el-card>
    <!-- 分页器 -->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="requestList.pagenum"
                   :page-sizes="[5, 10, 15, 20]"
                   :page-size="requestList.pagesize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCateDialogVisible"
               width="50%"
               @close="resetAddCateField">
      <el-form :model="addCateList"
               :rules="addCateFormRule"
               ref="addCateFormRef"
               label-width="100px">
        <el-form-item label="分类名称"
                      prop="cat_name">
          <el-input v-model="addCateList.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="cascaderValue"
                       :options="cateOptions"
                       :props="cascaderProps"
                       :clearable="true"
                       @change="handleChange"
                       placeholder="请选择（空选为添加一级分类）"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="editCateDialogVisible"
               width="50%"
               @close="resetEditCateField">
      <el-form :model="editCateList"
               :rules="editCateFormRule"
               ref="editCateFormRef"
               label-width="100px">
        <el-form-item label="分类名称"
                      prop="editCateName">
          <el-input v-model="editCateList.editCateName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getCateList()
  },
  data () {
    return {
      //请求商品分类数据参数
      requestList: {
        type: 3, //获得几级数据
        pagenum: 1,//当前页数
        pagesize: 5 //每页数据
      },
      cateList: [], //所有分类数据
      total: 0,
      columns: [{
        label: '商品名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        type: 'template',
        template: 'isOK'
      }, {
        label: '排序',
        type: 'template',
        template: 'order'
      }, {
        label: '操作',
        type: 'template',
        template: 'operation'
      }
      ], //表格配置
      addCateDialogVisible: false,
      addCateList: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateFormRule: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      cateOptions: [],
      cascaderValue: [],//级联选择器选择的值
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        childern: 'children',
        checkStrictly: true
      },
      editCateDialogVisible: false,
      editCateFormRule: {
        editCateName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      editCateList: {
        editCateName: '',
        editCateId: 0
      }
    }
  },
  methods: {
    async getCateList () {
      const { data: result } = await this.$http.get('categories', { params: this.requestList })
      this.cateList = result.data.result
      this.total = result.data.total
      //console.log(result.data.result)
    },
    handleSizeChange (newSize) {
      this.requestList.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.requestList.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog () {
      this.getCateOptions()
      this.addCateDialogVisible = true
    },
    async getCateOptions () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      this.cateOptions = res.data
      if (res.meta.status !== 200) return this.$message.error('获取父级分类失败！')
    },
    handleChange () {
      //console.log(this.cascaderValue)
      if (this.cascaderValue.length === 1) {
        this.addCateList.cat_level = 1
        this.addCateList.cat_pid = this.cascaderValue[0]
      } else if (this.cascaderValue.length === 2) {
        this.addCateList.cat_level = 2
        this.addCateList.cat_pid = this.cascaderValue[1]
      }
    },
    addCate () {
      // console.log(this.addCateList)
      this.$refs.addCateFormRef.validate(async val => {
        if (!val) return

        const { data: result } = await this.$http.post('categories', this.addCateList)
        //console.log(result)
        if (result.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })

    },
    resetAddCateField () {
      this.$refs.addCateFormRef.resetFields()
    },
    showEditCateDialog (inf) {
      //console.log(inf)
      this.editCateList.editCateId = inf.cat_id
      this.editCateDialogVisible = true
    },
    async editCate () {
      this.$refs.editCateFormRef.validate(async val => {
        if (!val) return
        const { data: result } = await this.$http.put(`categories/${this.editCateList.editCateId}`, { cat_name: this.editCateList.editCateName })
        if (result.meta.status !== 200) return this.$message.error('编辑分类失败')
        this.$message.success('编辑分类成功')
        this.editCateDialogVisible = false
        this.getCateList()
      })
    },
    resetEditCateField () {
      this.$refs.editCateFormRef.resetFields()
    },
    async deleteCate (inf) {
      //console.log(inf)
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      //console.log(result)
      if (result === 'cancel') return
      const { data: delRes } = await this.$http.delete(`categories/${inf.cat_id}`)
      if (delRes.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getCateList()
    }

  }
}
</script>

<style scoped>
.margin-bottom {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>