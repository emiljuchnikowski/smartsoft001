import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { BreadcrumbsComponent } from './breadcrumbs.component';
import { BreadcrumbsPresetComponent } from './preset/preset.component';
import {
  IBreadcrumbsOptions,
  SmartBreadcrumbsLayout,
  SmartBreadcrumbsSeparator,
} from '../../models';
import { BREADCRUMBS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const ITEMS: IBreadcrumbsOptions['items'] = [
  { id: 'home', label: 'Home', href: '#' },
  { id: 'center', label: 'App Center', href: '#' },
  { id: 'app', label: 'Application', current: true },
];

interface BreadcrumbsArgs {
  separator: SmartBreadcrumbsSeparator;
  layout: SmartBreadcrumbsLayout | '';
  ariaLabel: string;
}

const meta: Meta<BreadcrumbsArgs> = {
  title: 'Components/Breadcrumbs',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BreadcrumbsComponent],
      // Register the preset variation as the replacement for the standard
      // breadcrumbs, so every <smart-breadcrumbs> renders the preset.
      providers: [
        {
          provide: BREADCRUMBS_STANDARD_COMPONENT_TOKEN,
          useValue: BreadcrumbsPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    separator: {
      control: 'radio',
      options: ['chevron', 'slash', 'arrow'],
    },
    layout: {
      control: 'select',
      options: [
        '',
        'contained',
        'full-width-bar',
        'simple-with-chevrons',
        'simple-with-slashes',
      ],
    },
    ariaLabel: { control: 'text' },
  },
  args: {
    separator: 'chevron',
    layout: '',
    ariaLabel: 'Breadcrumb',
  },
};

export default meta;
type Story = StoryObj<BreadcrumbsArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      options: {
        items: ITEMS,
        separator: args.separator,
        layout: args.layout || undefined,
        ariaLabel: args.ariaLabel,
      },
    },
    template: `
      <div style="padding: 40px;">
        <smart-breadcrumbs [options]="options"></smart-breadcrumbs>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      chevron: { items: ITEMS, separator: 'chevron' },
      slash: { items: ITEMS, separator: 'slash' },
      arrow: { items: ITEMS, separator: 'arrow' },
      contained: { items: ITEMS, separator: 'chevron', layout: 'contained' },
      fullWidth: {
        items: ITEMS,
        separator: 'chevron',
        layout: 'full-width-bar',
      },
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Chevron separators</h3>
          <smart-breadcrumbs [options]="chevron"></smart-breadcrumbs>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Slash separators</h3>
          <smart-breadcrumbs [options]="slash"></smart-breadcrumbs>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Arrow separators</h3>
          <smart-breadcrumbs [options]="arrow"></smart-breadcrumbs>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Contained</h3>
          <smart-breadcrumbs [options]="contained"></smart-breadcrumbs>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Full-width bar</h3>
          <smart-breadcrumbs [options]="fullWidth"></smart-breadcrumbs>
        </section>

      </div>
    `,
  }),
};
