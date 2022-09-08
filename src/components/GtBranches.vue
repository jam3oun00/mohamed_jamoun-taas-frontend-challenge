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
import { defineComponent, PropType } from 'vue'
import { Branch } from '@/types'

export default defineComponent({
  props: {
    branches: {
      type: Array as PropType<Branch[]>,
      default: () => []
    },
    modelValue: {
      type: Object as PropType<Branch>,
      default: () => ({})
    }
  },
  computed: {
    selectedBranch: {
      get() {
        return this.modelValue
      },
      set(branch: Branch) {
        this.$emit('update:modelValue', branch)
      }
    }
  }
})
</script>

<style scoped></style>
