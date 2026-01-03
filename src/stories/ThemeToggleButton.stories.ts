import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ThemeToggleButton from '../components/ThemeToggleButton.vue';

const meta = {
  title: 'ThemeToggleButton',
  component: ThemeToggleButton,
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    () => ({
      template: '<div id="app"><story /></div>',
    }),
  ],
};
