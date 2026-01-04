import SecondaryButton from '@/components/SecondaryButton.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';

const meta = {
  title: 'Buttons/SecondaryButton',
  component: SecondaryButton,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
  render: (args) => ({
    components: { SecondaryButton },
    setup() {
      return { args };
    },
    template: '<SecondaryButton v-bind="args">Click me</SecondaryButton>',
  }),
} satisfies Meta<typeof SecondaryButton>;

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
