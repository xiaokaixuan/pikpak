<template>
  <n-spin :show="loading && !password" description="获取中">
    <div class="share-info-page">
      
      <template v-if="noFile">
        <div class="share-file-box" style="height: 100vh">
          <n-empty description="分享链接错误或已失效">
            <template #icon>
            <n-icon>
              <file-analytics></file-analytics>
            </n-icon>
          </template>
          <template #extra>
            <n-button size="small" @click="goHome">去首页</n-button>
          </template>
        </n-empty>
        </div>
      </template>
      <template v-else-if="shareInfo.needPassword">
        <div class="share-password">
          <a href="https://mypikpak.com/" target="_blank" class="logo-box">
            <img src="https://www.mypikpak.com/logo.png" class="logo-box__icon" alt="">
            <div class="logo-box__text">PikPak</div>
          </a>
          <n-form class="password-form">
            <n-form-item label="请输入提取码" >
              <n-input-group>
                <n-input v-model:value="password" type="password" show-password-on="mousedown" @keyup.enter="getInfo" placeholder="请输入提取码"></n-input>
                <n-button type="primary" :loading="loading && password" @click="getInfo">提取文件</n-button>
              </n-input-group>
            </n-form-item>
          </n-form>
        </div>
      </template>
      <template v-else-if="shareInfo.info">
        <n-card style="width: 100vw; height: 100vh;" :title="shareInfo.info.name">
          <template #header-extra> 
            <n-space>
              <n-button  @click="openPot" v-if="shareInfo.info.mime_type.indexOf('video') !== -1">打开PotPlayer</n-button>
              <n-button @click="saveFile">保存到网盘</n-button>
              <n-button  @click="downFile">下载</n-button>
            </n-space>
          </template>
          <div style="width: 100%; height: 100%" v-if="shareInfo.info.mime_type.indexOf('video') !== -1 || shareInfo.info.mime_type.indexOf('audio') !== -1">
            <plyr-vue :video="shareInfo.info"></plyr-vue>
          </div>
          <template v-else>
            <div class="share-file-box">
              <img :src="shareInfo.info?.web_content_link" v-if="shareInfo.info.mime_type.indexOf('image') !== -1" style="max-width: 100%; max-height: 100%">
              <template v-else>
                  <n-empty description="当前文件不支持预览">
                    <template #icon>
                      <n-icon>
                        <file-analytics></file-analytics>
                      </n-icon>
                    </template>
                    <template #extra>
                      <n-button size="small" @click="downFile">立即下载</n-button>
                    </template>
                  </n-empty>
              </template>
            </div>
          </template>
        </n-card>
      </template>
    </div>
  </n-spin>
</template>

<script setup lang="ts">
import { computed, ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import axios from 'axios'
import { NInput, NInputGroup, NButton, NForm, NFormItem, NCard, NSpin, NSpace, NIcon, NEmpty } from 'naive-ui'
import { useRoute } from 'vue-router'
import PlyrVue from '../components/Plyr.vue'
import streamSaver from 'streamsaver'
import http from '../utils/axios'
import { FileAlert, FileAnalytics } from '@vicons/tabler'

const route = useRoute()
const id = computed(() => route.params.id)
const shareInfo = ref<{
  [key:string]:any  
}>({
  needPassword: true
})
const loading = ref(false)
const password = ref()
const noFile = ref(false)
const getInfo = () => {
  const localShare = JSON.parse(window.localStorage.getItem('pikpakShare-' + id.value) || '{}')
  if(localShare && localShare.Name) {
    shareInfo.value = localShare
    return new Promise((resolve) =>  resolve(localShare))
  }
  loading.value = true
  axios.get('https://pikpak-depot.z10.workers.dev', {
    params: {
      page_id: id.value,
      password: password.value || undefined
    }
  })
    .then((res:any) => {
      res.data.needPassword = res.data.needPassword || false
      if(res.data.needPassword && password.value) {
        window.$message.error('提取码错误')
      }
      if(res.data.info && JSON.parse(res.data.info)) {
        res.data.info = JSON.parse(res.data.info)
      }
      if(res.data.info2 && JSON.parse(res.data.info2)) {
        res.data.info = Object.assign(res.data.info, JSON.parse(res.data.info2))
        delete res.data.info2
      }
      if(res.data.info3 && JSON.parse(res.data.info3)) {
        res.data.info = Object.assign(res.data.info, JSON.parse(res.data.info3))
        delete res.data.info3
      }
      shareInfo.value = res.data
      if(!shareInfo.value.needPassword && shareInfo.value.Name) {
        window.localStorage.setItem('pikpakShare-' + id.value, JSON.stringify(shareInfo.value))
      }
    })
    .catch((error:any) => {
      window.$message.error(error.response.data.error)
      noFile.value = true
    })
    .finally(() => {
      loading.value = false
    })
}
const downFile = () => {
  streamSaver.mitm = 'mitm.html'
  const fileStream = streamSaver.createWriteStream(shareInfo.value.info.name)
  fetch(shareInfo.value.info.web_content_link).then((res:any) => {
    if(!window.$downId) {
      window.$downId = []
    }
    window.$downId.push(shareInfo.value.info.id)
    const readableStream = res.body
    // more optimized
    if (window.WritableStream && readableStream?.pipeTo) {
      return readableStream.pipeTo(fileStream)
        .then(() => {
          window.$downId.splice(window.$downId.indexOf(shareInfo.value.info.id), 1)
        })
    }

    const writer = fileStream.getWriter()

    const reader = res.body.getReader()
    const pump = () => reader.read()
      .then((res:any) => {
        if(res.done) {
          writer.close()
        } else {
          writer.write(res.value).then(pump)
        }
      })

    pump()
  })
}
const saveFile = () => {
  let postData = {
    kind: "drive#file",
    name: shareInfo.value.info.name,
    size: shareInfo.value.info.size,
    hash: shareInfo.value.info.hash,
    upload_type: "UPLOAD_TYPE_RESUMABLE",
    objProvider: {
        provider: "UPLOAD_TYPE_UNKNOWN"
    }
  }
   http.post('https://api-drive.mypikpak.com/drive/v1/files', postData)
      .then((res:any) => {
        window.$message.success('添加成功')
      })
}
const openPot = () => {
  window.open('potplayer://' + shareInfo.value.info.web_content_link)
}
const goHome = () => {
  window.location.href = './'
}
onMounted(() => {
  getInfo()
  window.onbeforeunload = function (e) {
    if(!window.$downId || window.$downId.length === 0) {
      return null
    }
    e = e || window.event;

    // 兼容IE8和Firefox 4之前的版本
    if (e) {
      e.returnValue = '还有待下载文件'
    }

    // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
    return '还有待下载文件?'
  }
})
</script>

<style lang="scss">
.share-info-page {
  background-color: #eef2f6;
  min-height: 100vh;
  .share-file-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .n-alert-body__title {
    word-break: break-all;
  }
}
.share-password {
  width: 460px;
  margin: 0 auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .logo-box {
    display: flex;
    align-items: center;
    /* margin: auto; */
    justify-content: center; 
    margin-bottom: 8px;
    margin-left: 30px;
    margin-top: 0;
    margin-right: 0;
    &__icon {
      width: 60PX;
      height: 60PX;
      margin-right: 10PX
    }
    &__text {
      font-size: 30PX;
      letter-spacing: -1.25PX;
      color: #000;
    }
  }
  .password-form {
    background-color: #fff;
    margin-top: 40px;
    border-radius: 10px;
    padding: 20px;
  }
}
</style>