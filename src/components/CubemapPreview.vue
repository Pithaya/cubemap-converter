<script setup lang="ts">
import { type ConvertedCubemap, FORMAT_LABELS } from '../types/cubemap';

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
    class="bg-white rounded-xl p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
  >
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800">
        {{ FORMAT_LABELS[cubemap.format] }}
      </h3>
      <span class="text-sm text-gray-800 bg-gray-100 px-3 py-1 rounded-md">
        {{ cubemap.width }}x{{ cubemap.height }}
      </span>
    </div>

    <div class="w-full bg-gray-50 rounded-lg overflow-hidden mb-4 flex justify-center">
      <img
        :src="cubemap.dataUrl"
        :alt="FORMAT_LABELS[cubemap.format]"
        class="max-w-full max-h-96 h-auto block"
      />
    </div>

    <button
      class="w-full px-4 py-3 bg-indigo-500 text-white border-0 rounded-lg text-base font-medium cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-indigo-600 active:scale-95"
      @click="downloadImage(cubemap.dataUrl, cubemap.format)"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Download
    </button>
  </div>
</template>
