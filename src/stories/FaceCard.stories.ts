import FaceCard from '@/components/FaceCard.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import faceImg from '../../docs/img/face_right.png?url';
import { fn } from 'storybook/test';

const meta = {
  title: 'FaceCard',
  component: FaceCard,
  tags: ['autodocs'],
  args: {
    faceName: 'right',
    imageUrl: faceImg,
    rotation: 0,
    isDragging: false,
    onDragOver: fn(),
    onDragStart: fn(),
    onDrop: fn(),
    onRotate: fn(),
  },
} satisfies Meta<typeof FaceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightMode: Story = {
  decorators: [
    () => ({
      template: '<div style="width: 20rem;"><story /></div>',
    }),
  ],
};

export const DarkMode: Story = {
  decorators: [
    () => ({
      template: '<div class="dark" style="width: 20rem;"><story /></div>',
    }),
  ],
};

export const Rotated: Story = {
  args: {
    rotation: 90,
  },
  decorators: [
    () => ({
      template: '<div style="width: 20rem;"><story /></div>',
    }),
  ],
};
