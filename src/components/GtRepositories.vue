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
          class="repo-item"
          :class="{ active: selected.id == repo.id }"
          >{{ repo.name }}</a
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Repo } from '@/types'
export default defineComponent({
  props: {
    repos: {
      type: Array as PropType<Repo[]>,
      default: () => []
    },
    selected: {
      type: Object as PropType<Repo>,
      default: () => ({})
    }
  },
  data() {
    return {
      search: ''
    }
  },
  computed: {
    reposFiltered() {
      return this.repos.filter(repo => repo.name.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  methods: {
    selectRepo(repo: Repo) {
      this.$emit('update', repo)
    }
  }
})
</script>

<style scoped></style>
