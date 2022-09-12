<template>
  <div class="repo-container">
    <div>
      <div class="repo-title">Recent Repositories</div>
      <input
        type="text"
        class="primary-field mt-3 mb-5"
        v-model="search"
        placeholder="Find a repository…"
      />
    </div>
    <ul>
      <li v-for="repo in reposFiltered" :key="repo.id">
        <a
          @click="selectRepo(repo)"
          class="repo-item my-2 flex gap-2 align-center"
          :class="{ active: selectedRepo?.id == repo.id }"
        >
          <img :src="repo.owner?.avatar_url" class="h-5 w-5 object-cover rounded-full" />
          {{ repo.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Repo } from '@/types'
import { mapState } from 'vuex'

export default defineComponent({
  data: () => ({
    search: ''
  }),
  computed: {
    ...mapState({
      repos: (state: any): Repo[] => state.repos
    }),
    selectedRepo() {
      const id = this.$route.query?.repo_id || 0
      return this.repos.find((repo: Repo) => String(repo.id) == id) as Repo
    },
    reposFiltered() {
      return this.repos.filter((repo: Repo) =>
        repo.name.toLowerCase().includes(this.search.toLowerCase())
      ) as Repo[]
    }
  },
  methods: {
    selectRepo(repo: Repo) {
      this.$router.push({ query: { repo_id: repo.id } })
      this.$store
        .dispatch('fetchBranches', repo)
        .then((branch_name: string) =>
          this.$router.push({ query: { repo_id: repo.id, branch_name } })
        )
    }
  }
})
</script>

<style scoped></style>
