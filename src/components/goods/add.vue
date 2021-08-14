<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="添加商品信息"
                type="info"
                show-icon
                :closable="false"
                :center="true">
      </el-alert>

      <el-steps :space="200"
                :active="activeIndex - 0"
                finish-status="success"
                :align-center="true">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addForm"
               :rules="addFormRule"
               ref="addFormRef"
               label-width="100px"
               label-position="top">
        <el-tabs :tab-position="'left'"
                 v-model="activeIndex"
                 :before-leave="checkChange"
                 @tab-click="tabClick">
          <el-tab-pane label="基本信息"
                       name="0">
            <el-form-item label="商品名称"
                          prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格"
                          prop="goods_price">
              <el-input v-model="addForm.goods_price"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量"
                          prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"
                          prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类"
                          prop="goods_cat">
              <el-cascader v-model="selectedCat"
                           :options="cateList"
                           :props="cascaderProps"
                           @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数"
                       name="1">
            <el-form-item v-for="item in manyTable"
                          :key="item.attr_id"
                          :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="el"
                             v-for="(el, index) in item.attr_vals"
                             :key="index"
                             border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性"
                       name="2">
            <el-form-item v-for="item in onlyTable"
                          :key="item.attr_id"
                          :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片"
                       name="3">
            <el-upload action="http://47.98.178.81:8888/api/private/v1/upload"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       list-type="picture"
                       :headers="headerObj"
                       :on-success="handleSuccess">
              <el-button size="small"
                         type="primary">点击上传</el-button>
            </el-upload>

          </el-tab-pane>
          <el-tab-pane label="商品内容"
                       name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary"
                       style="margin-top: 15px"
                       @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览"
               :visible.sync="showImgDialogVisible"
               width="50%">
      <img :src="previewURL"
           alt=""
           class="previewImg">
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
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: '',
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRule: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }]
      },
      cateList: [],
      selectedCat: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id'
      },
      manyTable: [],
      onlyTable: [],
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewURL: '',
      showImgDialogVisible: false,
      attrs: []
    }
  },
  methods: {
    async getCateList () {
      const { data: result } = await this.$http.get('categories')
      this.cateList = result.data
      //console.log(this.cateList)
    },
    handleChange () {
      //console.log(this.selectedCat)
      if (this.selectedCat.length !== 3) {
        this.selectedCat = []
      }
      //console.log(this.selectedCat)
    },
    checkChange (activeName, oldActiveName) {
      //console.log(this.selectedCat)
      //console.log(activeName, oldActiveName)
      if (oldActiveName === '0' && this.selectedCat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
      return true
    },
    async getManyTable () {
      const { data: result } = await this.$http.get(`categories/${this.selectedCat[2]}/attributes`, { params: { sel: 'many' } })
      result.data.forEach(item => {
        if (item.attr_vals) {
          item.attr_vals = item.attr_vals.split(',')
        }
      });
      this.manyTable = result.data
      this.manyTable.forEach(item => {
        const addManyItem = {
          attr_id: '',
          attr_value: ''
        }
        addManyItem.attr_id = item.attr_id
        if (item.attr_vals) {
          addManyItem.attr_value = item.attr_vals.join(',')
        } else {
          addManyItem.attr_value = ''
        }
        //console.log(addManyItem)
        this.addForm.attrs.push(addManyItem)
      })
      //console.log(this.manyTable)
    },
    async getOnlyTable () {
      const { data: result } = await this.$http.get(`categories/${this.selectedCat[2]}/attributes`, { params: { sel: 'only' } })
      this.onlyTable = result.data
      //console.log(this.onlyTable)
      this.onlyTable.forEach(item => {
        const addOnlyItem = {
          attr_id: '',
          attr_value: ''
        }
        addOnlyItem.attr_id = item.attr_id
        if (item.attr_vals) {
          addOnlyItem.attr_value = item.attr_vals
        } else {
          addOnlyItem.attr_value = ''
        }
        this.addForm.attrs.push(addOnlyItem)
      })
      //console.log(this.onlyTable)
    },
    tabClick () {
      if (this.activeIndex === '1') {
        this.getManyTable()
      }
      if (this.activeIndex === '2') {
        this.getOnlyTable()
      }
    },
    handlePreview (file) {
      //console.log(file)
      this.showImgDialogVisible = true
      this.previewURL = file.response.data.url
    },
    handleRemove (file) {
      //console.log(file)
      const imgPath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === imgPath)
      this.addForm.pics.splice(i, 1)
      //console.log(this.addForm)
    },
    handleSuccess (response) {
      //console.log(response)
      const img = { pic: response.data.tmp_path }
      this.addForm.pics.push(img)
      //console.log(this.addForm)
    },
    add () {
      this.$refs.addFormRef.validate(async val => {
        if (!val) return this.$message.error('请填写必填项')
        this.addForm.goods_cat = this.selectedCat.join(',')
        console.log(this.addForm)
        const { data: result } = await this.$http.post('goods', this.addForm)
        console.log(result)
        if (result.meta.status !== 201) return this.$message.error(`${result.meta.msg}`)
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style>
.el-step {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.ql-editor {
  min-height: 300px;
}
</style>