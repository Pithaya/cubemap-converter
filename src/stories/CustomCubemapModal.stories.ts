import CustomCubemapModal from '@/components/CustomCubemapModal.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import faceImg from '../../docs/img/face_right.png?url';

const meta = {
  title: 'CustomCubemapModal',
  component: CustomCubemapModal,
  tags: ['autodocs'],
  args: {
    isOpen: true,
    faces: {
      right: faceImg,
      left: faceImg,
      top: faceImg,
      bottom: faceImg,
      front: faceImg,
      back: faceImg,
    },
  },
} satisfies Meta<typeof CustomCubemapModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightMode: Story = {};

export const DarkMode: Story = {
  decorators: [
    () => ({
      template: '<div class="dark"><story /></div>',
    }),
  ],
};
