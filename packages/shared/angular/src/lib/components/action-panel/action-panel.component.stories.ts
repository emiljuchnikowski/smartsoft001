import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ActionPanelComponent } from './action-panel.component';
import { ActionPanelPresetComponent } from './preset/preset.component';
import { SmartActionPanelLayout } from '../../models';
import { ACTION_PANEL_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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
  decorators: [
    moduleMetadata({
      imports: [ActionPanelComponent],
      // Register the preset as the replacement for the standard action-panel,
      // so every <smart-action-panel> renders the styled card look.
      providers: [
        {
          provide: ACTION_PANEL_STANDARD_COMPONENT_TOKEN,
          useValue: ActionPanelPresetComponent,
        },
      ],
    }),
  ],
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

const SLOTS = `
  <ng-template #toggle>
    <button type="button" class="smart:relative smart:h-6 smart:w-11 smart:rounded-full smart:bg-blue-600">
      <span class="smart:absolute smart:top-0.5 smart:right-0.5 smart:size-5 smart:rounded-full smart:bg-white"></span>
    </button>
  </ng-template>

  <ng-template #input>
    <input type="text" placeholder="you@example.com"
      class="smart:w-full smart:rounded-lg smart:border smart:border-gray-200 smart:px-3 smart:py-2 smart:text-sm smart:dark:border-gray-700 smart:dark:bg-gray-800 smart:dark:text-white" />
  </ng-template>

  <ng-template #card>
    <div class="smart:flex smart:items-center smart:gap-3 smart:rounded-lg smart:border smart:border-gray-200 smart:p-3 smart:text-sm smart:dark:border-gray-700">
      <span class="smart:font-medium smart:text-gray-900 smart:dark:text-white">Visa ending 4242</span>
    </div>
  </ng-template>
`;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      // Built in a props function so the TemplateRef declared in the template
      // can be passed in — Angular template expressions have no object spread.
      build: (contentTpl: unknown) => ({
        layout: args.layout,
        title: args.title,
        description: args.description,
        actions: args.withActions
          ? [
              { id: 'save', label: 'Save', variant: args.actionVariant },
              { id: 'cancel', label: 'Cancel' },
            ]
          : undefined,
        contentTpl: args.withContent ? contentTpl : undefined,
      }),
    },
    template: `
      ${SLOTS}
      <div class="${PAGE_CLASS}" style="padding: 40px;">
        <smart-action-panel [options]="build(card)"></smart-action-panel>
      </div>
    `,
  }),
};

const panel = (layout: SmartActionPanelLayout, extra: string) => `
  <smart-action-panel [options]="{
    layout: '${layout}',
    ${extra}
  }"></smart-action-panel>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      ${SLOTS}

      <div class="${PAGE_CLASS}" style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Layouts</h3>
          <div style="display: grid; gap: 24px; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));">
            ${panel(
              'simple',
              `title: 'Simple',
              description: 'Actions in a row beneath the content.',
              actions: [{ id: 'save', label: 'Save', variant: 'primary' }, { id: 'cancel', label: 'Cancel' }]`,
            )}
            ${panel(
              'with-link',
              `title: 'With link',
              description: 'Actions rendered as inline text links.',
              actions: [{ id: 'more', label: 'Learn more' }, { id: 'docs', label: 'Read docs' }]`,
            )}
            ${panel(
              'right-button',
              `title: 'Right button',
              description: 'Content on the left, actions on the right.',
              actions: [{ id: 'go', label: 'Continue', variant: 'primary' }]`,
            )}
            ${panel(
              'top-right-button',
              `title: 'Top right button',
              description: 'Actions sit in the title row.',
              actions: [{ id: 'edit', label: 'Edit' }]`,
            )}
            ${panel(
              'with-toggle',
              `title: 'With toggle',
              description: 'Enable notifications for this workspace.',
              contentTpl: toggle`,
            )}
            ${panel(
              'with-input',
              `title: 'With input',
              description: 'Invite a teammate by email.',
              contentTpl: input,
              actions: [{ id: 'invite', label: 'Send invite', variant: 'primary' }]`,
            )}
            ${panel(
              'well',
              `title: 'Well',
              description: 'Content nested inside an inset panel.',
              contentTpl: card,
              actions: [{ id: 'change', label: 'Change' }]`,
            )}
            ${panel(
              'payment-method',
              `title: 'Payment method',
              description: 'Update the card used for billing.',
              contentTpl: card,
              actions: [{ id: 'update', label: 'Update', variant: 'primary' }]`,
            )}
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Action variants</h3>
          <div style="display: grid; gap: 24px; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));">
            ${ACTION_VARIANTS.map((variant) =>
              panel(
                'simple',
                `title: '${variant}',
                description: 'Action rendered with variant: ${variant}.',
                actions: [{ id: '${variant}', label: 'Action', variant: '${variant}' }]`,
              ),
            ).join('\n')}
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Without actions</h3>
          <div style="display: grid; gap: 24px; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));">
            ${panel(
              'simple',
              `title: 'Content only',
              description: 'No actions — description and content slot only.',
              contentTpl: card`,
            )}
          </div>
        </section>

      </div>
    `,
  }),
};
