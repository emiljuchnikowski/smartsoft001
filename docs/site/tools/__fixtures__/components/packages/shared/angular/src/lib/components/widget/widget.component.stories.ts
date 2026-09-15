import type { Meta, StoryObj } from '@storybook/angular'

const meta: Meta = {
  title: 'Smart-Widget/Widget',
  component: WidgetComponent,
}

export default meta

// #region usage
export const Playground: Story = {
  args: { label: 'Widget' },
}
// #endregion

export const AllVariants: Story = {}
