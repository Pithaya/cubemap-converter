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
  <div class="cubemap-preview">
    <div class="preview-header">
      <h3 class="format-title">{{ FORMAT_LABELS[cubemap.format] }}</h3>
      <span class="dimensions">{{ cubemap.width }}x{{ cubemap.height }}</span>
    </div>

    <div class="preview-image-container">
      <img :src="cubemap.dataUrl" :alt="FORMAT_LABELS[cubemap.format]" class="preview-image" />
    </div>

    <button class="download-button" @click="downloadImage(cubemap.dataUrl, cubemap.format)">
      <svg class="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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

<style scoped>
.cubemap-preview {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.cubemap-preview:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.format-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.dimensions {
  font-size: 0.875rem;
  color: #2d3748;
  background: #edf2f7;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.preview-image-container {
  width: 100%;
  background: #f7fafc;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.preview-image {
  width: 100%;
  height: auto;
  display: block;
}

.download-button {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #667eea;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s ease;
}

.download-button:hover {
  background: #5568d3;
}

.download-button:active {
  transform: scale(0.98);
}

.download-icon {
  width: 20px;
  height: 20px;
}
</style>
