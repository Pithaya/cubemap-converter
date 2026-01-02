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
    class="border-2 border-dashed border-gray-300 rounded-xl p-12 md:p-8 text-center cursor-pointer transition-all duration-300 bg-gray-50 hover:border-indigo-500 hover:bg-indigo-50"
    :class="{ 'border-indigo-500 bg-indigo-100 scale-105': isDragging }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @click="openFileDialog"
  >
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileInput" />

    <div class="pointer-events-none">
      <svg
        class="w-16 h-16 mx-auto mb-4 text-indigo-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p class="text-lg text-gray-800 mb-2">
        <span class="text-indigo-500 font-semibold">Click to choose</span> or drag and drop a
        cubemap
      </p>
      <p class="text-sm text-gray-600">PNG, JPG, WebP supported</p>
    </div>
  </div>
</template>
