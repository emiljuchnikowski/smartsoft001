import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartPageHeading } from './page-heading';
import { IPageHeadingOptions } from '../../models';
import { SmartPageHeadingPreset } from './preset/page-heading-preset';

const LAYOUTS = ['links-left', 'links-center', 'links-right', 'user'] as const;

// Showcase headings read as prose, not as the raw option value.
const LAYOUT_LABELS: Record<(typeof LAYOUTS)[number], string> = {
  'links-left': 'Links left',
  'links-center': 'Links center',
  'links-right': 'Links right',
  user: 'User (avatar)',
};

interface PageHeadingArgs {
  layout: (typeof LAYOUTS)[number];
  withNav: boolean;
  withActions: boolean;
  withAvatar: boolean;
}

const meta: Meta<PageHeadingArgs> = {
  title: 'Components/Page heading',
  tags: ['autodocs'],
  parameters: {
    // Register the HyperUI preset as the replacement for the standard
    // page-heading, so every <SmartPageHeading> renders the navbar look.
    smart: { components: { 'page-heading': SmartPageHeadingPreset } },
  },
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
const logo = (
  <a
    className="smart:block smart:text-teal-600 smart:dark:text-teal-300"
    href="#"
  >
    <span className="smart:text-lg smart:font-bold">Acme</span>
  </a>
);

const navLinkClass =
  'smart:text-gray-500 smart:transition smart:hover:text-gray-500/75 smart:dark:text-white smart:dark:hover:text-white/75';

const nav = (
  <ul className="smart:flex smart:items-center smart:gap-6 smart:text-sm">
    <li>
      <a className={navLinkClass} href="#">
        About
      </a>
    </li>
    <li>
      <a className={navLinkClass} href="#">
        Careers
      </a>
    </li>
    <li>
      <a className={navLinkClass} href="#">
        Contact
      </a>
    </li>
  </ul>
);

const actions = (
  <>
    <a
      className="smart:rounded-md smart:bg-teal-600 smart:px-5 smart:py-2.5 smart:text-sm smart:font-medium smart:text-white smart:shadow-sm smart:transition smart:hover:bg-teal-700 smart:dark:hover:bg-teal-500"
      href="#"
    >
      Login
    </a>
    <a
      className="smart:rounded-md smart:bg-gray-100 smart:px-5 smart:py-2.5 smart:text-sm smart:font-medium smart:text-teal-600 smart:dark:bg-gray-800 smart:dark:text-white smart:dark:hover:text-white/75"
      href="#"
    >
      Register
    </a>
  </>
);

const avatar = (
  <img
    className="smart:size-10 smart:rounded-full smart:object-cover"
    src="https://avatars.githubusercontent.com/u/10416742?s=200&v=4"
    alt="User"
  />
);

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40 }}>
      <SmartPageHeading
        options={{
          logoTpl: logo,
          navTpl: args.withNav ? nav : undefined,
          actionsTpl: args.withActions ? actions : undefined,
          avatarTpl: args.withAvatar ? avatar : undefined,
          presentation: { layout: args.layout },
        }}
      />
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const Section = ({
  title,
  options,
}: {
  title: string;
  options: IPageHeadingOptions;
}) => (
  <section>
    <h3 style={sectionTitle}>{title}</h3>
    <SmartPageHeading options={options} />
  </section>
);

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        padding: 24,
      }}
    >
      {LAYOUTS.filter((layout) => layout !== 'user').map((layout) => (
        <Section
          key={layout}
          title={LAYOUT_LABELS[layout]}
          options={{
            logoTpl: logo,
            navTpl: nav,
            actionsTpl: actions,
            presentation: { layout },
          }}
        />
      ))}

      <Section
        title={LAYOUT_LABELS['user']}
        options={{
          logoTpl: logo,
          navTpl: nav,
          avatarTpl: avatar,
          presentation: { layout: 'user' },
        }}
      />

      <Section
        title="Logo only"
        options={{ logoTpl: logo, presentation: { layout: 'links-left' } }}
      />

      <Section
        title="Nav without actions"
        options={{
          logoTpl: logo,
          navTpl: nav,
          presentation: { layout: 'links-left' },
        }}
      />
    </div>
  ),
};
