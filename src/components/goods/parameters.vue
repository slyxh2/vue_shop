<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体部分 -->
    <el-card>
      <el-alert title="注意: 只允许为第三级分类设置相关参数!"
                type="warning"
                :closable="false"
                :show-icon="true"
                class="alert-margin">
      </el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader v-model="selectedCate"
                       :options="cateOptions"
                       :props="cateProps"
                       @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <!-- 动态 -->
        <el-tab-pane label="动态参数"
                     name="many"
                     :disabled="isUsable">
          <el-button type="primary"
                     size="mini"
                     :disabled="isUsable"
                     @click="showAddDialog">添加参数</el-button>
          <el-table :data="manyTable"
                    :border="true"
                    :stripe="true">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                        :key="index"
                        :closable="true"
                        @close="handleClose(scope.row, index)">
                  {{item}}
                </el-tag>
                <el-input v-if="scope.row.tagInputVisible"
                          v-model="scope.row.newTag"
                          ref="newTagRef"
                          size="small"
                          style="width: 100px"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name"
                             label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           icon="el-icon-edit"
                           size="mini"
                           @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态 -->
        <el-tab-pane label="静态属性"
                     name="only"
                     :disabled="isUsable">
          <el-button type="primary"
                     size="mini"
                     :disabled="isUsable"
                     @click="showAddDialog">添加属性</el-button>
          <el-table :data="onlyTable"
                    :border="true"
                    :stripe="true">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                        :key="index"
                        :closable="true"
                        @close="handleClose(scope.row, index)">
                  {{item}}
                </el-tag>
                <el-input v-if="scope.row.tagInputVisible"
                          v-model="scope.row.newTag"
                          ref="newTagRef"
                          size="small"
                          style="width: 100px"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name"
                             label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           icon="el-icon-edit"
                           size="mini"
                           @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加属性/参数对话框 -->
    <el-dialog :title="'添加' + this.addDialogTitle"
               :visible.sync="addDialogVisible"
               width="50%"
               @close="resetAddForm">
      <el-form ref="addFormRef"
               :model="addParamsList"
               label-width="80px"
               :rules="addFormRules">
        <el-form-item :label="addDialogTitle"
                      prop="attr_name">
          <el-input v-model="addParamsList.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑属性/参数对话框 -->
    <el-dialog :title="'修改' + this.addDialogTitle"
               :visible.sync="editDialogVisible"
               width="50%"
               @close="resetEditForm">
      <el-form ref="editFormRef"
               :model="editParamsList"
               label-width="80px"
               :rules="editFormRules">
        <el-form-item :label="addDialogTitle"
                      prop="attr_name">
          <el-input v-model="editParamsList.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editParams">确 定</el-button>
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
      selectedCate: [],
      cateOptions: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      activeName: 'many',
      manyTable: [],
      onlyTable: [],
      addDialogVisible: false,
      addParamsList: {
        attr_name: '',
        attr_sel: '',
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
      },
      editDialogVisible: false,
      editParamsList: {
        attr_name: '',
        attr_sel: '',
      },
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
      },
      selectedParamsId: 0,
      addNewTagList: {
        attr_name: '',
        attr_sel: '',
        attr_vals: []
      }
    }
  },
  computed: {
    // false可使用btn true不能使用
    isUsable () {
      if (this.selectedCate.length === 3) {
        return false
      }
      return true
    },
    cateId () {
      if (this.selectedCate.length === 3) {
        return this.selectedCate[2]
      }
      return null
    },
    addDialogTitle () {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  },
  methods: {
    async getCateList () {
      const { data: result } = await this.$http.get('categories')
      this.cateOptions = result.data
    },
    async handleChange () {
      if (this.selectedCate.length < 3) {
        this.selectedCate = []
        this.manyTable = []
        this.onlyTable = []
        return
      }
      this.getParams()

      //console.log(this.cateId)
    },
    handleClick () {
      this.getParams()
    },
    async getParams () {
      const { data: result } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      //console.log(result)
      if (result.meta.status !== 200) return this.$message.error('获取参数失败')

      result.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.tagInputVisible = false
        item.newTag = ''
      })

      if (this.activeName === 'many') {
        this.manyTable = result.data
      } else {
        this.onlyTable = result.data
      }
    },
    showAddDialog () {
      this.addDialogVisible = true
      this.addParamsList.attr_sel = this.activeName
      //console.log(this.addParamsList.attr_sel)
    },
    resetAddForm () {
      this.$refs.addFormRef.resetFields()
    },
    addParams () {
      this.$refs.addFormRef.validate(async val => {
        if (!val) return
        const { data: result } = await this.$http.post(`categories/${this.cateId}/attributes`, this.addParamsList)
        //console.log(result)
        if (result.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getParams()
        this.addDialogVisible = false
      })
    },
    editParams () {
      //console.log(inf)
      this.$refs.editFormRef.validate(async val => {
        if (!val) return
        const { data: result } = await this.$http.put(`categories/${this.cateId}/attributes/${this.selectedParamsId}`,
          this.editParamsList)
        //console.log(result)
        if (result.meta.status !== 200) return this.$message.error('编辑失败')
        this.$message.success('编辑成功')
        this.getParams()
        this.editDialogVisible = false
      })
    },
    showEditDialog (inf) {
      this.editDialogVisible = true
      this.selectedParamsId = inf.attr_id

      this.editParamsList.attr_sel = this.activeName
    },
    resetEditForm () {
      this.$refs.editFormRef.resetFields()
    },
    async deleteParams (inf) {
      const result = await this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //console.log(result)
      if (result === 'confirm') {
        const { data: delRes } = await this.$http.delete(`categories/${this.cateId}/attributes/${inf.attr_id}`)
        if (delRes.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getParams()
        //console.log(delRes)
      }
    },
    showInput (inf) {
      inf.tagInputVisible = true
      this.$nextTick(_ => {
        this.$refs.newTagRef.$refs.input.focus();
      })
    },
    async handleInputConfirm (inf) {
      //console.log(inf.attr_vals)
      if (inf.newTag) {
        inf.attr_vals.push(inf.newTag.trim())
        const newVals = inf.attr_vals.join(',')

        this.addNewTagList.attr_vals = newVals

        this.addNewTagList.attr_name = inf.attr_name
        this.addNewTagList.attr_sel = inf.attr_sel

        const { data: result } = await this.$http.put(`categories/${inf.cat_id}/attributes/${inf.attr_id}`, this.addNewTagList)
        //console.log(result)
        if (result.meta.status !== 200) return this.$message.error('添加失败')
        this.$message.success('添加成功！')

        inf.newTag = ''
        inf.tagInputVisible = false
      }
    },
    async handleClose (inf, index) {
      console.log(inf, index)
      inf.attr_vals.splice(index, 1)

      const { data: result } = await this.$http.put(`categories/${inf.cat_id}/attributes/${inf.attr_id}`, {
        attr_name: inf.attr_name,
        attr_sel: inf.attr_sel,
        attr_vals: inf.attr_vals.join(',')
      })
      console.log(result)
      if (result.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
    }

  }
}
</script>

<style scoped>
.alert-margin {
  margin: 15px 0;
}
</style>