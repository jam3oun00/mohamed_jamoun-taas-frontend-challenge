<template>
  <div v-if="commits && commits.length">
    <div class="commit-container my-7">
      <ul class="block">
        <li v-for="(commit, i) in commits" :key="i">
          <div class="commit-title">{{ titleTruncator(commit.commit.message) }}</div>
          <p class="commit-sub-title">{{ commit.commit.message }}</p>
          <div class="flex align-center gap-2 mt-2 text-xs">
            <img :src="commit.commit.author.avatar_url" class="h-5 w-5 object-cover rounded-full" />
            <span class="font-bold text-zinc-300">
              {{ commit.commit.author.login }}
            </span>
            <span class="opacity-60">
              {{ commit.commit.committer.date }}
            </span>
          </div>
        </li>
      </ul>
    </div>
    <div class="flex items-center justify-center">
      <button class="btn bg-primary" @click="loadMore">Load more</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Commit } from '@/types'
import { mapState } from 'vuex'
export default defineComponent({
  computed: {
    ...mapState({
      commits: (state: any): Commit[] => state.commits
    }),
    perPage: {
      get() {
        return this.$store.state.commitsPagination.perPage
      },
      set(perPage: number) {
        this.$store.commit('setCommitsPagination', { perPage })
      }
    },
    page: {
      get() {
        return this.$store.state.commitsPagination.page
      },
      set(page: number) {
        this.$store.commit('setCommitsPagination', { page, perPage: this.perPage })
      }
    },
    titleTruncator() {
      return (title: string) => {
        const limit = 60
        if (title.length > limit) {
          return title.substring(0, limit) + '...'
        } else {
          return title
        }
      }
    }
  },
  methods: {
    loadMore() {
      const query = {
        repo_id: this.$route.query?.repo_id,
        branch_name: this.$route.query?.branch_name,
        paginated: true
      }
      // this.page++
      this.$store.dispatch('fetchCommits', query)
    },
    reset() {
      this.page = 1
    }
  }
})
</script>

<style scoped></style>
