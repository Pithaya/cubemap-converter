<script setup lang="ts">
import { ref } from 'vue';

const isDragging = ref(false);

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  isDragging.value = true;
}

function handleDragLeave() {
  isDragging.value = false;
}
</script>
<template>
  <div
    class="w-full h-full aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500"
    :class="{
      'border-teal-500 bg-teal-50 dark:border-teal-400 dark:bg-gray-700': isDragging,
    }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
  >
    Empty
  </div>
</template>
