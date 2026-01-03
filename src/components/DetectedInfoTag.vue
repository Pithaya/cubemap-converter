<script setup lang="ts">
type Props = {
  label: string;
  value: string;
};

defineProps<Props>();
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-gray-800 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700"
  >
    <strong class="text-teal-700 dark:text-teal-400 mr-2">{{ label }}:</strong>
    <span class="text-gray-900 dark:text-gray-100">{{ value }}</span>
  </div>
</template>
