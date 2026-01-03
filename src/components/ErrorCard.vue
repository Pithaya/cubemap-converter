<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next';

type Props = {
  error: string;
};

defineProps<Props>();
</script>

<template>
  <div
    class="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-6 rounded-xl flex items-center gap-4 border border-red-200 dark:border-red-800"
  >
    <AlertCircle class="w-6 h-6 shrink-0" />
    <p>{{ error }}</p>
  </div>
</template>
