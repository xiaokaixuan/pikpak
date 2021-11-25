<template>
  <div class="list-page">
    <div class="header">
      <div class="title n-ellipsis">
        <n-breadcrumb separator=">">
          <n-breadcrumb-item>
            <router-link to="">回收站</router-link>
          </n-breadcrumb-item>
        </n-breadcrumb>
      </div>
    </div>
    <n-scrollbar style="max-height: calc(100vh - 190px);" @scroll="scrollHandle">
      <n-data-table v-model:checked-row-keys="checkedRowKeys"  :row-key="row => row.id" :data="filesList" size="small" :columns="columns" :bordered="false"></n-data-table>
      <div class="loading" v-if="loading">
        <n-spin size="small" />加载中
      </div>
    </n-scrollbar>
    <div class="outer-wrapper static show" v-if="checkedRowKeys.length">
      <div class="toolbar-wrapper">
        <div class="toolbar-item" @click="unTransh(checkedRowKeys)">
          <n-tooltip>
            <template #trigger>
              <n-icon>
                <corner-up-left-double></corner-up-left-double>
              </n-icon>
            </template>
            还原所选
          </n-tooltip>
        </div>
        <div class="toolbar-item" @click="deleteTransh(checkedRowKeys)">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { h, onMounted } from '@vue/runtime-core'
import http from '../utils/axios'
import { DataTableColumns, NDataTable, NTime, NEllipsis, NBreadcrumb, NBreadcrumbItem, NSpace, NText, NPopconfirm, NIcon, NTooltip, NScrollbar, NSpin } from 'naive-ui'
import { byteConvert } from '../utils'
import { CircleX, CornerUpLeftDouble } from '@vicons/tabler'

  const filesList = ref()
  const checkedRowKeys = ref([])
  const smallColums = ref<DataTableColumns>([
    {
      title: '删除时间',
      key: 'modified_time',
      sorter: 'default',
      render: (row) => {
        return h(NTime, {
          time: new Date(String(row.created_time) || ''),
          format: 'MM-dd HH:MM'
        })
      },
      className: 'modified_time',
      width: 200
    },
    {
      title: '大小',
      key: 'size',
      sorter: 'default',
      render: (row) => Number(row.size) > 0 ? byteConvert(Number(row.size)) : '',
      className: 'size',
      width: 160
    }
  ])
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
          class: 'file-info'
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
      title: '操作',
      key: 'action',
      width: 90,
      align: 'right',
      render: (row) => h(NSpace, {}, {
        default: () => [
          h(NText,{
            type: 'primary',
            onClick: () => {
              unTransh(String(row.id))
            }
          }, {
            default: () => '还原'
          }),
          h(NPopconfirm, {
            placement: 'right',
            onPositiveClick: () => {
              deleteTransh(String(row.id))
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
        parent_id: '*',
        thumbnail_size: 'SIZE_LARGE',
        with_audit: true,
        page_token: pageToken.value || undefined,
        filters: {
          "phase": {"eq": "PHASE_TYPE_COMPLETE"},
          "trashed":{"eq":true}
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
  const deleteTransh = (id:string | string[]) => {
    http.post('https://api-drive.mypikpak.com/drive/v1/files:batchDelete', {
      ids: typeof id === 'string' ? [id] : id
    })
      .then(() => {
        window.$message.success('删除成功')
        getFileList()
      })
  }
  const unTransh = (id: string | string[]) => {
    http.post('https://api-drive.mypikpak.com/drive/v1/files:batchUntrash', {
      ids: typeof id === 'string' ? [id] : id
    })
      .then(() => {
        getFileList()
      })
  }
  
  const scrollHandle = (e:any) =>  {
    if(e.target.offsetHeight - e.target.scrollTop < 30) {
      if(pageToken.value && !loading.value) {
        getFileList()
      }
    }
  }
  onMounted(() => {
    const width = document.body.clientWidth
    if(width > 968) {
      columns.value.splice(2, 0, ...smallColums.value)
    }
    getFileList()
  })
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
@media(max-width: 968px) {
  .list-page {
    padding: 10px;
  }
  .file-info img {
    display: none;
  }
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