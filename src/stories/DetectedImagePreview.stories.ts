import type { Meta, StoryObj } from '@storybook/vue3-vite';

import DetectedImagePreview from '../components/DetectedImagePreview.vue';
import horizontalCross from '../../docs/img/cubemap_horizontal_cross.png?url';
import wide from '../../docs/img/cubemap_6x1.png?url';
import tall from '../../docs/img/cubemap_1x6.png?url';
import faceImg from '../../docs/img/face_right.png?url';

const meta = {
  title: 'DetectedImagePreview',
  component: DetectedImagePreview,
  tags: ['autodocs'],
} satisfies Meta<typeof DetectedImagePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

const facesUrls = {
  right: faceImg,
  left: faceImg,
  top: faceImg,
  bottom: faceImg,
  front: faceImg,
  back: faceImg,
};

export const LightMode: Story = {
  args: {
    sourceImageUrl: horizontalCross,
    facesUrls,
  },
  decorators: [
    () => ({
      template: '<div><story /></div>',
    }),
  ],
};

export const DarkMode: Story = {
  args: {
    sourceImageUrl: horizontalCross,
    facesUrls,
  },
  decorators: [
    () => ({
      template: '<div class="dark" style="background-color: #101828"><story /></div>',
    }),
  ],
};

export const WideImage: Story = {
  args: {
    sourceImageUrl: wide,
    facesUrls,
  },
  decorators: [
    () => ({
      template: '<div><story /></div>',
    }),
  ],
};

export const TallImage: Story = {
  args: {
    sourceImageUrl: tall,
    facesUrls,
  },
  decorators: [
    () => ({
      template: '<div><story /></div>',
    }),
  ],
};
