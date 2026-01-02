<script setup lang="ts">
import { ref } from 'vue';

type Emits = (e: 'fileSelected', file: File) => void;

const emit = defineEmits<Emits>();

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  isDragging.value = true;
}

function handleDragLeave() {
  isDragging.value = false;
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;

  const files = event.dataTransfer?.files;
  if (files?.[0]) {
    handleFile(files[0]);
  }
}

function handleFileInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files?.[0]) {
    handleFile(files[0]);
  }
}

function handleFile(file: File) {
  if (file.type.startsWith('image/')) {
    emit('fileSelected', file);
  } else {
    alert('Please upload a valid image file.');
  }
}

function openFileDialog() {
  fileInput.value?.click();
}
</script>

<template>
  <div
    class="file-upload"
    :class="{ dragging: isDragging }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @click="openFileDialog"
  >
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileInput"
    />

    <div class="upload-content">
      <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p class="upload-text">
        <span class="highlight">Click to choose</span> or drag and drop a cubemap
      </p>
      <p class="upload-hint">PNG, JPG, WebP supported</p>
    </div>
  </div>
</template>

<style scoped>
.file-upload {
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f7fafc;
}

.file-upload:hover {
  border-color: #667eea;
  background: #eef2ff;
}

.file-upload.dragging {
  border-color: #667eea;
  background: #e0e7ff;
  transform: scale(1.02);
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  color: #667eea;
}

.upload-text {
  font-size: 1.125rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.highlight {
  color: #667eea;
  font-weight: 600;
}

.upload-hint {
  font-size: 0.875rem;
  color: #718096;
}
</style>
