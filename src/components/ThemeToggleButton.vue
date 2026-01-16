<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Sun, Moon } from 'lucide-vue-next';

const isDarkMode = ref(false);

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;

  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

onMounted(() => {
  // Check if user has a saved preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;

  isDarkMode.value = savedTheme === 'dark' || (!savedTheme && prefersDark);

  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  }
});
</script>
<template>
  <button
    @click="toggleDarkMode"
    class="fixed top-6 end-6 z-50 p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
    :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Sun v-if="isDarkMode" class="size-5" />
    <Moon v-else class="size-5" />
  </button>
</template>
