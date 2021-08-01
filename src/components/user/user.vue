<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 搜索模块 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入用户名"
                    v-model="parameter.query"
                    :clearable="true"
                    @clear="getUserList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 添加用户对话框 -->
      <el-dialog title="提示"
                 :visible.sync="dialogVisible"
                 width="50%"
                 @closed="resetForm">
        <el-form :model="addForm"
                 :rules="addFormRules"
                 ref="addFormRef"
                 label-width="70px">
          <el-form-item label="用户名"
                        prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        prop="password">
            <el-input v-model="addForm.password"
                      type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱"
                        prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号"
                        prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="resetForm">取 消</el-button>
          <el-button type="primary"
                     @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 用户显示模块 -->
      <el-table :data="userList"
                :stripe="true"
                :border="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名"
                         prop="username"></el-table-column>
        <el-table-column label="邮箱"
                         prop="email"></el-table-column>
        <el-table-column label="电话"
                         prop="mobile"></el-table-column>
        <el-table-column label="角色"
                         prop="role_name"></el-table-column>
        <el-table-column label="状态"
                         prop="mg_state">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="180px">
          <template v-slot="bScope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="getUserInf(bScope)"></el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="deleteUser(bScope.row.id)"></el-button>
            <el-tooltip class="item"
                        effect="dark"
                        content="分配角色"
                        placement="top"
                        :enterable="false">
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改用户信息对话框 -->
      <el-dialog title="修改用户信息"
                 :visible.sync="editDialogVisible"
                 width="50%"
                 @closed="resetEditForm">
        <el-form :model="userInf"
                 :rules="addFormRules"
                 ref="editUserInfRef"
                 label-width="70px">
          <el-form-item label="用户名"
                        prop="username">
            <el-input disabled
                      v-model="userInf.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱"
                        prop="email">
            <el-input v-model="userInf.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号"
                        prop="mobile">
            <el-input v-model="userInf.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer"
              class="dialog-footer">
          <el-button>取 消</el-button>
          <el-button type="primary"
                     @click="editUserInf">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页器 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="parameter.pagenum"
                     :page-sizes="[10, 20, 30, 40]"
                     :page-size="parameter.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmail.test(value)) {
        cb()
      } else {
        cb(new Error('请输入正确的邮箱格式'))
      }
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        cb()
      } else {
        cb(new Error('请输入正确的手机格式'))
      }
    }
    return {
      parameter: {
        query: '', //查询参数
        pagenum: 1, //当前页码
        pagesize: 10 //每页显示条数
      },
      userList: [],
      total: 0, //总记录数
      dialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }]
      },
      userInf: {}

    }
  },
  methods: {
    async getUserList () {
      const { data: result } = await this.$http.get('users', { params: this.parameter })
      //console.log(result)
      if (result.meta.status !== 200) return this.$message.error('获取用户名单失败')
      this.userList = result.data.users
      this.total = result.data.total

      //console.log(this.userList)
    },
    handleSizeChange (newSize) {
      this.parameter.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.parameter.pagenum = newPage
      this.getUserList()
    },
    async userStateChange (inf) {
      const { data: result } = await this.$http.put(`users/${inf.id}/state/${inf.mg_state}`)
      if (result.meta.status !== 200) return this.$message.error('修改用户状态失败')
      this.$message.success('修改用户状态成功')
    },
    resetForm () {
      this.dialogVisible = false

      this.$refs.addFormRef.resetFields()

    },
    resetEditForm () {
      this.editDialogVisible = false
      this.$refs.editUserInfRef.resetFields()
    },
    addUser () {
      //dialogVisible = false
      this.$refs.addFormRef.validate(async validate => {
        if (!validate) return;
        const { data: result } = await this.$http.post('users', this.addForm)
        if (result.meta.status !== 201) return this.$message.error(result.meta.msg)
        this.$message.success(result.meta.msg)
        this.dialogVisible = false
        //console.log(result)
        this.getUserList()
      })
    },
    async getUserInf (scope) {
      this.editDialogVisible = true;
      const { data: result } = await this.$http.get(`users/${scope.row.id}`)
      if (result.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.userInf = result.data
    },
    editUserInf () {
      this.$refs.editUserInfRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.put(`users/${this.userInf.id}`, this.userInf)
        if (result.meta.status !== 200) return this.$message.error('更新失败')
        this.$message.success('更新成功')
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    async deleteUser (id) {
      const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err) //确认删除返回 comfirm 取消返回 cancel

      if (result === 'cancel') return this.$message('取消删除用户')
      const { data: delResult } = await this.$http.delete(`users/${id}`)
      if (delResult.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      this.getUserList()
    }

  }
}
</script>

<style>
</style>