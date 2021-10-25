<template>
  <div class="list-page list-page-files">
    <div class="header">
      <div class="title n-ellipsis">
        <n-breadcrumb separator=">">
          <n-breadcrumb-item>
            <router-link to="/list">文件</router-link>
          </n-breadcrumb-item>
          <n-breadcrumb-item v-if="parentInfo && parentInfo.name">
            {{parentInfo.name}}
          </n-breadcrumb-item>
        </n-breadcrumb>
      </div>
      <div class="action" @click="showAddUrl = true">
        <n-icon :color="themeVars.primaryColor">
          <circle-plus></circle-plus>
        </n-icon>
      </div>
    </div>
    <n-scrollbar style="max-height: calc(100vh - 190px);" @scroll="scrollHandle">
      <n-data-table v-model:checked-row-keys="checkedRowKeys"  :row-key="row => row.id" :data="filesList" size="small" :columns="columns" :bordered="false"></n-data-table>
      <div class="loading" v-if="loading">
        <n-spin size="small" />加载中
      </div>
    </n-scrollbar>
    <task-vue ref="taskRef"></task-vue>
    <div class="outer-wrapper static show" v-if="checkedRowKeys.length">
      <div class="toolbar-wrapper">
        <div class="toolbar-item" @click="copyAll">
          <n-tooltip>
            <template #trigger>
              <n-icon>
                <share></share>
              </n-icon>
            </template>
            分享秒传
          </n-tooltip>
        </div>
        <div class="toolbar-item" @click="deleteFile(checkedRowKeys)">
          <n-tooltip>
            <template #trigger>
              <n-icon>
                <circle-x></circle-x>
              </n-icon>
            </template>
            删除所选
          </n-tooltip>
        </div>
      </div>
    </div>
    <n-modal v-model:show="showAddUrl">
      <n-card style="width: 600px;" title="添加链接">
        <template #header-extra>
          <n-icon @click="showAddUrl = false">
            <circle-x></circle-x>
          </n-icon>
        </template>
        <n-input type="textarea" :rows="6" placeholder="支持Magent链接和秒传链接(PikPak://PikPak Tutorial.mp4|19682618|0A4E4FC6FA600D9705B9800BA1687C769273BC97)，换行添加多个，秒传链接默认保存到当前文件夹或第一个文件夹不能保存到根目录 Magent链接只能默认保存到My Pack" v-model:value="newUrl"></n-input>
        <template #action>
          <n-button :block="true" type="primary" :disabled="!newUrl" @click="addUrl">添加</n-button>
        </template>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showVideo">
      <n-card style="width: 100vw; height: 100vh;" :title="fileInfo ? fileInfo.name : '视频'">
        <template #header-extra>
          <n-icon @click="showVideo = false">
            <circle-x></circle-x>
          </n-icon>
        </template>
        <div style="width: 100%; height: 100%">
          <!-- <Video :src="fileInfo.web_content_link" :type="fileInfo.mime_type"></Video> -->
          <plyr-vue :video="fileInfo"></plyr-vue>
        </div>
      </n-card>
    </n-modal>
    
    <n-modal v-model:show="showImage">
      <n-card style="width: 100vw; height: 100vh;" :title="fileInfo ? fileInfo.name : '图片'">
        <template #header-extra>
          <n-icon @click="showImage = false">
            <circle-x></circle-x>
          </n-icon>
        </template>
        <div style="width: 100%; height: calc(100vh - 80px);text-align: center;">
          <img :src="fileInfo?.web_content_link" style="max-width: 100%; max-height: 100%">
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { h, computed, onMounted, watch } from '@vue/runtime-core'
import http from '../utils/axios'
import { useRoute, useRouter } from 'vue-router'
import { DataTableColumns, NDataTable, NTime, NEllipsis, NModal, NCard, NInput, NBreadcrumb, NBreadcrumbItem, NIcon, useThemeVars, NButton, NText, NPopconfirm, NTooltip, NSpace, NScrollbar, NSpin } from 'naive-ui'
import { CirclePlus, CircleX, Share } from '@vicons/tabler'
import { byteConvert } from '../utils'
import PlyrVue from '../components/Plyr.vue'
import TaskVue from '../components/Task.vue'
import ClipboardJS from 'clipboard'
import streamSaver from 'streamsaver'
  const filesList = ref()
  const route = useRoute()
  const router = useRouter()
  interface FileInfo {
    kind: string,
    mine_type: string,
    id: string,
    thumbnail_link: string,
    icon_link: string,
    name: string,
    size: number,
    hash: string
  }
  const themeVars = useThemeVars()
  const checkedRowKeys = ref<string[]>([])
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
              router.push('/list/' + row.id)
            } else if(row.mime_type.indexOf('video') != -1 || row.mime_type.indexOf('image') != -1) {
              getFile(row.id)
                .then(res => {
                  fileInfo.value = res.data
                  if(fileInfo.value.web_content_link) {
                    if(row.mime_type.indexOf('video') != -1) {
                      showVideo.value = true
                    } else {
                      showImage.value = true
                    }
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
      title: '修改时间',
      key: 'modified_time',
      sorter: 'default',
      align: 'right',
      render: (row) => {
        return h(NTime, {
          time: new Date(String(row.modified_time) || ''),
          format: 'MM-dd hh:mm',
        })
      },
      className: 'modified_time',
      width: 160
    },
    {
      title: '大小',
      key: 'size',
      sorter: 'default',
      align: 'right',
      render: (row) => Number(row.size) > 0 ? byteConvert(Number(row.size)) : '',
      className: 'size',
      width: 160
    },
    {
      title: '',
      key: 'action',
      width: 170,
      align: 'right',
      render: (row:any) => h(NSpace, {
        justify: 'end'
      }, {
        default: () => [
          row.size > 0 ? h(NText,{
            type: 'primary',
            onClick: () => {
              downFile(row.id)
            }
          }, {
            default: () => "下载"
          }) : '',
          row.size > 0 ? h(NText,{
            type: 'primary',
            onClick: () => {
              copy(`PikPak://${row.name}|${row.size}|${row.hash}`)
            }
          }, {
            default: () => "分享秒传"
          }) : '',
          h(NPopconfirm, {
            placement: 'right',
            onPositiveClick: () => {
              deleteFile(String(row.id))
            }
          }, {
            trigger: () => {
              return h(NText, {
                type: 'primary',
              }, {
                default: () => '删除'
              })
            },
            default: () => '确定删除文件吗？'
          })
        ]
      })
    }
  ])
  const loading = ref(false)
  const pageToken = ref()
  const getFileList = () => {
    loading.value = true
    http.get('https://api-drive.mypikpak.com/drive/v1/files', {
      params: {
        parent_id: route.params.id,
        thumbnail_size: 'SIZE_LARGE',
        with_audit: true,
        page_token: pageToken.value || undefined,
        filters: {
          "phase": {"eq": "PHASE_TYPE_COMPLETE"},
          "trashed":{"eq":false}
        }
      }
    })
      .then((res:any) => {
        const {data} = res
        if(!pageToken.value) {
          filesList.value = []
        }
        filesList.value = filesList.value.concat(data.files)
        pageToken.value = data.next_page_token
      })
      .finally(() => {
        loading.value = false
      })
  }
  const initPage = () => {
    getFileList()
    parentInfo.value = {}
    if(route.params.id) {
      getFile(String(route.params.id))
        .then(res => {
          parentInfo.value = res.data
        })
    }
  }
  watch(route, () => {
    initPage()
  })
  const parentInfo = ref()
  onMounted(() => {
    initPage()
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
  const fileInfo = ref()
  const getFile = (id:string) => {
    return http.get('https://api-drive.mypikpak.com/drive/v1/files/' + id, {
      params: {
        _magic: '2021',
        thumbnail_size: 'SIZE_LARGE'
      }
    })
      .then(res => {
        return res
      })
  }
  const showVideo = ref(false)
  const showImage = ref(false)
  const showAddUrl = ref(false)
  const newUrl = ref()
  const taskRef = ref()
  const firstFolder = computed(() => {
    let id:string = ''
    if(route.params.id) {
      id = String(route.params.id)
    } else {
      for(let i in filesList.value) {
        if(filesList.value[i].kind === 'drive#folder') {
          id = filesList.value[i].id
          break
        }
      }
    }
    return id
  })
  const addUrl = () => {
    const urlList = newUrl.value.split('\n')
    let successLength = 0
    let hasTask = false
    let hasHash = false
    urlList.forEach((url:string) => {
      if(url) {
        let postData = {}
        if(url.indexOf('PikPak://') === 0) {
          const urlData = url.substring(9).split('|')
          hasHash = true
          postData = {
              kind: "drive#file",
              parent_id: firstFolder.value,
              name: urlData[0],
              size: urlData[1],
              hash: urlData[2],
              upload_type: "UPLOAD_TYPE_RESUMABLE",
              objProvider: {
                  provider: "UPLOAD_TYPE_UNKNOWN"
              }
          }
        } else {
          hasTask = true
          postData = {
            kind: "drive#file",
            name: "",
            parent_id: route.params.id || '',
            upload_type: "UPLOAD_TYPE_URL",
            url: {
              url: url
            },
            params: {"from":"file"},
            folder_type: "DOWNLOAD"
          }
        }
        showAddUrl.value = false
        http.post('https://api-drive.mypikpak.com/drive/v1/files', postData)
          .then((res:any) => {
            if(res.data.upload_type === 'UPLOAD_TYPE_UNKNOWN' || url.indexOf('PikPak://') === -1) {
              window.$message.success('添加成功')
            }
          })
          .finally(() => {
            successLength++
            if(successLength === urlList.length) {
              if(hasTask) {
                taskRef.value.getTask()
              }
              if(hasHash) {
                getFileList()
              }
            }
          })
      } else {
        successLength++
      }
    })
  }
  const deleteFile = (id:string | string[]) => {
    http.post('https://api-drive.mypikpak.com/drive/v1/files:batchTrash', {
      ids: typeof id === 'string' ? [id] : id
    })
      .then(() => {
        window.$message.success('删除成功')
        getFileList()
      })
  }
  const copy = (value:string) => {
    const fakeElement = document.createElement('button')
    const clipboard = new ClipboardJS(fakeElement, {
      text: () => value,
      action: () => 'copy',
    })
    clipboard.on('success', (e) => {
      window.$message.success('复制成功')
      clipboard.destroy()
    })
    fakeElement.click()
  }
  const copyAll = () => {
    let text = ''
    filesList.value.forEach((item:FileInfo) => {
      if(checkedRowKeys.value.indexOf(item.id) !== -1 && item.size > 0) {
        text = text + `PikPak://${item.name}|${item.size}|${item.hash}` + '\n'
      }
    })
    copy(text)
    checkedRowKeys.value = []
  }
  const downFile = (id:string) => {
    getFile(id)
      .then((info:any) => {
        streamSaver.mitm = 'mitm.html'
        const fileStream = streamSaver.createWriteStream(info.data.name)
        fetch(info.data.web_content_link).then((res:any) => {
          if(!window.$downId) {
            window.$downId = []
          }
          window.$downId.push(id)
          const readableStream = res.body
          // more optimized
          if (window.WritableStream && readableStream?.pipeTo) {
            return readableStream.pipeTo(fileStream)
              .then(() => {
                window.$downId.splice(window.$downId.indexOf(id), 1)
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
      })
  }
  const scrollHandle = (e:any) =>  {
    if(e.target.offsetHeight - e.target.scrollTop < 30) {
      if(pageToken.value && !loading.value) {
        getFileList()
      }
    }
  }

</script>

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
.list-page {
  padding: 40px;
}
.list-page .loading {
  margin-top: 20px;
  text-align: center;
  color: rgba(37, 38, 43, 0.36);
}
.list-page .loading .n-spin-body {
  vertical-align: middle;
  margin-right: 10px;
}
.list-page-files {
  padding-bottom: 80px;
}
.list-page-files .n-data-table-tr .n-data-table-td:nth-of-type(5) div {
  display: none;
}
.list-page-files .n-data-table-tr:hover .n-data-table-td:nth-of-type(5) div {
  display: block;
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