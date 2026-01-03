import ErrorCard from '@/components/ErrorCard.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'ErrorCard',
  component: ErrorCard,
  tags: ['autodocs'],
  args: {
    error: 'An unexpected error occurred.',
  },
} satisfies Meta<typeof ErrorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightMode: Story = {};

export const DarkMode: Story = {
  decorators: [
    () => ({
      template:
        '<div class="dark" style="background-color: #101828; padding: 1rem"><story /></div>',
    }),
  ],
};
