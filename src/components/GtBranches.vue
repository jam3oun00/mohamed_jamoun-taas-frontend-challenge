<template>
  <div>
    <div class="flex" v-if="branches && branches.length">
      <select v-model="selectedBranch" class="btn primary-select">
        <option v-for="branch in branches" :key="branch.name" :value="branch">
          {{ branch.name }}
        </option>
      </select>
    </div>
    <div
      v-else-if="$route.query?.repo_id"
      class="flex items-center justify-center font-semibold h-[50vh]"
    >
      No branches available to show on this repository
    </div>
    <div v-else class="flex items-center justify-center font-semibold h-[50vh]">
      Select a repository to see its branches
    </div>
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
