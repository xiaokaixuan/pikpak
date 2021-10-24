<template>
  <video id="player" class="video-js" ></video>
</template>
<script setup lang="ts">
import { ref } from '@vue/reactivity'
import { onMounted, onUnmounted } from '@vue/runtime-core';
import { VideoJsPlayer } from "video.js";
import videojs from "video.js/dist/alt/video.core.novtt.js";
// Video.js css
import "video.js/dist/video-js.min.css";
  
  const player = ref<VideoJsPlayer>()
  const props = defineProps<{
    src: 'string',
    type?: 'string'
  }>()
  const initPlayer = () => {
    player.value = videojs("player", {
      autoplay: false,
      controls: true,
      fluid: true,
      // aspectRatio: "16:9",
      fill: true,
      sources: [
        {
          src: props.src,
          type: props.type || "video/mp4",
        },
      ],
    })
  }
  onMounted(initPlayer)
  onUnmounted(() => {
    player.value?.dispose()
  })
</script>