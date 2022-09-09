<template>
  <div class="flex gap-8">
    <gt-repositories
      class="min-w-[30%] ml-8 py-8"
      @update="fetchBrabches"
      :selected="selectedRepo"
      :repos="repos"
    />
    <div class="container mr-8 py-8">
      <div class="flex justify-end">
        <div class="flex items-center gap-3 font-semibold opacity-90" v-if="user?.avatar_url">
          {{ user.login }}
          <img :src="user?.avatar_url" class="h-10 w-10 object-cover rounded-full" />
        </div>
      </div>
      <div v-if="selectedBranch?.name">
        <gt-branches :branches="branches" v-model="selectedBranch" />
        <gt-commits ref="commits" :commits="commits" @load="fetchCommits($event, true)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Repo, User, Branch, Commit } from '@/types'
import GtRepositories from '@/components/GtRepositories.vue'
import GtBranches from '@/components/GtBranches.vue'
import GtCommits from '@/components/GtCommits.vue'

export default defineComponent({
  name: 'repositories',
  components: {
    GtRepositories,
    GtBranches,
    GtCommits
  },
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
        if (error.response?.status === 409) {
          this.branches = []
        }
        console.error(error)
      }
    },
    async fetchCommits(
      { page, per_page }: { page?: number; per_page?: number } = { page: 1, per_page: 10 },
      isLoad: boolean = false
    ) {
      try {
        const commits = await this.axios.get(
          `${this.selectedRepo.url}/commits?sha=${this.selectedBranch.name}&page=${page}&per_page=${per_page}`,
          this.axiosHeaders
        )
        if (isLoad) {
          this.commits.push(...commits.data)
        } else {
          this.commits = commits.data
          // start again from page 1
          ;(this.$refs.commits as any).reset()
        }
      } catch (error: any) {
        if (error.response?.status === 409) {
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
