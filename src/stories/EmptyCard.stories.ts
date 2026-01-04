import EmptyCard from '@/components/EmptyCard.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'EmptyCard',
  component: EmptyCard,
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyCard>;

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
      template:
        '<div class="dark" style="background-color: #101828; width: 20rem;"><story /></div>',
    }),
  ],
};
