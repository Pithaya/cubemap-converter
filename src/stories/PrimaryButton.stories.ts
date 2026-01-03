import PrimaryButton from '@/components/PrimaryButton.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';

const meta = {
  title: 'PrimaryButton',
  component: PrimaryButton,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
  render: (args) => ({
    components: { PrimaryButton },
    setup() {
      return { args };
    },
    template: '<PrimaryButton v-bind="args">Click me</PrimaryButton>',
  }),
} satisfies Meta<typeof PrimaryButton>;

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
