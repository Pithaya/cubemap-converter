import DefaultCard from '@/components/DefaultCard.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'DefaultCard',
  component: DefaultCard,
  tags: ['autodocs'],
} satisfies Meta<typeof DefaultCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightMode: Story = {
  decorators: [
    () => ({
      template: '<div style="padding: 1rem"><story /></div>',
    }),
  ],
};

export const DarkMode: Story = {
  decorators: [
    () => ({
      template:
        '<div class="dark" style="background-color: #101828; padding: 1rem"><story /></div>',
    }),
  ],
};
