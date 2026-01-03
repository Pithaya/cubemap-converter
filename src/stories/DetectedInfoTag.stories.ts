import DetectedInfoTag from '@/components/DetectedInfoTag.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'DetectedInfoTag',
  component: DetectedInfoTag,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    value: 'Value',
  },
} satisfies Meta<typeof DetectedInfoTag>;

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
