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
    <n-data-table :data="filesList" size="small" :columns="columns" :bordered="false" :loading="loading"></n-data-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { h, onMounted } from '@vue/runtime-core'
import http from '../utils/axios'
import { DataTableColumns, NDataTable, NTime, NEllipsis, NBreadcrumb, NBreadcrumbItem, NSpace, NText, NPopconfirm } from 'naive-ui'
import { byteConvert } from '../utils'

  const filesList = ref()
  const columns = ref<DataTableColumns>([
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
      title: '删除时间',
      key: 'modified_time',
      sorter: 'default',
      render: (row) => {
        return h(NTime, {
          time: new Date(String(row.delete_time) || ''),
          format: 'MM-dd hh:mm'
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
  const getFileList = () => {
    loading.value = true
    http.get('https://api-drive.mypikpak.com/drive/v1/files', {
      params: {
        parent_id: '*',
        thumbnail_size: 'SIZE_LARGE',
        with_audit: true,
        filters: {
          "phase": {"eq": "PHASE_TYPE_COMPLETE"},
          "trashed":{"eq":true}
        }
      }
    })
      .then((res:any) => {
        const {data} = res
        filesList.value = data.files
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
  onMounted(getFileList)
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
</style>