<template>
  <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
    <h3 class="text-lg font-bold text-center mb-5">{{ title }}</h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({ title: { type: String, default: '' } })
</script>
