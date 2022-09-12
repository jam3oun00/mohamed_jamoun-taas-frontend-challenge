<template>
  <div class="flex gap-8">
    <gt-repositories class="min-w-[30%] ml-8 py-8" />
    <div class="container mr-8 py-8">
      <div class="flex justify-end">
        <div class="flex items-center gap-3 font-semibold opacity-90" v-if="user?.avatar_url">
          {{ user.login }}
          <img :src="user?.avatar_url" class="h-10 w-10 object-cover rounded-full" />
        </div>
      </div>
      <div>
        <gt-branches />
        <gt-commits />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GtRepositories from '@/components/GtRepositories.vue'
import GtBranches from '@/components/GtBranches.vue'
import GtCommits from '@/components/GtCommits.vue'
import { mapState } from 'vuex'
export default defineComponent({
  name: 'repositories',
  components: {
    GtRepositories,
    GtBranches,
    GtCommits
  },
  data: () => ({}),
  computed: {
    ...mapState({
      user: (state: any) => state.user
    })
  },
  async created() {
    this.$store
      .dispatch('exchangeToken', this.$route.query.code)
      .catch(() => this.$router.push('/'))
  }
})
</script>

<style scoped></style>
