<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
import DefaultCard from './DefaultCard.vue';
</script>

<template>
  <DefaultCard class="text-center p-12">
    <Loader2 class="w-12 h-12 mx-auto mb-4 text-teal-700 dark:text-teal-400 animate-spin" />
    <p class="text-gray-900 dark:text-gray-100">Processing...</p>
  </DefaultCard>
</template>
