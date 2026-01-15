<script setup lang="ts">
import { Download } from 'lucide-vue-next';
import { type ConvertedCubemap, FORMAT_LABELS } from '../types/cubemap';
import PrimaryButton from './PrimaryButton.vue';
import { downloadDataUrl } from '@/utils/image';
import DefaultCard from './DefaultCard.vue';

type Props = {
  cubemap: ConvertedCubemap;
};

defineProps<Props>();

function downloadImage(dataUrl: string, format: string) {
  downloadDataUrl(dataUrl, `cubemap_${format}.png`);
}
</script>

<template>
  <DefaultCard class="h-fit transition-all duration-200 hover:shadow-xl">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ FORMAT_LABELS[cubemap.format] }}
      </h3>
      <span
        class="text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md"
      >
        {{ cubemap.width }}x{{ cubemap.height }}
      </span>
    </div>

    <div
      class="w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden mb-4 flex justify-center"
    >
      <img
        :src="cubemap.dataUrl"
        :alt="FORMAT_LABELS[cubemap.format]"
        class="max-w-full max-h-96 h-auto block"
      />
    </div>

    <PrimaryButton class="w-full" @click="downloadImage(cubemap.dataUrl, cubemap.format)">
      <Download class="w-5 h-5" />
      Download
    </PrimaryButton>
  </DefaultCard>
</template>
