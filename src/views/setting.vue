<template>
  <div class="list-page">
    <n-collapse :default-expanded-names="['0', '2']">
      <n-collapse-item name="0" title="aria2设置">
        <n-form label-width="100px" label-align="left" label-placement="left">
          <n-form-item label="aria2链接">
            <n-input v-model:value="aria2Data.host" placeholder="例如http://localhost:6800/jsonrpc"></n-input>
          </n-form-item>
          <n-form-item label="aria2Token">
            <n-input v-model:value="aria2Data.token" type="password" show-password-on="mousedown"></n-input>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="testAria2">测试并保存</n-button>
          </n-form-item>
        </n-form>
      </n-collapse-item>
      <n-collapse-item name="1" title="自动登录设置">
        <n-form label-width="100px" label-align="left" label-placement="left">
          <n-form-item label="是否开启">
            <n-switch v-model:value="loginSwitch"></n-switch>
          </n-form-item>
          <template v-if="loginSwitch">
            <n-form-item label="用户名">
              <n-input v-model:value="loginData.username" placeholder="用户名"></n-input>
            </n-form-item>
            <n-form-item label="密码">
              <n-input v-model:value="loginData.password" type="password" show-password-on="mousedown"></n-input>
            </n-form-item>
          </template>
          <n-form-item>
            <n-button type="primary" @click="loginPost">保存</n-button>
          </n-form-item>
        </n-form>
      </n-collapse-item>
      <n-collapse-item title="关于" name="2">
        <n-space>
          <a href="https://mypikpak.com/" target="_blank" class="n-button">官方网站</a>
          <a href="https://t.me/pikpak_userservice" target="_blank" class="n-button">官方交流群</a>
          <a href="https://github.com/mumuchenchen/pikpak" target="_blank" class="n-button">开源仓库</a>
          <a href="https://t.me/mumuchenchen" target="_blank">问题反馈</a>
        </n-space>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { NForm, NFormItem, NButton, NInput, NCollapse, NCollapseItem, NSpace, NSwitch, useDialog } from 'naive-ui'
const aria2Data = ref({
  host: '',
  token: ''
})
const testAria2 = () => {
  let postData:any = {
      id:'',
      jsonrpc:'2.0',
      method:'aria2.getGlobalStat',
      params:[]
  }
  if(aria2Data.value.token) {
    postData.params.splice(0, 0, 'token:' + aria2Data.value.token)
  }
  fetch(aria2Data.value.host, {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
    .then(response => response.json())
    .then(res => {
      if(res.error && res.error.message) {
        window.$message.error(res.error.message)
      } else if(res.result) {
        window.localStorage.setItem('pikpakAria2', JSON.stringify(aria2Data.value))
        window.$message.success('保存成功')
      }
    })
    .catch(error => console.error('Error:', error))
}
const loginSwitch = ref(false)
const loginData = ref({
  username: '',
  password: ''
})
const dialog = useDialog()
const loginPost = () => {
  if(loginSwitch.value) {
    dialog.warning({
      title: '警告',
      content: '记住登陆是指浏览器本地明文保存用户名密码用于下次自动登陆，请勿在非信任设备选择',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: () => {
      },
      onNegativeClick: () => {
        window.localStorage.setItem('pikpakLoginData', JSON.stringify(loginData.value))
      },
    })
  } else {
    window.localStorage.removeItem('pikpakLoginData')
  }
}
onMounted(() => {
  let aria2 = JSON.parse(window.localStorage.getItem('pikpakAria2') || '{}')
  if(aria2.host) {
    aria2Data.value = aria2
  }
  let login = JSON.parse(window.localStorage.getItem('pikpakLoginData') || '{}')
  if(login.username && login.password) {
    loginData.value = login
    loginSwitch.value = true 
  }
})
</script>

<style>
.list-page {
  padding: 40px;
}

@media(max-width: 968px) {
  .list-page {
    padding: 10px;
  }
}
</style>