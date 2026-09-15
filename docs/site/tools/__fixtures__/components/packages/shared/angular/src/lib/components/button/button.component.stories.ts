import type { Meta, StoryObj } from '@storybook/angular'

const meta: Meta = {
  title: 'Components/Button',
  component: ButtonComponent,
}

export default meta

// #region usage
export const Playground: Story = {
  args: { label: 'Save' },
}
// #endregion
