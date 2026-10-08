import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartNavbar } from './navbar';
import { INavbarOptions } from '../../models';
import { SmartNavbarPreset } from './preset/navbar-preset';

const ITEMS = [
  { id: 'landing', label: 'Landing', href: '#', current: true },
  { id: 'account', label: 'Account', href: '#' },
  { id: 'work', label: 'Work', href: '#' },
  { id: 'blog', label: 'Blog', href: '#' },
];

interface NavbarArgs {
  dark: boolean;
  menuButtonOnLeft: boolean;
  withSecondary: boolean;
}

const meta: Meta<NavbarArgs> = {
  title: 'Components/Navbar',
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // navbar, so every <SmartNavbar> renders SmartNavbarPreset.
    smart: { components: { navbar: SmartNavbarPreset } },
  },
  argTypes: {
    dark: { control: 'boolean' },
    menuButtonOnLeft: { control: 'boolean' },
    withSecondary: { control: 'boolean' },
  },
  args: {
    dark: false,
    menuButtonOnLeft: false,
    withSecondary: false,
  },
};

export default meta;
type Story = StoryObj<NavbarArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <SmartNavbar
      options={
        {
          dark: args.dark,
          menuButtonOnLeft: args.menuButtonOnLeft,
          logoUrl: 'https://avatars.githubusercontent.com/u/10416742?s=200&v=4',
          logoAlt: 'Brand',
          logoHref: '#',
          items: ITEMS,
          secondaryItems: args.withSecondary
            ? [
                { id: 'docs', label: 'Docs', href: '#' },
                { id: 'support', label: 'Support', href: '#' },
              ]
            : undefined,
        } as INavbarOptions
      }
    />
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const simple = { items: ITEMS } as INavbarOptions;
const withLogo = {
  logoUrl: 'https://avatars.githubusercontent.com/u/10416742?s=200&v=4',
  logoAlt: 'Brand',
  logoHref: '#',
  items: ITEMS,
} as INavbarOptions;
const withSecondary = {
  items: ITEMS,
  secondaryItems: [
    { id: 'docs', label: 'Docs', href: '#' },
    { id: 'support', label: 'Support', href: '#' },
    { id: 'status', label: 'Status', href: '#' },
  ],
} as INavbarOptions;
const dark = { dark: true, items: ITEMS } as INavbarOptions;

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
      <section>
        <h3 style={sectionTitle}>Simple</h3>
        <SmartNavbar options={simple} />
      </section>

      <section>
        <h3 style={sectionTitle}>With logo</h3>
        <SmartNavbar options={withLogo} />
      </section>

      <section>
        <h3 style={sectionTitle}>With secondary links</h3>
        <SmartNavbar options={withSecondary} />
      </section>

      <section>
        <h3 style={sectionTitle}>Dark</h3>
        <SmartNavbar options={dark} />
      </section>
    </div>
  ),
};
