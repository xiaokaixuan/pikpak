<template>
  <div ref="dplayerRef"></div>
</template>
<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { onMounted, onUnmounted } from '@vue/runtime-core';
import DPlayer from 'dplayer'
  const props = defineProps<{
    video: {}
  }>()
  const dp = ref<DPlayer>()
  const dplayerRef = ref()
  const initPlayer = () => {
    dp.value = new DPlayer({
      container: dplayerRef.value,
      logo: 'https://www.mypikpak.com/logo.png',
      video: {
        quality: [],
        defaultQuality: 0,
        pic: '',
        url: ''
      },
    })
  }
  onMounted(initPlayer)
  onUnmounted(() => {
    dp.value && dp.value.destroy()
  })
</script>

