import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ContainerComponent } from './container.component';
import { ContainerPresetComponent } from './preset/preset.component';
import { CONTAINER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const meta: Meta<ContainerComponent> = {
  title: 'Components/Container',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      // ContainerPresetComponent must be imported because the story template
      // uses the <smart-container-preset> selector directly.
      imports: [ContainerComponent, ContainerPresetComponent],
      // The token registration below additionally swaps the preset in for
      // any <smart-container> usage rendered through the standard wrapper.
      providers: [
        {
          provide: CONTAINER_STANDARD_COMPONENT_TOKEN,
          useValue: ContainerPresetComponent,
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ContainerComponent>;

export const Preset: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 24px; background: #f3f4f6;">

        <smart-container-preset [options]="{ mode: 'container', padding: 'always' }">
          <div style="background: #fff; border: 1px solid #d1d5db; border-radius: 8px; padding: 16px;">
            mode: container &middot; padding: always (max-w-7xl, centered)
          </div>
        </smart-container-preset>

        <smart-container-preset [options]="{ mode: 'constrained', padding: 'always' }">
          <div style="background: #fff; border: 1px solid #d1d5db; border-radius: 8px; padding: 16px;">
            mode: constrained &middot; padding: always (max-w-5xl, centered)
          </div>
        </smart-container-preset>

        <smart-container-preset [options]="{ mode: 'constrained', narrow: true, padding: 'mobile' }">
          <div style="background: #fff; border: 1px solid #d1d5db; border-radius: 8px; padding: 16px;">
            mode: constrained &middot; narrow &middot; padding: mobile (max-w-3xl, centered)
          </div>
        </smart-container-preset>

        <smart-container-preset [options]="{ mode: 'full-width', padding: 'none' }">
          <div style="background: #fff; border: 1px solid #d1d5db; border-radius: 8px; padding: 16px;">
            mode: full-width &middot; padding: none (w-full, edge to edge)
          </div>
        </smart-container-preset>

      </div>
    `,
  }),
};
