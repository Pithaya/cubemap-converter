<script setup lang="ts">
type Emits = (e: 'click') => void;

const emit = defineEmits<Emits>();

const handleClick = () => {
  emit('click');
};
</script>

<template>
  <button
    class="px-4 py-3 bg-amber-300 text-gray-900 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-amber-200"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>
