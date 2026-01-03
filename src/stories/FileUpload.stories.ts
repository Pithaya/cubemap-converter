import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { fn } from 'storybook/test';

import FileUpload from '../components/FileUpload.vue';

const meta = {
  title: 'FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  args: {
    onFileSelected: fn(),
  },
} satisfies Meta<typeof FileUpload>;

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
