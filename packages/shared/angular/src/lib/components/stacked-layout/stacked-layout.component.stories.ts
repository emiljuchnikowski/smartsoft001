import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { StackedLayoutPresetComponent } from './preset/preset.component';
import { StackedLayoutComponent } from './stacked-layout.component';
import { STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const CONTAINER_WIDTHS = ['sm', 'md', 'lg', 'xl', 'full'] as const;

interface StackedLayoutArgs {
  title: string;
  containerWidth: (typeof CONTAINER_WIDTHS)[number];
  withNav: boolean;
  withHeader: boolean;
}

const meta: Meta<StackedLayoutArgs> = {
  title: 'Components/StackedLayout',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      // StackedLayoutPresetComponent is used through its own selector because
      // <smart-stacked-layout> dispatches through NgComponentOutlet once the
      // token is registered, which drops the projected main content.
      imports: [StackedLayoutComponent, StackedLayoutPresetComponent],
      providers: [
        {
          provide: STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN,
          useValue: StackedLayoutPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    title: {
      control: 'text',
      description: 'Fallback heading used when `headerTpl` is not supplied.',
    },
    containerWidth: { control: 'select', options: CONTAINER_WIDTHS },
    withNav: { control: 'boolean' },
    withHeader: { control: 'boolean' },
  },
  args: {
    title: 'Projects',
    containerWidth: 'xl',
    withNav: true,
    withHeader: true,
  },
};

export default meta;
type Story = StoryObj<StackedLayoutArgs>;

const SLOTS = `
  <ng-template #navTpl>
    <div class="smart:flex smart:items-center smart:justify-between">
      <span class="smart:text-lg smart:font-bold smart:text-gray-900 smart:dark:text-white">Acme Inc.</span>
      <nav class="smart:flex smart:gap-4 smart:text-sm smart:text-gray-600 smart:dark:text-gray-300">
        <a href="#">Dashboard</a>
        <a href="#">Team</a>
        <a href="#">Projects</a>
      </nav>
    </div>
  </ng-template>

  <ng-template #headerTpl>
    <div class="smart:flex smart:items-center smart:justify-between">
      <h1 class="smart:text-2xl smart:font-semibold smart:text-gray-900 smart:dark:text-white">Projects</h1>
      <button class="smart:rounded-md smart:bg-teal-600 smart:px-3 smart:py-2 smart:text-sm smart:font-medium smart:text-white">
        New project
      </button>
    </div>
  </ng-template>
`;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      build: (nav: unknown, header: unknown) => ({
        title: args.title,
        containerWidth: args.containerWidth,
        navTpl: args.withNav ? nav : undefined,
        headerTpl: args.withHeader ? header : undefined,
      }),
    },
    template: `
      ${SLOTS}
      <div style="padding: 24px;">
        <smart-stacked-layout-preset [options]="build(navTpl, headerTpl)">
          <p class="smart:text-gray-600 smart:dark:text-gray-300">
            Main content projected into the layout body.
          </p>
        </smart-stacked-layout-preset>
      </div>
    `,
  }),
};

const layout = (body: string, options: string) => `
  <smart-stacked-layout-preset [options]="${options}">
    <p class="smart:text-gray-600 smart:dark:text-gray-300">${body}</p>
  </smart-stacked-layout-preset>
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
          'Container widths',
          CONTAINER_WIDTHS.map((containerWidth) =>
            layout(
              `containerWidth: ${containerWidth}`,
              `{ navTpl: navTpl, headerTpl: headerTpl, containerWidth: '${containerWidth}' }`,
            ),
          ).join('\n'),
        )}

        ${section(
          'Header: title fallback vs headerTpl',
          [
            layout(
              'title fallback (no headerTpl)',
              `{ title: 'Dashboard', navTpl: navTpl, containerWidth: 'md' }`,
            ),
            layout(
              'custom headerTpl',
              `{ navTpl: navTpl, headerTpl: headerTpl, containerWidth: 'md' }`,
            ),
          ].join('\n'),
        )}

        ${section(
          'Optional navigation',
          [
            layout(
              'with navTpl',
              `{ navTpl: navTpl, headerTpl: headerTpl, containerWidth: 'xl' }`,
            ),
            layout(
              'no navTpl',
              `{ title: 'No navigation', containerWidth: 'xl' }`,
            ),
          ].join('\n'),
        )}

      </div>
    `,
  }),
};
