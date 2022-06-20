<template>
  <div class="login-page">
    <div class="down">
      <img src="../assets/phone-pc2.png" >
    </div>
    <div class="login"> 
      <div class="logo-box">
        <img src="data:image/png;base64,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" class="logo-box__icon" alt="">
        <div class="logo-box__text">PikPak</div>
      </div>
      <div class="login-box">
        <n-form label-align="left" label-placement="left" label-width="0" class="login-form">
          <n-form-item label="">
            <n-input v-model:value="loginData.username" placeholder="请输入邮箱"></n-input>
          </n-form-item>
          <n-form-item label="">
            <n-input v-model:value="loginData.password" placeholder="请输入密码" @keyup.enter="loginPost" type="password" show-password-on="mousedown"></n-input>
          </n-form-item>
          <n-form-item label="">
            <n-checkbox v-model:checked="remember" @update:checked="showMessage">记住登陆</n-checkbox>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" class="block" :loading="loading" @click="loginPost">登陆</n-button>
          </n-form-item>
          <n-form-item label="">
            <a target="_blank" href="https://i.mypikpak.com/v1/file/center/account/v1/password/?type=forget_password&locale=zh-cn" class="forget-password">忘记密码</a>
            <!--<router-link to="/register" class="register">注册</router-link>-->
            <a href="javascript:;" @click="getApk">去下载注册得5天VIP</a>
          </n-form-item>
        </n-form>
        <div class="login-other">
          <n-space inline>
            <n-tooltip >
              <template #trigger>
                <router-link to="sms">
                  <n-icon color="#306eff" :size="32">
                   <phone></phone>
                  </n-icon>
                </router-link>
              </template>
              手机登陆
            </n-tooltip>
            <n-tooltip >
              <template #trigger>
                <n-icon color="#306eff" :size="32">
                  <brand-google></brand-google>
                </n-icon>
              </template>
              APP内谷歌登录的账号请先通过忘记密码设置密码后登录
            </n-tooltip>
          </n-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from '@vue/reactivity';
import { NForm, NFormItem, NInput, NButton, useMessage, NCheckbox, useDialog, NTooltip, NIcon, NSpace } from 'naive-ui'
import http from '../utils/axios'
import { useRoute, useRouter } from 'vue-router'
import { BrandGoogle, Phone } from '@vicons/tabler'
const loginData = ref({
  username: '',
  password: ''
})
const route  = useRoute()
const loading = ref(false)
const router = useRouter()
const message = useMessage()
const loginPost = () => {
  if(!loginData.value.password || !loginData.value.username) {
    return false
  }
  loading.value = true
  http.post('https://user.mypikpak.com/v1/auth/signin', {
    "captcha_token": "",
    "client_id": "YNxT9w7GMdWvEOKa",
    "client_secret": "dbw2OtmVEeuUvIptb1Coyg",
    ...loginData.value
  })
    .then((res:any) => {
      if(res.data && res.data.access_token) {
        window.localStorage.setItem('pikpakLogin', JSON.stringify(res.data))
        if(remember.value) {
          window.localStorage.setItem('pikpakLoginData', JSON.stringify(loginData.value))
        } else {
          window.localStorage.removeItem('pikpakLoginData')
        }
        message.success('登录成功')
        router.push((route.query.redirect || '/') + '')
      }
    })
    .catch(() => {
      loading.value = false
    })
}
const remember = ref(false)
const dialog = useDialog()
const showMessage = () => {
  if(remember.value) {
    dialog.warning({
        title: '警告',
        content: '记住登陆是指浏览器本地明文保存用户名密码用于下次自动登陆，请勿在非信任设备选择',
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: () => {
        },
        onNegativeClick: () => {
          remember.value = false
        },
      })
  }
}
const getApk = () => {
  http.get('https://api-drive.mypikpak.com/package/v1/apk/url/225815')
    .then((res:any) => {
      window.open(res.data.apk_url)
    })
}
</script>

<style >
  .login-page {
    background-color: #306eff;
     box-sizing: border-box;
    min-height: 100vh;
    width: 100%;
    padding-top: 0px;
    display: flex;
    align-items: flex-start;
    /* align-items: center; */
    flex-direction: row;
    justify-content: center;
    position: relative;
    min-width: 375px;
  }
  .login-page .down {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-right: 49px;
    margin-left: 28px;
  }
  .login-page .down img {
    max-width: 56.5625vw;
    max-height: calc(100vh - 200px);
  }
  .login-page .logo-box {
    display: flex;
    align-items: center;
    margin: 140px auto 0;
    justify-content: center;
  }
  .login-page .logo-box__icon {
    width: 50PX;
    height: 50PX;
    margin-right: 16PX
  }
  .login-page .logo-box__text {
    font-family: PingFangSC-Semibold;
    font-size: 40PX;
    letter-spacing: -1.25PX;
    color: #fff;
  }
  .login-page .login-box {
    margin-top: 60px;
    background: #fff;
    border-radius: 20px;
    width: 348px;
    position: relative;
  }
  .login-page .login-form {
    position: relative;
    overflow: hidden;
    padding-top: 60px;
    padding-left: 22px;
    padding-right: 22px;
    padding-bottom: 40px;
  }
  .login-page .login-form  button.block {
    width: 100%;
  }
  .login-page .n-form-item:nth-last-child(1) .n-form-item-blank {
    margin-top: -10px;
    justify-content: space-between;
  }
  .login-page .n-form-item a {
    color: #306eff;
  }
  .login-box .login-other {
    margin-top: -50px;
    text-align: center;
    padding-bottom: 10px;
  }
  @media(max-width: 968px) {
    .login-page {
      justify-content: flex-end;
      flex-direction: column-reverse;
      align-items: center;
    }
    .login-page .logo-box {
      margin-top: 40px;
    }
  }
</style>
