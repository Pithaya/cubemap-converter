<script setup lang="ts">
import { ref, computed } from 'vue';
import { Download, X } from 'lucide-vue-next';
import FaceCard from './FaceCard.vue';
import type { CubeFaces } from '@/types/cubemap';
import { CUBEMAP_POSITIONS, type Position } from '@/types/position';
import type { CustomFaceData } from '@/types/custom-face-data';
import EmptyCard from './EmptyCard.vue';
import PrimaryButton from './PrimaryButton.vue';
import TertiaryButton from './TertiaryButton.vue';

type CubemapCellId = `${number}-${number}`;

type CubemapCell = {
  id: CubemapCellId;
  faceName: keyof CubeFaces | null;
  position: Position;
};

type Props = {
  isOpen: boolean;
  faces: Record<keyof CubeFaces, string>;
};

type Emits = {
  (e: 'close'): [];
  (e: 'generate', faces: Record<keyof CubeFaces, CustomFaceData>): [];
};

defineProps<Props>();
const emit = defineEmits<Emits>();

const initialFacePositions: Record<keyof CubeFaces, Position> = {
  right: { x: 0, y: 0 },
  left: { x: 1, y: 0 },
  top: { x: 2, y: 0 },
  bottom: { x: 3, y: 0 },
  front: { x: 4, y: 0 },
  back: { x: 5, y: 0 },
};

const facePositions = ref<Record<keyof CubeFaces, Position>>(structuredClone(initialFacePositions));

const faceRotations = ref<Record<keyof CubeFaces, number>>({
  right: 0,
  left: 0,
  top: 0,
  bottom: 0,
  front: 0,
  back: 0,
});

const draggedCell = ref<CubemapCell | null>(null);

const cells = computed<Map<CubemapCellId, CubemapCell>>(() => {
  const result: Map<CubemapCellId, CubemapCell> = new Map();

  for (const position of CUBEMAP_POSITIONS) {
    const currentCell: CubemapCell = {
      id: `${position.x}-${position.y}`,
      faceName: null,
      position,
    };

    const faceAtPosition = Object.entries(facePositions.value).find(
      ([, pos]) => pos.x === position.x && pos.y === position.y,
    );

    if (faceAtPosition) {
      const [faceName] = faceAtPosition;
      currentCell.faceName = faceName as keyof CubeFaces;
    }

    result.set(currentCell.id, currentCell);
  }

  return result;
});

function handleRotate(face: keyof CubeFaces, rotation: number) {
  faceRotations.value[face] = rotation;
}

function handleDragStart(cell: CubemapCell) {
  draggedCell.value = cell;
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
}

function handleDrop(targetCell: CubemapCell) {
  if (!draggedCell.value) return;

  const targetFace =
    cells.value.get(`${targetCell.position.x}-${targetCell.position.y}`)?.faceName ?? null;

  if (targetFace) {
    // Switch positions
    facePositions.value[targetFace] = draggedCell.value.position;
  }

  facePositions.value[draggedCell.value.faceName as keyof CubeFaces] = targetCell.position;

  draggedCell.value = null;
}

function handleGenerate() {
  const facesData: Record<keyof CubeFaces, CustomFaceData> = {
    right: { position: facePositions.value.right, rotation: faceRotations.value.right },
    left: { position: facePositions.value.left, rotation: faceRotations.value.left },
    top: { position: facePositions.value.top, rotation: faceRotations.value.top },
    bottom: { position: facePositions.value.bottom, rotation: faceRotations.value.bottom },
    front: { position: facePositions.value.front, rotation: faceRotations.value.front },
    back: { position: facePositions.value.back, rotation: faceRotations.value.back },
  };

  emit('generate', facesData);
}

function handleClose() {
  emit('close');
}

function handleReset() {
  facePositions.value = structuredClone(initialFacePositions);
  faceRotations.value = {
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    front: 0,
    back: 0,
  };
}
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div
          class="flex flex-col px-6 pt-6 pb-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-20"
        >
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Custom cubemap</h2>
            <button
              @click="handleClose"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <p class="text-gray-600 dark:text-gray-400">
            Drag and drop faces to reorder them, and rotate each face as needed.
          </p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-6 gap-2 mb-6">
            <template v-for="[cellId, cell] of cells" :key="cellId">
              <FaceCard
                v-if="cell.faceName"
                :face-name="cell.faceName"
                :image-url="faces[cell.faceName]"
                :rotation="faceRotations[cell.faceName]"
                :is-dragging="draggedCell?.id === cellId"
                @rotate="handleRotate(cell.faceName, $event)"
                @drag-start="handleDragStart(cell)"
                @drag-over="handleDragOver"
                @drop="handleDrop(cell)"
              />
              <EmptyCard v-else @drop="handleDrop(cell)" />
            </template>
          </div>

          <div class="flex gap-3 justify-end">
            <TertiaryButton @click="handleClose"> Cancel </TertiaryButton>
            <TertiaryButton @click="handleReset"> Reset </TertiaryButton>

            <PrimaryButton @click="handleGenerate">
              <Download class="w-5 h-5" /> Generate Cubemap
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.2s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
