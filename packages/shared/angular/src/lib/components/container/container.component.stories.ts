import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ContainerComponent } from './container.component';
import { ContainerPresetComponent } from './preset/preset.component';
import { CONTAINER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const MODES = ['full-width', 'constrained', 'container'] as const;

// Showcase headings read as prose, not as the raw option value.
const MODE_LABELS: Record<(typeof MODES)[number], string> = {
  'full-width': 'Full width',
  constrained: 'Constrained',
  container: 'Container',
};
const PADDINGS = ['none', 'mobile', 'always'] as const;

const PADDING_LABELS: Record<(typeof PADDINGS)[number], string> = {
  none: 'No padding',
  mobile: 'Padded on mobile only',
  always: 'Padded at every width',
};

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

// The container itself is a neutral layout primitive with no colours of its own,
// so the demo surfaces below supply them. They must be theme-aware Tailwind
// classes, not hardcoded hex: story text inherits its colour from <body>, which
// preview-head.html flips to near-white in dark mode — a hardcoded white box
// would render invisible text.
const PAGE_CLASS = 'smart:bg-gray-100 smart:dark:bg-gray-800';
const BOX_CLASS = [
  'smart:rounded-lg',
  'smart:border',
  'smart:border-gray-300',
  'smart:dark:border-gray-600',
  'smart:bg-white',
  'smart:dark:bg-gray-900',
  'smart:p-4',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: { options: { ...args } },
    template: `
      <div class="${PAGE_CLASS}" style="padding: 40px 0;">
        <smart-container-preset [options]="options">
          <div class="${BOX_CLASS}">
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
    <div class="${BOX_CLASS}">${label}</div>
  </smart-container-preset>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="${PAGE_CLASS}" style="display: flex; flex-direction: column; gap: 32px; padding: 24px 0;">

        ${MODES.map(
          (mode) => `
          <section>
            <h3 style="font-size: 16px; font-weight: 600; margin: 0 24px 12px;">${MODE_LABELS[mode]}</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${PADDINGS.map((padding) =>
                box(
                  PADDING_LABELS[padding],
                  `{ mode: '${mode}', padding: '${padding}' }`,
                ),
              ).join('\n')}
            </div>
          </section>`,
        ).join('\n')}

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin: 0 24px 12px;">Narrow, which overrides the mode</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${box(
              'Container, narrowed, padded at every width',
              `{ mode: 'container', narrow: true, padding: 'always' }`,
            )}
            ${box(
              'Full width, narrowed, padded on mobile only',
              `{ mode: 'full-width', narrow: true, padding: 'mobile' }`,
            )}
          </div>
        </section>

      </div>
    `,
  }),
};
