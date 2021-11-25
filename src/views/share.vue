<template>
  <div class="list-page">
    <n-alert title="感谢@shabitt" type="info" closable>
      <n-space>
        <a href="https://t.me/shabitt" target="_blank">作者</a>
        <a href="https://shimily.notion.site/shimily/f90e8e28b55e423185f44c89c53c573c?v=b69a268a91c946ce9238f947100070a4"  target="_blank">地址</a>
      </n-space>
    </n-alert>
    <br />
    <n-alert title="请先设置默认上传目录" type="error" v-if="!uploadFolder || !uploadFolder.id">
      请先在文件列表操作选择设置默认 <a href="https://www.tjsky.net/?p=220#i-4" target="_blank"> <n-icon style="vertical-align: middle;" size="20" color="#d03050"><zoom-question></zoom-question></n-icon> </a>
    </n-alert>
    
    <n-alert title="默认目录" type="success" v-else>
      {{uploadFolder.name}}
    </n-alert>
    <br />
    
    <n-scrollbar style="max-height: calc(100vh - 300px);" @scroll="scrollHandle">
      <n-data-table :bordered="false" size="small" :data="list" :columns="columns"></n-data-table>
      <div class="loading" v-if="loading">
        <n-spin size="small" />加载中
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity'
import { h, onMounted } from '@vue/runtime-core'
import { DataTableColumns, NDataTable, NText, NTime, NAlert, NSpace, NScrollbar, NSpin, NIcon } from 'naive-ui'
import { ZoomQuestion } from '@vicons/tabler'
import http, { notionHttp } from '../utils/axios'

const columns = ref<DataTableColumns>([])

const list = ref()
const loading = ref(false)
const nextCursor = ref()
const getList = () => {
  loading.value = true
  notionHttp.post('https://api.notion.com/v1/databases/f90e8e28b55e423185f44c89c53c573c/query', {
    start_cursor: nextCursor.value || undefined,
    page_size: 50
  })
  .then((res:any) => {
    loading.value = false
    if(!nextCursor.value) {
      list.value = []
    }
    list.value = list.value.concat(res.data.results)
    nextCursor.value = res.data.has_more && res.data.next_cursor
    if(columns.value.length == 0) {
      if(list.value.length) {
        for(let k in list.value[0].properties) {
          if(k !== '发布人' && k !== '发布日期' && k !== '分类' && k !== '标签') {
            columns.value.push({
              title: k,
              key: k,
              ellipsis: {
                tooltip: {
                  placement: k === '名称' ? 'right' : 'bottom'
                },
              },
              width: k === '大小' ? 100 : (k === '名称' ? 1000 : undefined),
              render: (row:any) => {
                const item = row.properties[k]
                switch (item.type) {
                  case 'rich_text': case 'title':
                    return h('div', {}, {
                      default: () => item[item.type] && item[item.type].length && item[item.type].map((listItem:any) => listItem.plain_text)
                    })
                    break
                  case 'select':
                    return h('div', {
                      style: {
                        color: row.properties[k].select.color
                      }
                    }, item.select.name)
                    break
                  case 'created_time':
                    return h(NTime, {
                      time: new Date(item.created_time),
                      type: 'date',
                      format: 'MM-dd HH:MM'
                    })
                    break
                  default :
                    return '--'
                }
              }
            })
          }
        }
      }
      columns.value.push({
        title: '操作',
        key: 'action',
        width: 80,
        align: 'right',
        render: (row:any) => h(NText, {
          type: 'primary',
          onClick: () => {
            addUrl(row.properties['链接'].rich_text[0].plain_text)
          }
        }, {default: () => '保存'})
      })
    }
  })
}
const uploadFolder = ref()
const getUploadFolder = () => {
  return JSON.parse(window.localStorage.getItem('pikpakUploadFolder') || '{}')
}
const addUrl = (url:string) => {
  let postData = {}
  if(!getUploadFolder().id) {
    window.$message.error('请先设置默认上传目录')
    return false
  }
  if(url.indexOf('PikPak://') === 0) {
    const urlData = url.substring(9).split('|')
    postData = {
        kind: "drive#file",
        parent_id: getUploadFolder().id,
        name: urlData[0],
        size: urlData[1],
        hash: urlData[2],
        upload_type: "UPLOAD_TYPE_RESUMABLE",
        objProvider: {
            provider: "UPLOAD_TYPE_UNKNOWN"
        }
    }
  } else {
    postData = {
      kind: "drive#file",
      name: "",
      // parent_id: route.params.id || '',
      upload_type: "UPLOAD_TYPE_URL",
      url: {
        url: url
      },
      params: {"from":"file"},
      folder_type: "DOWNLOAD"
    }
  }
  http.post('https://api-drive.mypikpak.com/drive/v1/files', postData)
    .then((res:any) => {
      if(res.data.upload_type === 'UPLOAD_TYPE_UNKNOWN' || url.indexOf('PikPak://') === -1) {
        window.$message.success('添加成功')
      }
    })
}

const scrollHandle = (e:any) =>  {
  if(e.target.offsetHeight - e.target.scrollTop < 30) {
    if(nextCursor.value && !loading.value) {
      getList()
    }
  }
}
onMounted(() => {
  uploadFolder.value = getUploadFolder()
  nextCursor.value = ''
  getList()
})
</script>

<style>

.list-page .loading {
  margin-top: 20px;
  text-align: center;
  color: rgba(37, 38, 43, 0.36);
}
.list-page .loading .n-spin-body {
  vertical-align: middle;
  margin-right: 10px;
}
</style>