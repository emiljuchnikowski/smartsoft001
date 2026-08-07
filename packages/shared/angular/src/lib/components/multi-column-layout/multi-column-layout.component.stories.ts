import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { MultiColumnLayoutComponent } from './multi-column-layout.component';
import { MultiColumnLayoutPresetComponent } from './preset/preset.component';
import { MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const WIDTHS = ['full', 'constrained'] as const;
const SECONDARY_WIDTHS = ['sm', 'md', 'lg'] as const;

interface MultiColumnLayoutArgs {
  title: string;
  width: (typeof WIDTHS)[number];
  secondaryWidth: (typeof SECONDARY_WIDTHS)[number];
  withNav: boolean;
  withSecondary: boolean;
  withHeader: boolean;
}

const meta: Meta<MultiColumnLayoutArgs> = {
  title: 'Components/MultiColumnLayout',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      // MultiColumnLayoutPresetComponent is used through its own selector
      // because <smart-multi-column-layout> dispatches through
      // NgComponentOutlet once the token is registered, which drops the
      // projected main content.
      imports: [MultiColumnLayoutComponent, MultiColumnLayoutPresetComponent],
      providers: [
        {
          provide: MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN,
          useValue: MultiColumnLayoutPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    title: {
      control: 'text',
      description: 'Fallback heading used when `headerTpl` is not supplied.',
    },
    width: { control: 'inline-radio', options: WIDTHS },
    secondaryWidth: { control: 'inline-radio', options: SECONDARY_WIDTHS },
    withNav: { control: 'boolean' },
    withSecondary: { control: 'boolean' },
    withHeader: { control: 'boolean' },
  },
  args: {
    title: 'Inbox',
    width: 'full',
    secondaryWidth: 'sm',
    withNav: true,
    withSecondary: true,
    withHeader: true,
  },
};

export default meta;
type Story = StoryObj<MultiColumnLayoutArgs>;

const SLOTS = `
  <ng-template #navTpl>
    <nav class="smart:flex smart:flex-col smart:gap-2 smart:p-4 smart:text-sm smart:text-gray-600 smart:dark:text-gray-300">
      <a href="#" class="smart:font-medium smart:text-gray-900 smart:dark:text-white">Inbox</a>
      <a href="#">Sent</a>
      <a href="#">Drafts</a>
      <a href="#">Archive</a>
    </nav>
  </ng-template>

  <ng-template #headerTpl>
    <div class="smart:flex smart:items-center smart:justify-between">
      <h1 class="smart:text-2xl smart:font-semibold smart:text-gray-900 smart:dark:text-white">Inbox</h1>
      <button class="smart:rounded-md smart:bg-teal-600 smart:px-3 smart:py-2 smart:text-sm smart:font-medium smart:text-white">
        Compose
      </button>
    </div>
  </ng-template>

  <ng-template #secondaryTpl>
    <div class="smart:p-4 smart:text-sm smart:text-gray-600 smart:dark:text-gray-300">
      <p class="smart:font-medium smart:text-gray-900 smart:dark:text-white">Filters</p>
      <ul class="smart:mt-2 smart:space-y-1">
        <li>Unread</li>
        <li>Flagged</li>
        <li>Attachments</li>
      </ul>
    </div>
  </ng-template>
`;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      build: (nav: unknown, secondary: unknown, header: unknown) => ({
        title: args.title,
        width: args.width,
        secondaryWidth: args.secondaryWidth,
        navTpl: args.withNav ? nav : undefined,
        secondaryTpl: args.withSecondary ? secondary : undefined,
        headerTpl: args.withHeader ? header : undefined,
      }),
    },
    template: `
      ${SLOTS}
      <div style="padding: 24px;">
        <smart-multi-column-layout-preset
          [options]="build(navTpl, secondaryTpl, headerTpl)"
        >
          <p class="smart:text-gray-600 smart:dark:text-gray-300">
            Main content projected into the layout body.
          </p>
        </smart-multi-column-layout-preset>
      </div>
    `,
  }),
};

const layout = (body: string, options: string) => `
  <smart-multi-column-layout-preset [options]="${options}">
    <p class="smart:text-gray-600 smart:dark:text-gray-300">${body}</p>
  </smart-multi-column-layout-preset>
`;

const section = (title: string, body: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    <div style="display: grid; gap: 24px;">${body}</div>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      ${SLOTS}

      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section(
          'Width',
          WIDTHS.map((width) =>
            layout(
              `width: ${width}`,
              `{ headerTpl: headerTpl, navTpl: navTpl, secondaryTpl: secondaryTpl, width: '${width}', secondaryWidth: 'sm' }`,
            ),
          ).join('\n'),
        )}

        ${section(
          'Secondary column width',
          SECONDARY_WIDTHS.map((secondaryWidth) =>
            layout(
              `secondaryWidth: ${secondaryWidth}`,
              `{ headerTpl: headerTpl, navTpl: navTpl, secondaryTpl: secondaryTpl, width: 'full', secondaryWidth: '${secondaryWidth}' }`,
            ),
          ).join('\n'),
        )}

        ${section(
          'Header: title fallback vs headerTpl',
          [
            layout(
              'title fallback (no headerTpl)',
              `{ title: 'Reports', navTpl: navTpl, secondaryTpl: secondaryTpl, width: 'full' }`,
            ),
            layout(
              'custom headerTpl',
              `{ headerTpl: headerTpl, navTpl: navTpl, secondaryTpl: secondaryTpl, width: 'full' }`,
            ),
          ].join('\n'),
        )}

        ${section(
          'Optional columns',
          [
            layout(
              'no nav',
              `{ title: 'No nav', secondaryTpl: secondaryTpl, width: 'full' }`,
            ),
            layout(
              'no secondary column',
              `{ title: 'No secondary', navTpl: navTpl, width: 'full' }`,
            ),
            layout(
              'main content only',
              `{ title: 'Main only', width: 'full' }`,
            ),
          ].join('\n'),
        )}

      </div>
    `,
  }),
};
