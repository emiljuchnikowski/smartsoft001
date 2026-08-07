import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { PageHeadingComponent } from './page-heading.component';
import { PageHeadingPresetComponent } from './preset/preset.component';
import { PAGE_HEADING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const LAYOUTS = ['links-left', 'links-center', 'links-right', 'user'] as const;

interface PageHeadingArgs {
  layout: (typeof LAYOUTS)[number];
  withNav: boolean;
  withActions: boolean;
  withAvatar: boolean;
}

const meta: Meta<PageHeadingArgs> = {
  title: 'Components/Page heading',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [PageHeadingComponent],
      // Register the HyperUI preset as the replacement for the standard
      // page-heading, so every <smart-page-heading> renders the navbar look.
      providers: [
        {
          provide: PAGE_HEADING_STANDARD_COMPONENT_TOKEN,
          useValue: PageHeadingPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    layout: { control: 'select', options: LAYOUTS },
    withNav: { control: 'boolean' },
    withActions: { control: 'boolean' },
    withAvatar: {
      control: 'boolean',
      description: 'Only rendered by the `user` layout.',
    },
  },
  args: {
    layout: 'links-left',
    withNav: true,
    withActions: true,
    withAvatar: false,
  },
};

export default meta;
type Story = StoryObj<PageHeadingArgs>;

// The preset consumes only logoTpl, navTpl, actionsTpl and avatarTpl — the
// remaining IPageHeadingOptions slots are standard-skin only.
const SLOTS = `
  <ng-template #logo>
    <a class="smart:block smart:text-teal-600 smart:dark:text-teal-300" href="#">
      <span class="smart:text-lg smart:font-bold">Acme</span>
    </a>
  </ng-template>

  <ng-template #nav>
    <ul class="smart:flex smart:items-center smart:gap-6 smart:text-sm">
      <li><a class="smart:text-gray-500 smart:transition smart:hover:text-gray-500/75 smart:dark:text-white smart:dark:hover:text-white/75" href="#">About</a></li>
      <li><a class="smart:text-gray-500 smart:transition smart:hover:text-gray-500/75 smart:dark:text-white smart:dark:hover:text-white/75" href="#">Careers</a></li>
      <li><a class="smart:text-gray-500 smart:transition smart:hover:text-gray-500/75 smart:dark:text-white smart:dark:hover:text-white/75" href="#">Contact</a></li>
    </ul>
  </ng-template>

  <ng-template #actions>
    <a class="smart:rounded-md smart:bg-teal-600 smart:px-5 smart:py-2.5 smart:text-sm smart:font-medium smart:text-white smart:shadow-sm smart:transition smart:hover:bg-teal-700 smart:dark:hover:bg-teal-500" href="#">Login</a>
    <a class="smart:rounded-md smart:bg-gray-100 smart:px-5 smart:py-2.5 smart:text-sm smart:font-medium smart:text-teal-600 smart:dark:bg-gray-800 smart:dark:text-white smart:dark:hover:text-white/75" href="#">Register</a>
  </ng-template>

  <ng-template #avatar>
    <img
      class="smart:size-10 smart:rounded-full smart:object-cover"
      src="https://avatars.githubusercontent.com/u/10416742?s=200&v=4"
      alt="User"
    />
  </ng-template>
`;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      build: (
        logo: unknown,
        nav: unknown,
        actions: unknown,
        avatar: unknown,
      ) => ({
        logoTpl: logo,
        navTpl: args.withNav ? nav : undefined,
        actionsTpl: args.withActions ? actions : undefined,
        avatarTpl: args.withAvatar ? avatar : undefined,
        presentation: { layout: args.layout },
      }),
    },
    template: `
      ${SLOTS}
      <div style="padding: 40px;">
        <smart-page-heading [options]="build(logo, nav, actions, avatar)" />
      </div>
    `,
  }),
};

const section = (title: string, options: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    <smart-page-heading [options]="${options}" />
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      ${SLOTS}

      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${LAYOUTS.filter((layout) => layout !== 'user')
          .map((layout) =>
            section(
              layout,
              `{ logoTpl: logo, navTpl: nav, actionsTpl: actions, presentation: { layout: '${layout}' } }`,
            ),
          )
          .join('\n')}

        ${section(
          'user (avatar)',
          `{ logoTpl: logo, navTpl: nav, avatarTpl: avatar, presentation: { layout: 'user' } }`,
        )}

        ${section(
          'Logo only',
          `{ logoTpl: logo, presentation: { layout: 'links-left' } }`,
        )}

        ${section(
          'Nav without actions',
          `{ logoTpl: logo, navTpl: nav, presentation: { layout: 'links-left' } }`,
        )}

      </div>
    `,
  }),
};
