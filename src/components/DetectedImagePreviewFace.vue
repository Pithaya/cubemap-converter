<script setup lang="ts">
import type { CubeFaces } from '@/types/cubemap';

type Props = {
  faceName: keyof CubeFaces;
  url: string;
};

defineProps<Props>();
</script>
<template>
  <div :key="faceName" class="flex flex-col items-stretch justify-stretch text-center">
    <img :src="url" :alt="faceName" class="block rounded-lg mb-2" />
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{{
      faceName
    }}</span>
  </div>
</template>
