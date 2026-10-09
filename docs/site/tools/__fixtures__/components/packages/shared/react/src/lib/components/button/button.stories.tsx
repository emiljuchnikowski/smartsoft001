import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: 'Components/Button',
}

export default meta

// #region usage
export const Playground: Story = {
  args: { children: 'Save' },
}
// #endregion
