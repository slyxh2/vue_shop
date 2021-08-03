<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色按钮布局 -->
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="openAddDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色展示模块 -->
      <el-table :border="true"
                :stripe="true"
                :data="roleList">
        <el-table-column type="expand"
                         ref="temp">
          <template v-slot="rowSlot">
            <el-row v-for="item in rowSlot.row.children"
                    :key="item.id"
                    class="center first-level">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable
                        @close="removeRight(rowSlot.row, item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="items in item.children"
                        :key="items.id"
                        class="center second-level">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="removeRight(rowSlot.row, items.id)">{{items.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- <el-tag v-for="itemss in item.children.children"
                        :key="itemss.id">{{itemss.authName}}123</el-tag> -->
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag v-for="itemss in items.children"
                            :key="itemss.id"
                            type="warning"
                            closable
                            @close="removeRight(rowSlot.row, itemss.id)">{{itemss.authName}}</el-tag>
                    <!-- <el-tag>111</el-tag> -->
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName"
                         label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc"
                         label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="checkRole(scope.row.id)">编辑</el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning"
                       icon="el-icon-setting"
                       size="mini"
                       @click="showSetRightList(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色"
               :visible.sync="dialogVisible"
               width="50%"
               @closed="resetAddForm">
      <el-form :model="addRoleList"
               :rules="addRoleRules"
               ref="addRoleRef"
               label-width="80px">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="addRoleList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="addRoleList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeAddDialog">取 消</el-button>
        <el-button type="primary"
                   @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="修改角色"
               :visible.sync="editDialogVisible"
               width="50%"
               @closed="resetEditForm">
      <el-form :model="editRoleList"
               :rules="addRoleRules"
               ref="editRoleRef"
               label-width="80px">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="editRoleList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="editRoleList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button type="primary"
                   @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="setRightDialogVisible"
               width="50%"
               @close="resetTreeKey">
      <el-tree :data="rightList"
               :props="rightTreeProps"
               show-checkbox
               default-expand-all
               node-key="id"
               :default-checked-keys="defKey"
               ref="treeRef"></el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="setRight">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  created () {
    this.getRoleList()
  },
  data () {
    return {
      roleList: [],
      dialogVisible: false,
      editDialogVisible: false,
      addRoleList: {
        roleName: '',
        roleDesc: ''
      },
      addRoleRules: {
        roleName: { required: true, message: '请输入角色名称', trigger: 'blur' },
        roleDesc: { required: true, message: '请输入角色描述', trigger: 'blur' }
      },
      editRoleList: {},
      setRightDialogVisible: false,
      rightList: [],
      rightTreeProps: {
        label: 'authName',
        children: 'children'
      },
      defKey: [],
      roleId: ''

    }
  },
  methods: {
    openAddDialog () {
      this.dialogVisible = true
    },
    closeAddDialog () {
      this.dialogVisible = false
    },
    closeEditDialog () {
      this.editDialogVisible = false
    },
    async getRoleList () {
      const { data: result } = await this.$http.get('roles')
      this.roleList = result.data
    },
    resetAddForm () {
      this.$refs.addRoleRef.resetFields()
    },
    resetEditForm () {
      this.$refs.editRoleRef.resetFields()
    },
    addRole () {
      this.$refs.addRoleRef.validate(async val => {
        if (!val) return
        const { data: result } = await this.$http.post('roles', this.addRoleList)
        if (result.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
        this.dialogVisible = false
        this.getRoleList()
      })
    },
    async deleteRole (id) {
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result === 'cancel') return

      const { data: delResult } = await this.$http.delete(`roles/${id}`)
      //console.log(delResult)
      if (delResult.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('成功删除角色')
      this.getRoleList()
    },
    async checkRole (id) {
      this.editDialogVisible = true
      const { data: result } = await this.$http.get(`roles/${id}`)
      this.editRoleList = result.data
      //console.log(result)
    },
    editRole () {
      this.$refs.editRoleRef.validate(async val => {
        if (!val) return
        const { data: result } = await this.$http.put(`roles/${this.editRoleList.roleId}`, this.editRoleList)
        //console.log(result)
        if (result.meta.status !== 200) return this.$message.error('修改角色失败')
        this.$message.success('修改角色成功')
        this.editDialogVisible = false
        this.getRoleList()
      })
    },
    async removeRight (role, rightId) {
      //console.log(role)
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //console.log(result)
      if (result === 'cancel') return this.$message('取消删除')
      //console.log(role.id, rightId)
      const { data: delRes } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      //console.log(delRes)
      if (delRes.meta.status !== 200) return this.$message.error('权限取消失败')
      this.$message.success('权限取消成功')

      role.children = delRes.data
    },
    getKey (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getKey(item, arr)
      })
    },
    async showSetRightList (key) {
      this.setRightDialogVisible = true
      const { data: rightRes } = await this.$http.get('rights/tree')
      this.rightList = rightRes.data
      this.getKey(key, this.defKey)
      this.roleId = key.id

      console.log(this.$refs.temp)
    },
    resetTreeKey () {
      this.defKey = []
    },
    async setRight () {
      const allKey = [...this.$refs.treeRef.getHalfCheckedKeys(), ...this.$refs.treeRef.getCheckedKeys()]
      const allKeyStr = allKey.join(',')
      //console.log(allKey)

      const { data: result } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: allKeyStr })
      if (result.meta.status !== 200) return this.$message.error('更新用户状态失败')
      this.$message.success('更新用户状态成功')
      this.getRoleList()
      // console.log(result)
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style>
.el-tag {
  margin: 7px;
}

.center {
  display: flex;
  align-items: center;
}

.first-level {
  border-top: 2px solid #eee;
}
.first-level:last-child {
  border-bottom: 2px solid #eee;
}
.second-level {
  border-bottom: 2px solid #eee;
}
.second-level:last-child {
  border-bottom: none;
}
</style>