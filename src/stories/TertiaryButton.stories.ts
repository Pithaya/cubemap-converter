import TertiaryButton from '@/components/TertiaryButton.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';

const meta = {
  title: 'Buttons/TertiaryButton',
  component: TertiaryButton,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
  render: (args) => ({
    components: { TertiaryButton },
    setup() {
      return { args };
    },
    template: '<TertiaryButton v-bind="args">Click me</TertiaryButton>',
  }),
} satisfies Meta<typeof TertiaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightMode: Story = {};

export const DarkMode: Story = {
  decorators: [
    () => ({
      template: '<div class="dark" style="background-color: #101828"><story /></div>',
    }),
  ],
};
