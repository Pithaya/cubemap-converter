import type { Meta, StoryObj } from '@storybook/vue3-vite';

import CubemapPreview from '../components/CubemapPreview.vue';
import { CubemapFormat } from '@/types/cubemap';
import horizontalCross from '../../docs/img/cubemap_horizontal_cross.png?url';
import wide from '../../docs/img/cubemap_6x1.png?url';
import tall from '../../docs/img/cubemap_1x6.png?url';

const meta = {
  title: 'CubemapPreview',
  component: CubemapPreview,
  tags: ['autodocs'],
} satisfies Meta<typeof CubemapPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightMode: Story = {
  args: {
    cubemap: {
      format: CubemapFormat.HORIZONTAL_CROSS,
      width: 2048,
      height: 1536,
      dataUrl: horizontalCross,
    },
  },
  decorators: [
    () => ({
      template: '<div class="p-8"><story /></div>',
    }),
  ],
};

export const DarkMode: Story = {
  args: {
    cubemap: {
      format: CubemapFormat.HORIZONTAL_CROSS,
      width: 2048,
      height: 1536,
      dataUrl: horizontalCross,
    },
  },
  decorators: [
    () => ({
      template: '<div class="dark p-8"><story /></div>',
    }),
  ],
};

export const WideImage: Story = {
  args: {
    cubemap: {
      format: CubemapFormat.ROW_6X1,
      width: 3072,
      height: 512,
      dataUrl: wide,
    },
  },
  decorators: [
    () => ({
      template: '<div class="p-8"><story /></div>',
    }),
  ],
};

export const TallImage: Story = {
  args: {
    cubemap: {
      format: CubemapFormat.COLUMN_1X6,
      width: 512,
      height: 3072,
      dataUrl: tall,
    },
  },
  decorators: [
    () => ({
      template: '<div class="p-8"><story /></div>',
    }),
  ],
};
