<script setup lang="ts">
import { ref } from 'vue';
import { CloudUpload } from 'lucide-vue-next';

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
    class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center cursor-pointer transition-all duration-300"
    :class="{
      'border-teal-500 bg-teal-50 dark:border-teal-400 dark:bg-gray-700': isDragging,
      'bg-gray-50 dark:bg-gray-800 hover:border-teal-500 hover:bg-teal-50 dark:hover:border-teal-400 dark:hover:bg-gray-700':
        !isDragging,
    }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @click="openFileDialog"
  >
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileInput" />

    <div class="pointer-events-none">
      <CloudUpload class="w-16 h-16 mx-auto text-teal-700 dark:text-teal-400" />
      <p class="text-lg text-gray-800 dark:text-gray-200">
        <span class="text-teal-700 dark:text-teal-400 font-semibold">Click to choose</span> or drag
        and drop a cubemap
      </p>
    </div>
  </div>
</template>
