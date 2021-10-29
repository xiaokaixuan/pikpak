<script setup lang="ts">
  import { ref } from '@vue/reactivity';
  import { GlobalThemeOverrides, NConfigProvider, NMessageProvider, zhCN, dateZhCN, NDialogProvider, NNotificationProvider } from 'naive-ui'
import MessageContent from './components/MessageContent.vue';
  const themeOverrides = ref<GlobalThemeOverrides>({
    common: {
      primaryColor: '#306eff',
      hoverColor: '#306eff',
      primaryColorHover: '#306eff',
      heightMedium: '42px',
    },
    Layout: {
      siderColor: '#f5f5f6'
    },
    Breadcrumb: {
      fontSize: '16px'
    },
    Dropdown: {
      optionTextColorHover: '#fff'
    }
  })
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <MessageContent></MessageContent>
          <router-view></router-view>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
</style>
