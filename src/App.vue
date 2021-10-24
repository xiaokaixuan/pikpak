<script setup lang="ts">
  import { ref } from '@vue/reactivity';
  import { GlobalThemeOverrides, NConfigProvider, NMessageProvider, zhCN, dateZhCN } from 'naive-ui'
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
    }
  })
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <n-message-provider>
      <MessageContent></MessageContent>
      <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
</style>
