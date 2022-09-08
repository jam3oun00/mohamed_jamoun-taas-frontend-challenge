<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      accessToken: ''
    }
  },
  methods: {
    fetchUser() {
      // will fetch user here
    }
  },
  async created() {
    const code = this.$route.query.code

    // https://github.com/login/oauth/access_token endpoint for creating an OAuth access token does not support CORS requests from Web applications
    // we can use thingproxy temporary solution for the CORS issue
    const thingproxyUrl = 'https://thingproxy.freeboard.io/fetch'
    const accessTokenUrl = `${thingproxyUrl}/https://github.com/login/oauth/access_token/?code=${code}&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`
    const requestedData = await this.axios.post(accessTokenUrl)

    // requestedData will look like this => access_token=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&scope=&token_type=bearer
    this.accessToken = requestedData.data.split('=')[1].split('&')[0]

    if (this.accessToken.includes('bad_verification_code')) {
      this.$router.push('/')
    } else {
      this.fetchUser()
    }
  }
})
</script>

<style scoped></style>
