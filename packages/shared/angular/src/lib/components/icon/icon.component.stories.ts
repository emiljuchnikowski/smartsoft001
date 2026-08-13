import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { IconName } from './base/base.component';
import { IconComponent } from './icon.component';
import {
  IconPresetSize,
  IconPresetVariant,
} from './preset/preset-classes.util';
import { IconPresetComponent } from './preset/preset.component';

// `IconName` is a string-union type with no runtime counterpart, so the story
// declares its own list to iterate.
const ICON_NAMES: IconName[] = ['spinner', 'chevron-down', 'chevron-up'];
const VARIANTS: IconPresetVariant[] = ['plain', 'contained', 'soft'];
const SIZES: IconPresetSize[] = ['sm', 'md', 'lg'];

interface IconArgs {
  name: IconName;
  variant: IconPresetVariant;
  size: IconPresetSize;
  useCustomTemplate: boolean;
  cssClass: string;
}

const meta: Meta<IconArgs> = {
  title: 'Components/Icon',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      // Icon has no *_STANDARD_COMPONENT_TOKEN by design, so the preset is used
      // through its own <smart-icon-preset> selector rather than by DI swap.
      imports: [IconComponent, IconPresetComponent],
    }),
  ],
  argTypes: {
    name: { control: 'inline-radio', options: ICON_NAMES },
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    useCustomTemplate: {
      control: 'boolean',
      description:
        'Render a custom SVG through `template`, which wins over `name`.',
    },
    cssClass: { control: 'text', description: 'Passed through as `class`.' },
  },
  args: {
    name: 'spinner',
    variant: 'plain',
    size: 'md',
    useCustomTemplate: false,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<IconArgs>;

const HEART_TEMPLATE = `
  <ng-template #heart>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="smart:size-8 smart:text-pink-500"
    >
      <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4.5 4.5 8.5C19 16.65 12 21 12 21z"/>
    </svg>
  </ng-template>
`;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      name: args.name,
      variant: args.variant,
      size: args.size,
      cssClass: args.cssClass,
      useCustomTemplate: args.useCustomTemplate,
    },
    template: `
      ${HEART_TEMPLATE}
      <div style="padding: 40px; display: flex; gap: 24px; align-items: center;">
        <smart-icon-preset
          [name]="name"
          [variant]="variant"
          [size]="size"
          [class]="cssClass"
          [template]="useCustomTemplate ? heart : null"
        ></smart-icon-preset>
      </div>
    `,
  }),
};

const cell = (label: string, markup: string) => `
  <div style="text-align: center;">
    ${markup}
    <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">${label}</p>
  </div>
`;

const grid = (body: string) => `
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 24px; align-items: center; justify-items: center;">
    ${body}
  </div>
`;

const section = (title: string, body: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    ${body}
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      ${HEART_TEMPLATE}

      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${VARIANTS.map((variant) =>
          section(
            `Variant: ${variant}`,
            grid(
              ICON_NAMES.map((name) =>
                cell(
                  // The icon name is an API value, so it is marked up as code
                  // rather than presented as a prose label.
                  `<code>${name}</code>`,
                  `<smart-icon-preset variant="${variant}" name="${name}" size="md"></smart-icon-preset>`,
                ),
              ).join('\n'),
            ),
          ),
        ).join('\n')}

        ${section(
          'Sizes',
          grid(
            SIZES.map((size) =>
              cell(
                size,
                `<smart-icon-preset variant="contained" name="chevron-down" size="${size}"></smart-icon-preset>`,
              ),
            ).join('\n'),
          ),
        )}

        ${section(
          'Bare icon sized and coloured by class',
          grid(
            [
              cell(
                'indigo',
                `<smart-icon name="spinner" class="smart:size-8 smart:text-indigo-600"></smart-icon>`,
              ),
              cell(
                'red',
                `<smart-icon name="chevron-down" class="smart:size-8 smart:text-red-500"></smart-icon>`,
              ),
              cell(
                'green',
                `<smart-icon name="chevron-up" class="smart:size-8 smart:text-green-500"></smart-icon>`,
              ),
            ].join('\n'),
          ),
        )}

        ${section(
          'Custom SVG template (wins over name)',
          grid(
            [
              cell('bare icon', `<smart-icon [template]="heart"></smart-icon>`),
              cell(
                'preset, soft',
                `<smart-icon-preset variant="soft" size="lg" [template]="heart"></smart-icon-preset>`,
              ),
            ].join('\n'),
          ),
        )}

      </div>
    `,
  }),
};
