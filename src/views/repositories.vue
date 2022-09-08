<template>
  <div class="flex"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Repo, User, Branch, Commit } from '@/types'

export default defineComponent({
  name: 'repositories',
  data() {
    return {
      repos_url: '',
      accessToken: '',
      repos: [] as Repo[],
      commits: [] as Commit[],
      branches: [] as Branch[],
      user: {} as User,
      selectedRepo: {} as Repo,
      selectedBranch: {} as Branch
    }
  },
  // watch selectedBranch and fetch commits
  watch: {
    selectedBranch() {
      this.fetchCommits()
    }
  },
  computed: {
    axiosHeaders(): object {
      return {
        headers: {
          Authorization: `bearer ${this.accessToken}`
        }
      }
    }
  },
  methods: {
    async fetchUser() {
      const user = await this.axios.get('https://api.github.com/user', this.axiosHeaders)
      this.user = user.data
      this.repos_url = user.data.repos_url

      this.fetchRepos()
    },
    async fetchRepos() {
      const repos = await this.axios.get(this.repos_url, this.axiosHeaders)
      this.repos = repos.data
    },
    async fetchBrabches(repo: Repo) {
      this.selectedRepo = repo
      try {
        const branches = await this.axios.get(`${repo.url}/branches`, this.axiosHeaders)
        this.branches = branches.data
        this.selectedBranch = branches.data[0]

        this.fetchCommits()
      } catch (error: any) {
        if (error.response.status === 409) {
          this.branches = []
        }
        console.error(error)
      }
    },
    async fetchCommits() {
      try {
        const commits = await this.axios.get(
          `${this.selectedRepo.url}/commits?sha=${this.selectedBranch.name}`,
          this.axiosHeaders
        )
        this.commits = commits.data
      } catch (error: any) {
        if (error.response.status === 409) {
          this.commits = []
        }
      }
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
