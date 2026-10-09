import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { SmartActionPanel } from './action-panel';
import { IActionPanelOptions, SmartActionPanelLayout } from '../../models';
import { SmartActionPanelPreset } from './preset/action-panel-preset';

const LAYOUTS: SmartActionPanelLayout[] = [
  'simple',
  'with-link',
  'right-button',
  'top-right-button',
  'with-toggle',
  'with-input',
  'well',
  'payment-method',
];

const ACTION_VARIANTS = ['primary', 'secondary', 'ghost', 'link'] as const;

interface ActionPanelArgs {
  title: string;
  description: string;
  layout: SmartActionPanelLayout;
  actionVariant: (typeof ACTION_VARIANTS)[number];
  withActions: boolean;
  withContent: boolean;
}

const meta: Meta<ActionPanelArgs> = {
  title: 'Components/Action panel',
  tags: ['autodocs'],
  // Register the preset as the replacement for the standard action-panel,
  // so every <SmartActionPanel> renders the styled card look.
  parameters: {
    smart: { components: { 'action-panel': SmartActionPanelPreset } },
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    layout: { control: 'select', options: LAYOUTS },
    actionVariant: { control: 'select', options: ACTION_VARIANTS },
    withActions: { control: 'boolean' },
    withContent: {
      control: 'boolean',
      description: 'Projects a card into `contentTpl`.',
    },
  },
  args: {
    title: 'Simple',
    description: 'Actions in a row beneath the content.',
    layout: 'simple',
    actionVariant: 'primary',
    withActions: true,
    withContent: false,
  },
};

export default meta;
type Story = StoryObj<ActionPanelArgs>;

// Theme-aware page surface. Story text inherits its colour from <body>, which
// preview-head.html flips to near-white in dark mode, so a hardcoded light
// background here would render invisible text.
const PAGE_CLASS = 'smart:bg-gray-100 smart:dark:bg-gray-800';

const toggle: ReactNode = (
  <button
    type="button"
    className="smart:relative smart:h-6 smart:w-11 smart:rounded-full smart:bg-blue-600"
  >
    <span className="smart:absolute smart:top-0.5 smart:right-0.5 smart:size-5 smart:rounded-full smart:bg-white"></span>
  </button>
);

const input: ReactNode = (
  <input
    type="text"
    placeholder="you@example.com"
    className="smart:w-full smart:rounded-lg smart:border smart:border-gray-200 smart:px-3 smart:py-2 smart:text-sm smart:dark:border-gray-700 smart:dark:bg-gray-800 smart:dark:text-white"
  />
);

const card: ReactNode = (
  <div className="smart:flex smart:items-center smart:gap-3 smart:rounded-lg smart:border smart:border-gray-200 smart:p-3 smart:text-sm smart:dark:border-gray-700">
    <span className="smart:font-medium smart:text-gray-900 smart:dark:text-white">
      Visa ending 4242
    </span>
  </div>
);

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div className={PAGE_CLASS} style={{ padding: 40 }}>
      <SmartActionPanel
        options={{
          layout: args.layout,
          title: args.title,
          description: args.description,
          actions: args.withActions
            ? [
                { id: 'save', label: 'Save', variant: args.actionVariant },
                { id: 'cancel', label: 'Cancel' },
              ]
            : undefined,
          contentTpl: args.withContent ? card : undefined,
        }}
      />
    </div>
  ),
};
// #endregion

// Every panel is wrapped in a <div>, and that wrapper, not the panel card, is
// the grid item, so the card keeps its natural height instead of stretching to
// the row.
const Host = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const panel = (
  layout: SmartActionPanelLayout,
  extra: Omit<IActionPanelOptions, 'layout'>,
) => (
  <Host>
    <SmartActionPanel options={{ layout, ...extra }} />
  </Host>
);

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const panelGrid = {
  display: 'grid',
  gap: 24,
  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      className={PAGE_CLASS}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        padding: 24,
      }}
    >
      <section>
        <h3 style={sectionTitle}>Layouts</h3>
        <div style={panelGrid}>
          {panel('simple', {
            title: 'Simple',
            description: 'Actions in a row beneath the content.',
            actions: [
              { id: 'save', label: 'Save', variant: 'primary' },
              { id: 'cancel', label: 'Cancel' },
            ],
          })}
          {panel('with-link', {
            title: 'With link',
            description: 'Actions rendered as inline text links.',
            actions: [
              { id: 'more', label: 'Learn more' },
              { id: 'docs', label: 'Read docs' },
            ],
          })}
          {panel('right-button', {
            title: 'Right button',
            description: 'Content on the left, actions on the right.',
            actions: [{ id: 'go', label: 'Continue', variant: 'primary' }],
          })}
          {panel('top-right-button', {
            title: 'Top right button',
            description: 'Actions sit in the title row.',
            actions: [{ id: 'edit', label: 'Edit' }],
          })}
          {panel('with-toggle', {
            title: 'With toggle',
            description: 'Enable notifications for this workspace.',
            contentTpl: toggle,
          })}
          {panel('with-input', {
            title: 'With input',
            description: 'Invite a teammate by email.',
            contentTpl: input,
            actions: [
              { id: 'invite', label: 'Send invite', variant: 'primary' },
            ],
          })}
          {panel('well', {
            title: 'Well',
            description: 'Content nested inside an inset panel.',
            contentTpl: card,
            actions: [{ id: 'change', label: 'Change' }],
          })}
          {panel('payment-method', {
            title: 'Payment method',
            description: 'Update the card used for billing.',
            contentTpl: card,
            actions: [{ id: 'update', label: 'Update', variant: 'primary' }],
          })}
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Action variants</h3>
        <div style={panelGrid}>
          {ACTION_VARIANTS.map((variant) => (
            <Host key={variant}>
              <SmartActionPanel
                options={{
                  layout: 'simple',
                  title: variant,
                  description: `Action rendered with variant: ${variant}.`,
                  actions: [{ id: variant, label: 'Action', variant }],
                }}
              />
            </Host>
          ))}
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Without actions</h3>
        <div style={panelGrid}>
          {panel('simple', {
            title: 'Content only',
            description: 'No actions — description and content slot only.',
            contentTpl: card,
          })}
        </div>
      </section>
    </div>
  ),
};
