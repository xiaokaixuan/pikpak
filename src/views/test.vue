<template>
  <div>
    <n-upload ref="uploadRef" :show-retry-button="false" @remove="moveFile" multiple :show-file-list="false" v-model:file-list="fileListRef" :default-upload="false" @change="changeFile">
        <n-upload-dragger style="width: 100vw; height: 100vh;">
          <n-upload-file-list style="text-align: left" v-if="fileListRef?.length" @click.stop="(e:Event) => e.preventDefault()"></n-upload-file-list>
          <template v-else>
            <div style="margin-bottom: 12px;">
              <n-icon size="48" :depth="3">
                <cloud-upload></cloud-upload>
              </n-icon>
            </div>
            <n-text style="font-size: 16px;">点击或者拖动文件到该区域来上传</n-text>
            <n-text type="info" style="margin: 8px 0 0 0;">
              支持链接上拼上id传到指定文件夹哦~(/t/12154sds)
            </n-text>  
            <n-p depth="3" style="margin: 8px 0 0 0;">
              请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
            </n-p>
            <n-text type="warning" style="margin: 8px 0 0 0;">
              记得解决浏览器跨域问题哦
            </n-text>  
          </template>
        </n-upload-dragger>
    </n-upload>
</div>
</template>

<script lang="ts" setup>
  import Gcid from '../utils/gcid.worker?worker'
  import * as Comlink from 'comlink'
  import {  NUpload, UploadFileInfo, NUploadDragger, NUploadFileList, NIcon, NP, NText } from 'naive-ui'
  import { ref } from '@vue/reactivity'
  import http from '../utils/axios'
  import OSS from 'ali-oss'
  import { useRoute } from 'vue-router'
import { CloudUpload } from '@vicons/tabler'

  const uploadRef = ref()
  const route = useRoute()
  const fileListRef = ref<UploadFileInfo[]>()
  const max = ref(5)
  const uploadig = ref(0)
  const fileUpload = ref<{
    [key:string]: {
      oss?: any,
      gcid?: number,
      hash?: string,
      retry?: number
    }
  }>({})
  const changeFile = async ({fileList}:{fileList:UploadFileInfo[]}) => {
    fileListRef.value = fileList
    const maxLengt = fileList.length > max.value ? max.value : fileList.length
    for(let i= uploadig.value; i< maxLengt; i++){
      postFile()
    }
  }
  const postFile = async () => {
    if(uploadig.value >= max.value){
      return false
    }
    let fileInfo:UploadFileInfo | undefined = undefined
    if(fileListRef.value) {
      for(let i in fileListRef.value) {
        if(fileListRef.value[i].status === 'pending') {
          fileInfo = fileListRef.value[i]
          break
        }
      }
    }
    if(!fileInfo) {
      max.value = 1
      console.log(max.value, uploadig.value)
      if(uploadig.value >= max.value) {
        return false
      }
      if(fileListRef.value) {
        for(let i in fileListRef.value) {
          if(fileListRef.value[i].status === 'error' && (fileUpload.value[fileListRef.value[i].id].retry || 0) < 3) {
            fileUpload.value[fileListRef.value[i].id].retry  = (fileUpload.value[fileListRef.value[i].id].retry || 0) + 1
            console.log(fileUpload.value[fileListRef.value[i].id])
            fileInfo = fileListRef.value[i]
            console.log(fileInfo.status)
            break
          }
        }
      }
    }
    
    if(!fileInfo) {
      return false
    }
    fileInfo.status = 'uploading'
    uploadig.value++
    if(!fileUpload.value[fileInfo.id]) {
      fileUpload.value[fileInfo.id] = {
        gcid: 0
      }
    }
    let gcidItem = fileUpload.value[fileInfo.id].hash
    if(!gcidItem) {
      const gcid:any = Comlink.wrap(new Gcid())
      gcidItem = await gcid(fileInfo.file, Comlink.proxy({
        progress: (p:number) => {
          if(fileInfo) {
            if(fileInfo.name.indexOf('-正在效验文件') === -1) {
              fileInfo.name = fileInfo.name + '-正在效验文件'
            }
            fileInfo.percentage = p * 100
          }
        }
      }))
    }
    fileInfo.name = fileInfo.name.replace('-正在效验文件', '').replace('-正在上传文件', '')
    fileUpload.value[fileInfo.id].gcid = 100
    console.log(fileInfo)
    if(fileInfo.status !== 'uploading') {
      postFile()
      return false
    }
    try {
      const localStorageKey = 'pikpakUpload-' + gcidItem
      let uplodaInfo:any = window.localStorage.getItem(localStorageKey)
      uplodaInfo = uplodaInfo && JSON.parse(uplodaInfo)
      if(!uplodaInfo?.data?.resumable?.params?.expiration || new Date(uplodaInfo?.data?.resumable?.params?.expiration) < new Date()) {
        uplodaInfo = false
      }
      if(!uplodaInfo) {
        let postData = {
            kind: "drive#file",
            parent_id: route.params.id || undefined,
            name: fileInfo.name,
            size: fileInfo.file?.size,
            hash: gcidItem,
            upload_type: "UPLOAD_TYPE_RESUMABLE",
            objProvider: {
                provider: "UPLOAD_TYPE_UNKNOWN"
            }
        }
        uplodaInfo = await http.post('https://api-drive.mypikpak.com/drive/v1/files', postData)
      }
      const {upload_type, resumable} = uplodaInfo.data
      if(upload_type === 'UPLOAD_TYPE_RESUMABLE') {
        const oss = new OSS({
            accessKeyId: resumable.params.access_key_id,
            accessKeySecret: resumable.params.access_key_secret,
            bucket: resumable.params.bucket,
            endpoint: resumable.params.endpoint,
            stsToken: resumable.params.security_token,
            cname: true,
            secure: true
          })
          fileUpload.value[fileInfo.id].oss = oss
          try {
            const ossPrarams:any = {
              partSize: 1024000,
              parallel: 3,
              timeout:  60000,
              progress: (p:number, checkpoint:object) => {
                if(fileInfo) {
                  if(fileInfo.name.indexOf('-正在上传文件') === -1) {
                     fileInfo.name = fileInfo.name.replace('-正在效验文件', '') + '-正在上传文件'
                  }
                  fileInfo.status = 'uploading'
                  fileInfo.percentage = p * 100
                }
                if(checkpoint) {
                  uplodaInfo.data.checkpoint = checkpoint
                  window.localStorage.setItem(localStorageKey, JSON.stringify(uplodaInfo))
                }
              }
            }
            if(uplodaInfo.data.checkpoint) {
              ossPrarams['checkpoint'] = uplodaInfo.data.checkpoint
            }
            const result = await oss.multipartUpload(resumable.params.key, fileInfo.file, ossPrarams)
            fileInfo.status = 'finished'
            fileInfo.percentage = 100
            uploadig.value--
            fileInfo.name = fileInfo.name.replace('-正在效验文件', '').replace('-正在上传文件', '')
            window.localStorage.removeItem(localStorageKey)
            postFile()
            console.log(result)
          } catch (error) {
            console.log(error)
            uploadig.value--
            fileInfo.name = fileInfo.name.replace('-正在效验文件', '').replace('-正在上传文件', '')
            fileInfo.status = 'error'
            if((fileUpload.value[fileInfo.id].retry || 0) < 3) {
              window.$message.error('稍后会重试' + fileInfo.name)
            }
            postFile()
          }
      } else {
        fileInfo.name = fileInfo.name.replace('-正在效验文件', '').replace('-正在上传文件', '')
        fileInfo.status = 'finished'
        fileInfo.percentage = 100
        uploadig.value--
        window.localStorage.removeItem(localStorageKey)
        postFile()
      }
    } catch (error) {
      
    }
  }
  const moveFile = ({file}:{file:UploadFileInfo}) => {
    if(file.status === 'uploading' && file.id && uploadig.value && fileUpload.value[file.id]) {
      fileUpload.value[file.id].oss.cancel()
    }
    if(fileListRef.value) {
      for(let i in fileListRef.value) {
        if(fileListRef.value[i].id === file.id) {
          fileListRef.value[i].status = 'removed'
          break
        }
      }
    }
    
  }
</script>