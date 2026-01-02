<script setup lang="ts">
import { ref } from 'vue';
import FileUpload from './components/FileUpload.vue';
import CubemapPreview from './components/CubemapPreview.vue';
import { detectCubemapFormat } from './utils/detector';
import { convertToAllFormats } from './utils/converter';
import { type ConvertedCubemap, type CubemapInfo, FORMAT_LABELS } from './types/cubemap';
import { loadImage } from './utils/image';

const isProcessing = ref(false);
const error = ref<string | null>(null);
const detectedInfo = ref<CubemapInfo | null>(null);
const convertedCubemaps = ref<ConvertedCubemap[]>([]);
const sourceImageUrl = ref<string | null>(null);

async function handleFileSelected(file: File) {
  isProcessing.value = true;
  error.value = null;
  detectedInfo.value = null;
  convertedCubemaps.value = [];
  sourceImageUrl.value = URL.createObjectURL(file);

  try {
    // Load the image
    const image = await loadImage(file);

    // Detect the format
    const info = detectCubemapFormat(image.width, image.height);
    if (!info) {
      error.value =
        'Unrecognized cubemap format. Supported formats are: Cross (4x3, 3x4), Grid (2x3, 3x2), Row/Column (6x1, 1x6)';
      return;
    }

    detectedInfo.value = info;

    // Convert to all other formats
    const converted = convertToAllFormats(image, info);
    convertedCubemaps.value = converted;

    if (converted.length === 0) {
      error.value = 'Error converting formats';
    }
  } catch (err) {
    error.value = 'Error processing image: ' + (err as Error).message;
  } finally {
    isProcessing.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8 md:p-4">
    <header class="text-center text-white mb-12">
      <h1 class="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
        🗺️ Cubemap Format Converter
      </h1>
      <p class="text-lg opacity-90">
        Convert your cubemaps between different formats (Cross, Grid, Row, Column)
      </p>
    </header>

    <main class="max-w-7xl mx-auto">
      <FileUpload @file-selected="handleFileSelected" />

      <div v-if="isProcessing" class="mt-8 text-center p-12 bg-white rounded-xl">
        <div
          class="w-12 h-12 border-4 border-gray-200 border-t-indigo-500 rounded-full mx-auto mb-4 animate-spin"
        ></div>
        <p>Processing...</p>
      </div>

      <div v-if="error" class="mt-8 bg-red-100 text-red-800 p-6 rounded-xl flex items-center gap-4">
        <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>{{ error }}</p>
      </div>

      <div v-if="sourceImageUrl" class="mt-8">
        <h2 class="text-white text-center text-2xl mb-4 drop-shadow-lg">Uploaded image</h2>
        <div class="bg-white rounded-xl p-6 shadow-lg flex justify-center">
          <img
            :src="sourceImageUrl"
            alt="Source cubemap"
            class="max-w-full max-h-96 h-auto block rounded-lg"
          />
        </div>
      </div>

      <div v-if="detectedInfo" class="flex gap-4 justify-center mt-8 flex-wrap">
        <div class="bg-white px-6 py-3 rounded-lg shadow-lg">
          <strong class="text-indigo-500 mr-2">Detected Format:</strong>
          {{ FORMAT_LABELS[detectedInfo.format] }}
        </div>
        <div class="bg-white px-6 py-3 rounded-lg shadow-lg">
          <strong class="text-indigo-500 mr-2">Face Size:</strong>
          {{ detectedInfo.faceSize }}×{{ detectedInfo.faceSize }}
        </div>
      </div>

      <div v-if="convertedCubemaps.length > 0" class="mt-12">
        <h2 class="text-white text-center text-3xl mb-8 drop-shadow-lg">Converted Formats</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CubemapPreview
            v-for="cubemap in convertedCubemaps"
            :key="cubemap.format"
            :cubemap="cubemap"
          />
        </div>
      </div>
    </main>
  </div>
</template>
