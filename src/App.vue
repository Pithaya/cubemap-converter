<script setup lang="ts">
import { ref } from 'vue';
import { Wand2 } from 'lucide-vue-next';
import FileUpload from './components/FileUpload.vue';
import CubemapPreview from './components/CubemapPreview.vue';
import CustomCubemapModal from './components/CustomCubemapModal.vue';
import { detectCubemapFormat } from './utils/detector';
import { convertToAllFormats, convertToCustomFormat, extractFaces } from './utils/converter';
import {
  type ConvertedCubemap,
  type CubemapInfo,
  FORMAT_LABELS,
  type CubeFaces,
} from './types/cubemap';
import { downloadDataUrl, loadImage } from './utils/image';
import ThemeToggleButton from './components/ThemeToggleButton.vue';
import DetectedInfoTag from './components/DetectedInfoTag.vue';
import ProcessingCard from './components/ProcessingCard.vue';
import ErrorCard from './components/ErrorCard.vue';
import SecondaryButton from './components/SecondaryButton.vue';
import type { CustomFaceData } from './types/custom-face-data';

const isProcessing = ref(false);
const error = ref<string | null>(null);
const detectedInfo = ref<CubemapInfo | null>(null);
const convertedCubemaps = ref<ConvertedCubemap[]>([]);
const sourceImageUrl = ref<string | null>(null);

const facesUrls = ref<Record<keyof CubeFaces, string> | null>(null);
const facesData = ref<CubeFaces | null>(null);

const isCustomModalOpen = ref(false);

function openCustomModal() {
  isCustomModalOpen.value = true;
}

function closeCustomModal() {
  isCustomModalOpen.value = false;
}

async function handleFileSelected(file: File) {
  isProcessing.value = true;
  error.value = null;
  detectedInfo.value = null;
  convertedCubemaps.value = [];
  sourceImageUrl.value = URL.createObjectURL(file);
  facesData.value = null;
  facesUrls.value = null;

  try {
    // Load the image
    const image = await loadImage(file);

    // Detect the format
    const info = detectCubemapFormat(image.width, image.height);
    if (!info) {
      error.value =
        'Unrecognized cubemap format. Supported formats are: Cross (4x3, 3x4), Grid (2x3, 3x2), Row/Column (6x1, 1x6), Equirectangular (2:1)';
      return;
    }

    detectedInfo.value = info;

    // Extract faces
    const faces = extractFaces(image, info);

    if (faces === null) {
      error.value = 'Error extracting faces from the cubemap.';
      return;
    }

    facesData.value = faces;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = info.faceSize;
      canvas.height = info.faceSize;

      const faceUrls: Partial<Record<keyof CubeFaces, string>> = {};

      for (const [faceName, faceData] of Object.entries(faces)) {
        ctx.putImageData(faceData, 0, 0);
        faceUrls[faceName as keyof CubeFaces] = canvas.toDataURL('image/png');
      }

      facesUrls.value = faceUrls as Record<keyof CubeFaces, string>;
    }

    // Convert to all other formats
    const converted = convertToAllFormats(facesData.value, info);
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

function handleGenerate(customCubemapData: Record<keyof CubeFaces, CustomFaceData>) {
  if (!facesData.value || !detectedInfo.value) {
    return;
  }

  const generated = convertToCustomFormat(
    customCubemapData,
    facesData.value,
    detectedInfo.value.faceSize,
  );

  if (!generated) {
    return;
  }

  downloadDataUrl(generated.dataUrl, 'cubemap_custom.png');
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 md:p-4 relative">
    <ThemeToggleButton />

    <header class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white">
        🗺️ Cubemap Format Converter
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Convert your cubemaps between different formats
      </p>
    </header>

    <main class="max-w-7xl mx-auto flex flex-col gap-8">
      <FileUpload @file-selected="handleFileSelected" />

      <ProcessingCard v-if="isProcessing" />

      <ErrorCard v-if="error" :error="error" />

      <div v-if="sourceImageUrl && !isProcessing">
        <h2 class="text-gray-900 dark:text-white text-center text-2xl mb-4 font-semibold">
          Uploaded image
        </h2>
        <div
          class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 flex justify-center"
        >
          <img
            :src="sourceImageUrl"
            alt="Source cubemap"
            class="max-w-full max-h-96 h-auto block rounded-lg"
          />
        </div>
      </div>

      <div v-if="facesUrls">
        <h2 class="text-gray-900 dark:text-white text-center text-2xl font-semibold mb-4">
          Extracted Faces
        </h2>
        <div
          class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div class="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-6 gap-4">
            <div v-for="(url, faceName) in facesUrls" :key="faceName" class="text-center">
              <img :src="url" :alt="faceName" class="w-full h-auto block rounded-lg mb-2" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{{
                faceName
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="detectedInfo" class="flex gap-4 justify-center flex-wrap">
        <DetectedInfoTag label="Detected Format" :value="FORMAT_LABELS[detectedInfo.format]" />
        <DetectedInfoTag
          label="Image size"
          :value="`${detectedInfo.width}x${detectedInfo.height}`"
        />
        <DetectedInfoTag label="Face size" :value="`${detectedInfo.faceSize}px`" />
      </div>

      <div v-if="convertedCubemaps.length > 0">
        <div class="flex flex-col gap-2 sm:flex-row sm:gap-0 items-center sm:justify-between mb-4">
          <div class="flex-1"></div>
          <h2 class="text-gray-900 dark:text-white text-2xl font-semibold flex-1 text-center">
            Converted Formats
          </h2>
          <div class="flex-1 flex justify-end">
            <SecondaryButton @click="openCustomModal">
              <Wand2 class="w-4 h-4" />
              Create Custom
            </SecondaryButton>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CubemapPreview
            v-for="cubemap in convertedCubemaps"
            :key="cubemap.format"
            :cubemap="cubemap"
          />
        </div>
      </div>
    </main>

    <Teleport to="body">
      <CustomCubemapModal
        v-if="facesUrls && detectedInfo"
        :is-open="isCustomModalOpen"
        :faces="facesUrls"
        :face-size="detectedInfo.faceSize"
        @close="closeCustomModal"
        @generate="handleGenerate"
      />
    </Teleport>
  </div>
</template>
