<script setup lang="ts">
import DefaultCard from './DefaultCard.vue';

type Props = {
  label: string;
  value: string;
};

defineProps<Props>();
</script>

<template>
  <DefaultCard>
    <strong class="text-teal-700 dark:text-teal-400 mr-2">{{ label }}:</strong>
    <span class="text-gray-900 dark:text-gray-100">{{ value }}</span>
  </DefaultCard>
</template>
