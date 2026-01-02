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
  <div class="app">
    <header class="header">
      <h1 class="title">🗺️ Cubemap Format Converter</h1>
      <p class="subtitle">
        Convert your cubemaps between different formats (Cross, Grid, Row, Column)
      </p>
    </header>

    <main class="main">
      <FileUpload @file-selected="handleFileSelected" />

      <div v-if="isProcessing" class="loading">
        <div class="spinner"></div>
        <p>Processing...</p>
      </div>

      <div v-if="error" class="error">
        <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>{{ error }}</p>
      </div>

      <div v-if="sourceImageUrl" class="source-image">
        <h2 class="source-title">Uploaded image</h2>
        <div class="source-container">
          <img :src="sourceImageUrl" alt="Source cubemap" class="source-img" />
        </div>
      </div>

      <div v-if="detectedInfo" class="detected-info">
        <div class="info-badge">
          <strong>Detected Format:</strong>
          {{ FORMAT_LABELS[detectedInfo.format] }}
        </div>
        <div class="info-badge">
          <strong>Face Size:</strong>
          {{ detectedInfo.faceSize }}×{{ detectedInfo.faceSize }}
        </div>
      </div>

      <div v-if="convertedCubemaps.length > 0" class="results">
        <h2 class="results-title">Converted Formats</h2>
        <div class="cubemaps-grid">
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

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  margin-top: 2rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  background: #fed7d7;
  color: #991b1b;
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.error-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.source-image {
  margin-top: 2rem;
}

.source-title {
  color: white;
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.source-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.source-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}

.detected-info {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.info-badge {
  background: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-badge strong {
  color: #667eea;
  margin-right: 0.5rem;
}

.results {
  margin-top: 3rem;
}

.results-title {
  color: white;
  text-align: center;
  font-size: 1.75rem;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cubemaps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .cubemaps-grid {
    grid-template-columns: 1fr;
  }
}
</style>
