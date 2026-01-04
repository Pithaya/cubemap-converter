<script setup lang="ts">
type Emits = (e: 'click') => void;

const emit = defineEmits<Emits>();

const handleClick = () => {
  emit('click');
};
</script>

<template>
  <button
    @click="handleClick"
    class="cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    <slot></slot>
  </button>
</template>
