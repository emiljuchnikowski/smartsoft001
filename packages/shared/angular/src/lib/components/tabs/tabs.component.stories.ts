import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { TabsPresetComponent } from './preset/preset.component';
import { TabsComponent } from './tabs.component';
import { ITabItem, SmartTabsLayout } from '../../models';
import { TABS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const LAYOUTS: SmartTabsLayout[] = [
  'underline',
  'underline-with-icons',
  'underline-with-badges',
  'underline-full-width',
  'pills',
  'pills-on-gray',
  'pills-with-brand-color',
  'bar-with-underline',
  'simple',
];

// Showcase headings read as prose, not as the raw option value.
const LAYOUT_LABELS: Record<SmartTabsLayout, string> = {
  underline: 'Underline',
  'underline-with-icons': 'Underline with icons',
  'underline-with-badges': 'Underline with badges',
  'underline-full-width': 'Underline, full width',
  pills: 'Pills',
  'pills-on-gray': 'Pills on gray',
  'pills-with-brand-color': 'Pills with brand color',
  'bar-with-underline': 'Bar with underline',
  simple: 'Simple',
};

const ITEMS: ITabItem[] = [
  { id: 'tab-1', label: 'Tab 1' },
  { id: 'tab-2', label: 'Tab 2' },
  { id: 'tab-3', label: 'Tab 3' },
];

const BADGE_ITEMS: ITabItem[] = [
  { id: 'tab-1', label: 'Tab 1', badge: '99+' },
  { id: 'tab-2', label: 'Tab 2', badge: 5 },
  { id: 'tab-3', label: 'Tab 3' },
];

interface TabsArgs {
  layout: SmartTabsLayout;
  selectedId: string;
}

const meta: Meta<TabsArgs> = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [TabsComponent],
      // Register the preset variation as the replacement for the standard
      // tabs, so every <smart-tabs> renders TabsPresetComponent.
      providers: [
        {
          provide: TABS_STANDARD_COMPONENT_TOKEN,
          useValue: TabsPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    layout: { control: 'select', options: LAYOUTS },
    selectedId: { control: 'select', options: ITEMS.map((i) => i.id) },
  },
  args: {
    layout: 'underline',
    selectedId: 'tab-1',
  },
};

export default meta;
type Story = StoryObj<TabsArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      selectedId: args.selectedId,
      options: {
        layout: args.layout,
        items: args.layout === 'underline-with-badges' ? BADGE_ITEMS : ITEMS,
        ariaLabel: 'Demo tabs',
        showMobileSelect: false,
      },
    },
    template: `
      <div style="padding: 40px; min-width: 480px;">
        <smart-tabs [options]="options" [selectedId]="selectedId"></smart-tabs>
      </div>
    `,
  }),
};

const layoutSection = (layout: SmartTabsLayout) => `
  <section style="margin-bottom: 32px;">
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${LAYOUT_LABELS[layout]}</h3>
    <smart-tabs
      [options]="{
        layout: '${layout}',
        items: ${layout === 'underline-with-badges' ? 'badgeItems' : 'items'},
        showMobileSelect: false
      }"
      selectedId="tab-1"
    ></smart-tabs>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { items: ITEMS, badgeItems: BADGE_ITEMS },
    template: `
      <div style="padding: 24px; min-width: 520px;">
        ${LAYOUTS.map(layoutSection).join('\n')}
      </div>
    `,
  }),
};
