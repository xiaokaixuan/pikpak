<template>
  <n-spin :show="loading " description="获取中">
    <div class="share-info-page" >
      <div class="header" v-if="shareInfo?.share_status === 'OK'">
        <div class="title n-ellipsis">
          <n-breadcrumb separator=">">
            <n-breadcrumb-item>
              <router-link :to="{query: {id: ''}}">全部文件</router-link>
            </n-breadcrumb-item>
          </n-breadcrumb>
          <n-text  depth="3" style="font-size: 12px">
            失效时间： {{shareInfo?.expiration_left === '-1' ? '永久有效' : (shareInfo?.expiration_left + '天')}} 失效次数：{{shareInfo?.restore_count_left === '-1' ? '无限次' : (shareInfo?.restore_count_left + '次')}}
          </n-text>
        </div>
        <div class="action">
          <n-button type="primary" @click="restore">{{checkedRowKeys.length ? '转存已选' : '转存全部'}}</n-button>
        </div>
      </div>
      <template v-if="shareInfo?.share_status === 'PASS_CODE_EMPTY' || shareInfo?.share_status === 'PASS_CODE_ERROR'">
        <div class="share-password">
          <a href="https://mypikpak.com/" target="_blank" class="logo-box">
            <img src="https://www.mypikpak.com/logo.png" class="logo-box__icon" alt="">
            <div class="logo-box__text">PikPak</div>
          </a>
          <n-form class="password-form">
            <n-form-item label="请输入提取码" >
              <n-input-group>
                <n-input v-model:value="password" type="password" show-password-on="mousedown" @keyup.enter="getInfo" placeholder="请输入提取码"></n-input>
                <n-button type="primary" :loading="loading && !!password" @click="getInfo">提取文件</n-button>
              </n-input-group>
            </n-form-item>
          </n-form>
        </div>
      </template>
      <template v-else-if="shareInfo?.share_status === 'DELETED'">
        <div class="share-file-box" style="height: 100vh">
          <n-empty description="抱歉，该分享已被作者删除">
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
      <template v-else-if="shareInfo?.share_status === 'OK'">
        <n-scrollbar style="max-height: calc(100vh - 110px);" @scroll="scrollHandle">
          <n-data-table v-model:checked-row-keys="checkedRowKeys"  :row-key="row => row.id" :data="fileList" size="small" :columns="columns" :bordered="false"></n-data-table>
          <!-- <div class="loading" v-if="loading">
            <n-spin size="small" />加载中
          </div> -->
        </n-scrollbar>
      </template>
    </div>
  </n-spin>
</template>

<script setup lang="ts">
import { computed, ref } from '@vue/reactivity'
import { h, onMounted, watch } from '@vue/runtime-core'
import axios, { AxiosResponse } from 'axios'
import { NInput, NInputGroup, NButton, NForm, NText, NFormItem, NScrollbar, NDataTable, NSpin, NSpace, NIcon, NEmpty, DataTableColumns, NTime, NEllipsis, NBreadcrumb, NBreadcrumbItem } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import streamSaver from 'streamsaver'
import http from '../utils/axios'
import { FileAnalytics } from '@vicons/tabler'
import { byteConvert } from '../utils'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)
interface ShareInfo {
  share_status: 'PASS_CODE_EMPTY' | 'OK' | 'DELETED' | 'PASS_CODE_ERROR',
  files?: any[],
  file_num: string,
  expiration_left: string,
  restore_count_left: string,
  next_page_token: string,
  title: string,
  user_info: {
    avatar: string,
    nickname: string,
    portrait_url: string,
    user_id: string
  } | undefined
  [key:string]:any  
}
const shareInfo = ref<ShareInfo>()
const loading = ref(true)
const password = ref('')
const checkedRowKeys = ref<string[]>([])
const fileList = ref<any[]>([])
const ancestorId = ref('')
const columns = ref<DataTableColumns>([
  {
    type: 'selection'
  },
  {
    title: '名称',
    key: 'name',
    sorter: 'default',
    render: (row:any) => {
      return h('div', {
        class: 'file-info',
        onClick: () => {
          if(row.kind === 'drive#folder') {
            if(!route.query.id) {
              ancestorId.value = row.id
            }
            router.push({
              name: 'shareInfo',
              params: route.params,
              query: {
                id: row.id
              }
            })
          }
        }
      }, [
        h('img', {
          src: row.thumbnail_link || row.icon_link
        }),
        h(NEllipsis, {
            class: 'title',
          },
          {
            default: () => String(row.name)
          }
        ),
        h('span', {
          class: 'action'
        }, '1')
      ])
    }
  },
  {
    title: '大小',
    key: 'size',
    sorter: (rowA:any, rowB:any) => {
      return rowA.size - rowB.size
    },
    align: 'right',
    render: (row) => Number(row.size) > 0 ? byteConvert(Number(row.size)) : '',
    className: 'size',
    width: 100
  },


  {
    title: '修改时间',
    key: 'modified_time',
    sorter: 'default',
    align: 'right',
    render: (row) => {
      return h(NTime, {
        time: new Date(String(row.modified_time) || ''),
        format: 'MM-dd HH:MM',
      })
    },
    className: 'modified_time',
    width: 160
  },
  {
    title: '',
    key: 'action',
    width: 60,
    align: 'right',
    render: (row:any) => h(NSpace, {
      justify: "end"
    }, {
      default: () => [
      ]
    })
  }
])
const getInfo = () => {
  if(shareInfo.value?.share_status !== 'OK' && route.query.id) {
    return router.push({
      name: 'shareInfo',
      params: route.params,
      query: {
        id: ''
      }
    })
  }
  loading.value = true;
  (http.get('https://api-drive.mypikpak.com/drive/v1/share' + (route.query.id && shareInfo.value?.pass_code_token ? '/detail' : ''), {
      params: {
        share_id: id.value,
        parent_id: route.query.id,
        pass_code_token: shareInfo.value?.pass_code_token || undefined,
        pass_code: shareInfo.value?.pass_code_token ? undefined : password.value,
        limit: '30',
        page_token: shareInfo.value?.next_page_token
      }
  }) as Promise<AxiosResponse<ShareInfo>>)
    .then((res) => {
      const {files, ...other} = res.data
      const preToken = shareInfo.value?.next_page_token
      shareInfo.value = Object.assign(shareInfo.value || {}, other)
      if(res.data.share_status === 'OK') {
        if(!preToken) {
          fileList.value =  []
        }
          fileList.value = fileList.value.concat(files)
      } else {
        window.$message.error(res.data.share_status)
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const scrollHandle = (e:any) =>  {
  if(e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight - 30) {
    if(shareInfo.value?.next_page_token && !loading.value) {
      getInfo()
    }
  }
}
const restore = () => {
  const ancestor_ids:any = []
  if(route.query.id) {
    ancestor_ids.push(ancestorId.value)
  }
  http.post('https://api-drive.mypikpak.com/drive/v1/share/restore', {
    share_id: id.value,
    pass_code_token: shareInfo.value?.pass_code_token,
    ancestor_ids: ancestor_ids,
    file_ids: checkedRowKeys.value || undefined,
    folder_type: "DOWNLOAD"
  })
    .then(res => {
      window.$message.success('转存成功，可能需要等待一段时间')
      checkedRowKeys.value = []
    })
    
}
watch(route, (oldValue, newValue) => {
  password.value = String(route.params.password) || ''
  checkedRowKeys.value = []
  if(shareInfo.value) {
    shareInfo.value.next_page_token = ''
    shareInfo.value.files = []
  }
  getInfo()
})
const goHome = () => {
  window.location.href = './'
}
const postShare = () => [
  http.post('https://api-drive.mypikpak.com/drive/v1/share', {
      "share_to":"copy",
      "title":"云盘资源分享",
      "restore_limit":"-1",
      "expiration_days":"-1",
      "withCaptcha":true,
      "withCredentials":true,
      file_ids: ['VMqQ3U0hADAqJ0hiTMAfWVS1o1','VMqQ3U0WADAqJ0hiTMAfWVRyo1', 'VMqQ3U0KADAqJ0hiTMAfWVRuo1']
    })
      .then(res => {
        console.log(res.data)
      })
]
onMounted(() => {
  password.value = String(route.params.password) || ''
  ancestorId.value = ''
  getInfo()
  // postShare()
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
  padding: 20px;
  box-sizing: border-box;
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

<style>

.header {
  height: 40px;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  justify-content: space-between;
  white-space: nowrap;
  flex-shrink: 0;
  font-size: 16px;
}
.header .title {
  flex: 1;
  width: 0;
  text-overflow: ellipsis;
  margin-right: 20px;
}
.header .action {
  font-size: 24px;
}
.n-data-table-td {
  cursor: pointer;
}
.n-data-table-td.modified_time,.n-data-table-th.modified_time {
  color: rgba(37, 38, 43, 0.36);
}
.n-data-table-td.size,.n-data-table-th.szie {
  color: rgba(37, 38, 43, 0.36);
}
.file-info {
  display: flex;
  align-items: center;
}
.file-info img {
  width: 28px;
  height: 28px;
  margin-right: 20px;
}
.file-info .title {
  flex: 1;
  width: 0;
}
.file-info .action {
  display: none;
}
 .loading {
  margin-top: 20px;
  text-align: center;
  color: rgba(37, 38, 43, 0.36);
}
 .loading .n-spin-body {
  vertical-align: middle;
  margin-right: 10px;
}
.list-page-files {
  padding-bottom: 80px;
}
.list-page-files .n-data-table-td .n-space .n-text{
  font-size: 12px;
}
.outer-wrapper {
  opacity: 0;
  position: absolute;
  left: 50%;
  bottom: 52px;
  transform: translateX(-50%);
  z-index: 5;
  transition: opacity 0.3s ease;
}
.outer-wrapper.static {
  animation: move-down ease 0.3s;
}
.outer-wrapper.show {
  opacity: 1;
}
.outer-wrapper.show.static {
  animation: move-up ease 0.3s;
}
.toolbar-wrapper {
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #84858d33;
  background: #000;
  overflow: visible;
  user-select: none;
  box-shadow: 0 0 1px 1px rgba(28, 28, 32, 0.05),
    0 8px 24px rgba(28, 28, 32, 0.12);
}
.toolbar-item {
  border-radius: 5px;
  padding: 6px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s ease;
  color: #fff;
  margin-left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.toolbar-item:first-child {
  margin-left: 0;
}
.tool-icon {
  font-size: 18px;
}
@keyframes move-down {
  0% {
    bottom: 52px;
  }
  100% {
    bottom: -52px;
  }
}
@keyframes move-up {
  0% {
    bottom: -52px;
  }
  100% {
    bottom: 52px;
  }
}

</style>