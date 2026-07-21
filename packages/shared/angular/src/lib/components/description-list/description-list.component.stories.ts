import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { DescriptionListComponent } from './description-list.component';
import { DescriptionListPresetComponent } from './preset/preset.component';
import { IDescriptionListOptions } from '../../models';
import { DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const meta: Meta<DescriptionListComponent> = {
  title: 'Components/Description list',
  component: DescriptionListComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<DescriptionListComponent>;

export const Preset: Story = {
  parameters: { controls: { disable: true } },
  // Register the preset variation as the replacement for the standard
  // component, so every <smart-description-list> renders the preset.
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN,
          useValue: DescriptionListPresetComponent,
        },
      ],
    }),
  ],
  render: () => ({
    props: {
      options: {
        title: 'Applicant Information',
        description: 'Personal details and application.',
        items: [
          { label: 'Full name', value: 'Margot Foster' },
          { label: 'Application for', value: 'Backend Developer' },
          { label: 'Email address', value: 'margotfoster@example.com' },
          { label: 'Salary expectation', value: '$120,000' },
        ],
      } as IDescriptionListOptions,
    },
    template: `
      <ng-template #action>
        <button
          type="button"
          class="smart:font-medium smart:text-indigo-600 smart:hover:text-indigo-500 smart:dark:text-indigo-400"
        >
          Update
        </button>
      </ng-template>

      <ng-template #attachments>
        <ul class="smart:divide-y smart:divide-gray-200 smart:dark:divide-gray-700 smart:rounded-md smart:border smart:border-gray-200 smart:dark:border-gray-700">
          <li class="smart:flex smart:items-center smart:justify-between smart:py-2 smart:px-3">
            <span>resume_backend_developer.pdf</span>
            <a href="#" class="smart:font-medium smart:text-indigo-600 smart:dark:text-indigo-400">Download</a>
          </li>
          <li class="smart:flex smart:items-center smart:justify-between smart:py-2 smart:px-3">
            <span>coverletter_backend_developer.pdf</span>
            <a href="#" class="smart:font-medium smart:text-indigo-600 smart:dark:text-indigo-400">Download</a>
          </li>
        </ul>
      </ng-template>

      <ng-template #footer>
        <a href="#" class="smart:font-medium smart:text-indigo-600 smart:dark:text-indigo-400">
          Read full application &rarr;
        </a>
      </ng-template>

      <div style="padding: 24px; max-width: 640px;">
        <smart-description-list
          [options]="{
            ...options,
            items: [
              { label: 'Full name', value: 'Margot Foster', actionTpl: action },
              ...options.items.slice(1),
            ],
            attachmentsTpl: attachments,
            footerTpl: footer,
          }"
        />
      </div>
    `,
  }),
};
