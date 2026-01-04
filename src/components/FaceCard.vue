<script setup lang="ts">
import { computed } from 'vue';
import { RotateCw } from 'lucide-vue-next';

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
    class="relative rounded-lg border-2 border-transparent transition-all duration-200 cursor-move overflow-hidden"
    :class="{
      'border-teal-500 dark:border-teal-400 shadow-lg': isDragging,
      'hover:border-teal-500 dark:hover:border-teal-400': !isDragging,
    }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <button
      @click.stop="handleRotate"
      class="absolute top-2 right-2 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer"
      :aria-label="`Rotate ${faceName} face`"
    >
      <RotateCw class="w-4 h-4 text-teal-700 dark:text-teal-400" />
    </button>

    <div class="aspect-square group">
      <img
        :src="imageUrl"
        :alt="`${faceName} face`"
        class="w-full h-full object-cover"
        :style="{ transform: `rotate(${rotationDegrees}deg)` }"
      />

      <div
        class="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm py-1 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-200"
      >
        <p class="text-center">
          <span class="text-xs font-semibold text-white capitalize me-1">
            {{ faceName }}
          </span>
          <span v-if="rotation !== 0" class="text-xs text-white/80 mt-0.5">({{ rotation }}°)</span>
        </p>
      </div>
    </div>
  </div>
</template>
