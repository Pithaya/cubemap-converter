<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
</script>

<template>
  <div
    class="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
  >
    <Loader2 class="w-12 h-12 mx-auto mb-4 text-teal-700 dark:text-teal-400 animate-spin" />
    <p class="text-gray-900 dark:text-gray-100">Processing...</p>
  </div>
</template>
