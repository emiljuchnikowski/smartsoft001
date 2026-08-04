import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ContainerComponent } from './container.component';
import { ContainerPresetComponent } from './preset/preset.component';
import { CONTAINER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const MODES = ['full-width', 'constrained', 'container'] as const;
const PADDINGS = ['none', 'mobile', 'always'] as const;

interface ContainerArgs {
  mode: (typeof MODES)[number];
  padding: (typeof PADDINGS)[number];
  narrow: boolean;
}

const meta: Meta<ContainerArgs> = {
  title: 'Components/Container',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      // ContainerPresetComponent must be imported because the story templates
      // use the <smart-container-preset> selector directly — <smart-container>
      // dispatches through NgComponentOutlet, which drops projected content.
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
  argTypes: {
    mode: { control: 'inline-radio', options: MODES },
    padding: { control: 'inline-radio', options: PADDINGS },
    narrow: {
      control: 'boolean',
      description: 'Forces max-w-3xl — wins over `mode`.',
    },
  },
  args: { mode: 'container', padding: 'always', narrow: false },
};

export default meta;
type Story = StoryObj<ContainerArgs>;

const BOX_STYLE =
  'background: #fff; border: 1px solid #d1d5db; border-radius: 8px; padding: 16px;';

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: { options: { ...args } },
    template: `
      <div style="padding: 40px 0; background: #f3f4f6;">
        <smart-container-preset [options]="options">
          <div style="${BOX_STYLE}">
            mode: {{ options.mode }} &middot; padding: {{ options.padding }}
            @if (options.narrow) { &middot; narrow }
          </div>
        </smart-container-preset>
      </div>
    `,
  }),
};

const box = (label: string, options: string) => `
  <smart-container-preset [options]="${options}">
    <div style="${BOX_STYLE}">${label}</div>
  </smart-container-preset>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px 0; background: #f3f4f6;">

        ${MODES.map(
          (mode) => `
          <section>
            <h3 style="font-size: 16px; font-weight: 600; margin: 0 24px 12px;">mode: ${mode}</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${PADDINGS.map((padding) =>
                box(
                  `padding: ${padding}`,
                  `{ mode: '${mode}', padding: '${padding}' }`,
                ),
              ).join('\n')}
            </div>
          </section>`,
        ).join('\n')}

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin: 0 24px 12px;">narrow (max-w-3xl, wins over mode)</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${box(
              'mode: container &middot; narrow &middot; padding: always',
              `{ mode: 'container', narrow: true, padding: 'always' }`,
            )}
            ${box(
              'mode: full-width &middot; narrow &middot; padding: mobile',
              `{ mode: 'full-width', narrow: true, padding: 'mobile' }`,
            )}
          </div>
        </section>

      </div>
    `,
  }),
};
