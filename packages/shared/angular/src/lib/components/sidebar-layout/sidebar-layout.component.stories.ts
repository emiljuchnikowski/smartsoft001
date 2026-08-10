import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SidebarLayoutPresetComponent } from './preset/preset.component';
import { SidebarLayoutComponent } from './sidebar-layout.component';
import { SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const POSITIONS = ['left', 'right'] as const;

interface SidebarLayoutArgs {
  title: string;
  sidebarPosition: (typeof POSITIONS)[number];
  condensed: boolean;
  withHeader: boolean;
}

const meta: Meta<SidebarLayoutArgs> = {
  title: 'Components/SidebarLayout',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      // SidebarLayoutPresetComponent is used through its own selector because
      // <smart-sidebar-layout> dispatches through NgComponentOutlet once the
      // token is registered, which drops the projected main content.
      imports: [SidebarLayoutComponent, SidebarLayoutPresetComponent],
      providers: [
        {
          provide: SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN,
          useValue: SidebarLayoutPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    title: {
      control: 'text',
      description: 'Fallback heading used when `headerTpl` is not supplied.',
    },
    sidebarPosition: { control: 'inline-radio', options: POSITIONS },
    condensed: {
      control: 'boolean',
      description: 'Narrow icon rail instead of the full sidebar.',
    },
    withHeader: { control: 'boolean' },
  },
  args: {
    title: 'Dashboard',
    sidebarPosition: 'left',
    condensed: false,
    withHeader: false,
  },
};

export default meta;
type Story = StoryObj<SidebarLayoutArgs>;

// `mobileBreakpoint` is intentionally absent — the preset does not consume it.
const SLOTS = `
  <ng-template #headerTpl>
    <div class="smart:flex smart:items-center smart:justify-between">
      <h1 class="smart:text-2xl smart:font-semibold smart:text-gray-900 smart:dark:text-white">Dashboard</h1>
      <button class="smart:rounded-md smart:bg-teal-600 smart:px-3 smart:py-2 smart:text-sm smart:font-medium smart:text-white">
        New item
      </button>
    </div>
  </ng-template>

  <ng-template #sidebarTpl>
    <nav class="smart:flex smart:flex-col smart:gap-2 smart:p-4 smart:text-sm smart:text-gray-600 smart:dark:text-gray-300">
      <a href="#">Overview</a>
      <a href="#">Team</a>
      <a href="#">Projects</a>
      <a href="#">Settings</a>
    </nav>
  </ng-template>

  <ng-template #condensedSidebarTpl>
    <nav class="smart:flex smart:flex-col smart:items-center smart:gap-4 smart:p-3 smart:text-gray-600 smart:dark:text-gray-300">
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </nav>
  </ng-template>
`;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      build: (
        sidebar: unknown,
        condensedSidebar: unknown,
        header: unknown,
      ) => ({
        title: args.title,
        sidebarTpl: args.condensed ? condensedSidebar : sidebar,
        headerTpl: args.withHeader ? header : undefined,
        sidebarPosition: args.sidebarPosition,
        condensed: args.condensed,
      }),
    },
    template: `
      ${SLOTS}
      <div style="padding: 24px;">
        <div style="height: 320px;">
          <smart-sidebar-layout-preset
            [options]="build(sidebarTpl, condensedSidebarTpl, headerTpl)"
          >
            <p class="smart:text-gray-600 smart:dark:text-gray-300">
              Main content projected into the layout body.
            </p>
          </smart-sidebar-layout-preset>
        </div>
      </div>
    `,
  }),
};

const layout = (body: string, options: string) => `
  <div style="height: 260px;">
    <smart-sidebar-layout-preset [options]="${options}">
      <p class="smart:text-gray-600 smart:dark:text-gray-300">${body}</p>
    </smart-sidebar-layout-preset>
  </div>
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
          'Sidebar position',
          POSITIONS.map((position) =>
            layout(
              `sidebarPosition: ${position}`,
              `{ title: 'Dashboard', sidebarTpl: sidebarTpl, sidebarPosition: '${position}' }`,
            ),
          ).join('\n'),
        )}

        ${section(
          'Condensed rail',
          layout(
            'condensed: true — narrow icon rail',
            `{ title: 'Condensed', sidebarTpl: condensedSidebarTpl, condensed: true }`,
          ),
        )}

        ${section(
          'Header: title fallback vs headerTpl',
          [
            layout(
              'title fallback (no headerTpl)',
              `{ title: 'Dashboard', sidebarTpl: sidebarTpl }`,
            ),
            layout(
              'custom headerTpl',
              `{ headerTpl: headerTpl, sidebarTpl: sidebarTpl }`,
            ),
          ].join('\n'),
        )}

      </div>
    `,
  }),
};
