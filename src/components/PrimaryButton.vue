<script setup lang="ts">
type Emits = (e: 'click') => void;

const emit = defineEmits<Emits>();

const handleClick = () => {
  emit('click');
};
</script>

<template>
  <button
    class="w-full px-4 py-3 bg-teal-700 dark:bg-teal-400 text-white dark:text-gray-900 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-teal-600 dark:hover:bg-teal-300"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>
