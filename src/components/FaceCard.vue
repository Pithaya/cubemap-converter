<script setup lang="ts">
import { computed } from 'vue';
import { RotateCw, GripVertical } from 'lucide-vue-next';

type Props = {
  faceName: string;
  imageUrl: string;
  rotation: number;
  isDragging: boolean;
};

type Emits = {
  (e: 'rotate', rotation: number): void;
  (e: 'dragStart'): void;
  (e: 'dragOver', event: DragEvent): void;
  (e: 'drop'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const rotationDegrees = computed(() => props.rotation);

function handleRotate() {
  const newRotation = (props.rotation + 90) % 360;
  emit('rotate', newRotation);
}

function handleDragStart(event: DragEvent) {
  emit('dragStart');
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  emit('dragOver', event);
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  emit('drop');
}
</script>

<template>
  <div
    class="relative bg-gray-50 dark:bg-gray-700 rounded-lg border-2 transition-all duration-200 cursor-move"
    :class="{
      'border-teal-500 dark:border-teal-400 shadow-lg scale-105': isDragging,
      'border-gray-200 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-400':
        !isDragging,
    }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <div
      class="absolute top-2 left-2 z-10 p-1 bg-white/80 dark:bg-gray-800/80 rounded backdrop-blur-sm"
    >
      <GripVertical class="w-4 h-4 text-gray-600 dark:text-gray-400" />
    </div>

    <button
      @click.stop="handleRotate"
      class="absolute top-2 right-2 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors"
      :aria-label="`Rotate ${faceName} face`"
    >
      <RotateCw class="w-4 h-4 text-teal-700 dark:text-teal-400" />
    </button>

    <div class="px-4 pt-4 pb-2">
      <div class="aspect-square overflow-hidden rounded-lg bg-white dark:bg-gray-900 mb-2">
        <img
          :src="imageUrl"
          :alt="`${faceName} face`"
          class="w-full h-full object-contain"
          :style="{ transform: `rotate(${rotationDegrees}deg)` }"
        />
      </div>

      <p class="text-center">
        <span class="text-sm font-semibold text-gray-900 dark:text-white capitalize">
          {{ faceName }}
        </span>
        <span v-if="rotation !== 0" class="text-xs text-gray-600 dark:text-gray-400">
          ({{ rotation }}°)
        </span>
      </p>
    </div>
  </div>
</template>
