<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png"
             alt="">
      </div>
      <el-form class="login-form"
               :model="loginForm"
               :rules="loginFormRules"
               ref="loginFormRef">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"
                    placeholder="用户名"
                    prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password"
                    placeholder="密码"
                    prefix-icon="iconfont icon-3702mima"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary"
                     @click="login">登录</el-button>
          <el-button type="info"
                     @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],

        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
      }

    }
  },
  methods: {
    reset () {
      this.$refs.loginFormRef.resetFields();
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: result } = await this.$http.post('login', this.loginForm);
        //console.log(result);
        if (result.meta.status === 400) return this.$message({ message: '登录失败', type: "warning" });
        this.$message({ message: '登录成功', type: "success" })
        // 登录成功后 1.存储toker到sessionStorage 2.跳转到home
        window.sessionStorage.setItem('token', result.data.token);
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  > .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: relative;
    > .login-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      > .btn {
        display: flex;
        justify-content: flex-end;
      }
    }
    > .avatar-box {
      background-color: #fff;
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
</style>
