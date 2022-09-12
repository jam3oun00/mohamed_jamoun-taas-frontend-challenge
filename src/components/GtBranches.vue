<template>
  <div class="flex">
    <select v-model="selectedBranch" class="btn primary-select">
      <option v-for="branch in branches" :key="branch.name" :value="branch">
        {{ branch.name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Branch } from '@/types'
import { mapState } from 'vuex'
import { getBranchByName } from '@/services/serializers'

export default defineComponent({
  data: () => ({}),
  computed: {
    ...mapState({
      branches: (state: any): Branch[] => state.branches
    }),
    selectedBranch: {
      get() {
        return getBranchByName(this.branches, this.$route.query?.branch_name)
      },
      set(branch: Branch) {
        const query = { repo_id: this.$route.query?.repo_id, branch_name: branch.name }
        this.$router.push({ query })
        this.$store.commit('setCommitsPagination', { page: 1 })
        this.$store.dispatch('fetchCommits', query)
      }
    }
  }
})
</script>

<style scoped></style>
