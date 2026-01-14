<script setup lang="ts">
import type { CubeFaces } from '@/types/cubemap';
import DefaultCard from './DefaultCard.vue';
import DetectedImagePreviewFace from './DetectedImagePreviewFace.vue';

type Props = {
  sourceImageUrl: string;
  facesUrls: Record<keyof CubeFaces, string>;
};

defineProps<Props>();
</script>
<template>
  <div class="@container w-full">
    <div class="grid gap-3 grid-cols-1 @lg:grid-rows-[min-content_auto] @lg:grid-cols-[2fr_1fr]">
      <h2 class="text-gray-900 dark:text-white text-center text-2xl font-semibold">
        Uploaded image
      </h2>

      <h2
        class="text-gray-900 dark:text-white text-center text-2xl font-semibold @lg:order-0 order-3"
      >
        Extracted Faces
      </h2>

      <DefaultCard class="flex justify-center @lg:order-0 order-2">
        <div
          class="bg-white dark:bg-gray-900 rounded-lg w-full flex justify-center min-h-52"
          :style="{
            backgroundImage: `url(${sourceImageUrl})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }"
        ></div>
      </DefaultCard>

      <DefaultCard class="@lg:order-0 order-4">
        <div class="grid grid-rows-1 @lg:grid-rows-3 grid-cols-3 @lg:grid-cols-1 @lg:gap-2 gap-4">
          <div class="flex flex-col @lg:flex-row @lg:gap-4 gap-2">
            <DetectedImagePreviewFace face-name="right" :url="facesUrls.right" />
            <DetectedImagePreviewFace face-name="left" :url="facesUrls.left" />
          </div>
          <div class="flex flex-col @lg:flex-row @lg:gap-4 gap-2">
            <DetectedImagePreviewFace face-name="top" :url="facesUrls.top" />
            <DetectedImagePreviewFace face-name="bottom" :url="facesUrls.bottom" />
          </div>
          <div class="flex flex-col @lg:flex-row @lg:gap-4 gap-2">
            <DetectedImagePreviewFace face-name="front" :url="facesUrls.front" />
            <DetectedImagePreviewFace face-name="back" :url="facesUrls.back" />
          </div>
        </div>
      </DefaultCard>
    </div>
  </div>
</template>
