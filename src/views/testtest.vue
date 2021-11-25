<template>
<button @click="invite">接受邀请</button>
</template>

<script setup lang="ts">
import axios from 'axios';

  const invite = () => {
    const loginData = JSON.parse(window.localStorage.getItem('pikpakLogin') || '{}')
    axios.get('https://invite.z7.workers.dev/' + loginData.sub, {
      headers: {
        'authorization': loginData.token_type + ' ' + loginData.access_token
      }
    })
      .then((res:any) => {
        if(res.data.invited_days) {
          window.$message.success('恭喜您，您已成功增加' + res.data.invited_days + '天')
        } else {
          window.$message.error('您已经邀请过了')
        }
      })
  }
</script>