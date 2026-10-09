import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: 'Components/Loader',
}

export default meta

// #region usage
export const Basic: Story = {
  args: { show: true },
}
// #endregion
