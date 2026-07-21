import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ActionPanelComponent } from './action-panel.component';
import { ActionPanelPresetComponent } from './preset/preset.component';
import { ACTION_PANEL_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const meta: Meta = {
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
};

export default meta;
type Story = StoryObj;

export const Preset: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
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

      <div class="smart:grid smart:gap-6 smart:bg-gray-100 smart:p-6 smart:md:grid-cols-2 smart:dark:bg-gray-950">
        <smart-action-panel [options]="{
          layout: 'simple',
          title: 'Simple',
          description: 'Actions in a row beneath the content.',
          actions: [
            { id: 'save', label: 'Save', variant: 'primary' },
            { id: 'cancel', label: 'Cancel' }
          ]
        }"></smart-action-panel>

        <smart-action-panel [options]="{
          layout: 'with-link',
          title: 'With link',
          description: 'Actions rendered as inline text links.',
          actions: [
            { id: 'more', label: 'Learn more' },
            { id: 'docs', label: 'Read docs' }
          ]
        }"></smart-action-panel>

        <smart-action-panel [options]="{
          layout: 'right-button',
          title: 'Right button',
          description: 'Content on the left, actions on the right.',
          actions: [{ id: 'go', label: 'Continue', variant: 'primary' }]
        }"></smart-action-panel>

        <smart-action-panel [options]="{
          layout: 'top-right-button',
          title: 'Top right button',
          description: 'Actions sit in the title row.',
          actions: [{ id: 'edit', label: 'Edit' }]
        }"></smart-action-panel>

        <smart-action-panel [options]="{
          layout: 'with-toggle',
          title: 'With toggle',
          description: 'Enable notifications for this workspace.',
          contentTpl: toggle
        }"></smart-action-panel>

        <smart-action-panel [options]="{
          layout: 'with-input',
          title: 'With input',
          description: 'Invite a teammate by email.',
          contentTpl: input,
          actions: [{ id: 'invite', label: 'Send invite', variant: 'primary' }]
        }"></smart-action-panel>

        <smart-action-panel [options]="{
          layout: 'well',
          title: 'Well',
          description: 'Content nested inside an inset panel.',
          contentTpl: card,
          actions: [{ id: 'change', label: 'Change' }]
        }"></smart-action-panel>

        <smart-action-panel [options]="{
          layout: 'payment-method',
          title: 'Payment method',
          description: 'Update the card used for billing.',
          contentTpl: card,
          actions: [{ id: 'update', label: 'Update', variant: 'primary' }]
        }"></smart-action-panel>
      </div>
    `,
  }),
};
