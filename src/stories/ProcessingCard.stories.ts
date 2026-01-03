import ProcessingCard from '@/components/ProcessingCard.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'ProcessingCard',
  component: ProcessingCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ProcessingCard>;

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
