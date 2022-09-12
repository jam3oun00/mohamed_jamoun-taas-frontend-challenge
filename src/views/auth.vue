<template>
  <div class="flex items-center justify-center w-screen h-screen">
    <div class="container flex items-center justify-center">
      <a class="btn bg-primary" :href="redirectLink">Authorize my GitHub account</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'home',
  computed: {
    redirectLink() {
      return `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
    }
  },
})
</script>
