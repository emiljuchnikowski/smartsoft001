import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NavbarComponent } from './navbar.component';
import { NavbarPresetComponent } from './preset/preset.component';
import { INavbarOptions } from '../../models';
import { NAVBAR_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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
  decorators: [
    moduleMetadata({
      imports: [NavbarComponent],
      // Register the preset variation as the replacement for the standard
      // navbar, so every <smart-navbar> renders NavbarPresetComponent.
      providers: [
        {
          provide: NAVBAR_STANDARD_COMPONENT_TOKEN,
          useValue: NavbarPresetComponent,
        },
      ],
    }),
  ],
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

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      options: {
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
      } as INavbarOptions,
    },
    template: `<smart-navbar [options]="options"></smart-navbar>`,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      simple: { items: ITEMS } as INavbarOptions,
      withLogo: {
        logoUrl: 'https://avatars.githubusercontent.com/u/10416742?s=200&v=4',
        logoAlt: 'Brand',
        logoHref: '#',
        items: ITEMS,
      } as INavbarOptions,
      withSecondary: {
        items: ITEMS,
        secondaryItems: [
          { id: 'docs', label: 'Docs', href: '#' },
          { id: 'support', label: 'Support', href: '#' },
          { id: 'status', label: 'Status', href: '#' },
        ],
      } as INavbarOptions,
      dark: { dark: true, items: ITEMS } as INavbarOptions,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Simple</h3>
          <smart-navbar [options]="simple"></smart-navbar>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With logo</h3>
          <smart-navbar [options]="withLogo"></smart-navbar>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With secondary links</h3>
          <smart-navbar [options]="withSecondary"></smart-navbar>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Dark</h3>
          <smart-navbar [options]="dark"></smart-navbar>
        </section>

      </div>
    `,
  }),
};
