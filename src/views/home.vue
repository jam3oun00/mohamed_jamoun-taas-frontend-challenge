<template>
  <div class="flex items-center justify-center w-screen h-screen">
    <div class="container flex items-center justify-center">
      <button class="btn-primary" @click="startGithubAuth">Authorize my GitHub account</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'home',
  methods: {
    startGithubAuth() {
      // redirect to github oauth
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
    }
  }
})
</script>
