import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

import { AngularComponent } from './angular.component';

const meta: Meta<AngularComponent> = {
  component: AngularComponent,
  title: 'AngularComponent',
};
export default meta;
type Story = StoryObj<AngularComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/angular works!/gi)).toBeTruthy();
  },
};
