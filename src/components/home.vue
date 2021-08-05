<template>
  <el-container class="home-container">
    <el-header class="header"><span>后台管理系统</span>
      <el-button type="info"
                 @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'"
                class="aside">
        <div class="toggle-button"
             @click="toggle">|||</div>
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#409EFF"
                 :unique-opened="true"
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 :router="true"
                 :default-active="activePath"
                 ref="menuRef">
          <el-submenu :index="item.id + ''"
                      v-for="item in menuList"
                      :key="item.id">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span v-text="item.authName"></span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item-group v-for="itemChild in item.children"
                                :key="itemChild.id">
              <el-menu-item :index="'/' + itemChild.path"
                            @click="saveActivePath('/' + itemChild.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span v-text="itemChild.authName"></span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconList: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: '',
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  updated () {
    //this.$refs.menuRef.defaultActive = this.$route.path
    //console.log(this.$refs.menuRef)
  },
  watch: {
    '$route': 'updatePath'
  },
  methods: {
    logout () {
      window.sessionStorage.clear();
      this.$router.push('./login');
    },
    async getMenuList () {
      const { data: result } = await this.$http.get('menus');
      if (result.meta.status !== 200) return this.$message.error('res');
      this.menuList = result.data;
      //console.log(result);
    },
    toggle () {
      this.isCollapse = !this.isCollapse;
    },
    saveActivePath (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    updatePath () {
      if (this.$route.path === '/welcome') {
        //console.log('www')
        this.activePath = null
      }
      else { this.activePath = this.$route.path }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  color: #fff;
}
.aside {
  background-color: #333744;
  transition: 0.35s;
}
.main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: none;
}
.toggle-button {
  background-color: #4a5064;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  line-height: 24px;
  cursor: pointer;
}
</style>