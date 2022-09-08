<template>
  <div>
    <div class="commit-container my-7">
      <ul class="block">
        <li v-for="(commit, i) in commits" :key="i">
          <div class="commit-title">{{ titleTruncator(commit.commit.message) }}</div>
          <p class="commit-sub-title">{{ commit.commit.message }}</p>
          <div class="flex align-center gap-2 mt-2 text-xs">
            <img :src="commit.author?.avatar_url" class="h-5 w-5 object-cover rounded-full" />
            <span class="font-bold text-zinc-300">
              {{ commit?.author?.login }}
            </span>
            <span class="opacity-60">
              committed {{ moment(commit.commit?.committer?.date).fromNow() }}
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
import { defineComponent, PropType } from 'vue'
import { Commit } from '@/types'
import moment from 'moment'
export default defineComponent({
  props: {
    commits: {
      type: Array as PropType<Commit[]>,
      default: () => []
    }
  },
  data() {
    return {
      moment,
      perPage: 5,
      currentPage: 1
    }
  },
  computed: {
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
      this.currentPage++
      this.$emit('load', { page: this.currentPage, per_page: this.perPage })
    },
    reset() {
      this.currentPage = 1
    }
  }
})
</script>

<style scoped></style>
