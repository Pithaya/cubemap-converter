<script setup lang="ts">
import { Download } from 'lucide-vue-next';
import { type ConvertedCubemap, FORMAT_LABELS } from '../types/cubemap';
import PrimaryButton from './PrimaryButton.vue';

type Props = {
  cubemap: ConvertedCubemap;
};

defineProps<Props>();

function downloadImage(dataUrl: string, format: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `cubemap_${format}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-xl"
  >
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

    <PrimaryButton @click="downloadImage(cubemap.dataUrl, cubemap.format)">
      <Download class="w-5 h-5" />
      Download
    </PrimaryButton>
  </div>
</template>
