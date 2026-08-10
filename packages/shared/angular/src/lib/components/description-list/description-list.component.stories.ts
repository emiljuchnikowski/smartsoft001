import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { DescriptionListComponent } from './description-list.component';
import { DescriptionListPresetComponent } from './preset/preset.component';
import { IDescriptionListOptions } from '../../models';
import { DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const ITEMS: IDescriptionListOptions['items'] = [
  { label: 'Full name', value: 'Margot Foster' },
  { label: 'Application for', value: 'Backend Developer' },
  { label: 'Email address', value: 'margotfoster@example.com' },
  { label: 'Salary expectation', value: '$120,000' },
];

interface DescriptionListArgs {
  title: string;
  description: string;
  itemCount: number;
  withItemAction: boolean;
  withAttachments: boolean;
  withFooter: boolean;
}

const meta: Meta<DescriptionListArgs> = {
  title: 'Components/Description list',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [DescriptionListComponent],
      // Register the preset variation as the replacement for the standard
      // component, so every <smart-description-list> renders the preset.
      providers: [
        {
          provide: DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN,
          useValue: DescriptionListPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    itemCount: { control: { type: 'range', min: 0, max: 4, step: 1 } },
    withItemAction: {
      control: 'boolean',
      description: 'Renders `actionTpl` on the first item.',
    },
    withAttachments: { control: 'boolean' },
    withFooter: { control: 'boolean' },
  },
  args: {
    title: 'Applicant Information',
    description: 'Personal details and application.',
    itemCount: 4,
    withItemAction: true,
    withAttachments: true,
    withFooter: true,
  },
};

export default meta;
type Story = StoryObj<DescriptionListArgs>;

const SLOTS = `
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
`;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      // Built in a props function so the TemplateRefs declared in the template
      // can be passed in — Angular template expressions have no object spread.
      build: (
        action: unknown,
        attachments: unknown,
        footer: unknown,
      ): IDescriptionListOptions => ({
        title: args.title,
        description: args.description,
        items: ITEMS.slice(0, args.itemCount).map((item, index) =>
          index === 0 && args.withItemAction
            ? { ...item, actionTpl: action as any }
            : item,
        ),
        attachmentsTpl: args.withAttachments ? (attachments as any) : undefined,
        footerTpl: args.withFooter ? (footer as any) : undefined,
      }),
    },
    template: `
      ${SLOTS}
      <div style="padding: 40px; max-width: 640px;">
        <smart-description-list [options]="build(action, attachments, footer)" />
      </div>
    `,
  }),
};

const section = (title: string, body: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    ${body}
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      items: ITEMS,
      longItems: [
        {
          label: 'About',
          value:
            'Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint.',
        },
      ] as IDescriptionListOptions['items'],
    },
    template: `
      ${SLOTS}

      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px; max-width: 640px;">

        ${section(
          'Title and description only',
          `<smart-description-list
             [options]="{
               title: 'Applicant Information',
               description: 'Personal details and application.',
               items: items
             }"
           />`,
        )}

        ${section(
          'Item with action slot',
          `<smart-description-list
             [options]="{
               title: 'With item action',
               items: [{ label: 'Full name', value: 'Margot Foster', actionTpl: action }]
             }"
           />`,
        )}

        ${section(
          'With attachments',
          `<smart-description-list
             [options]="{
               title: 'With attachments',
               items: items,
               attachmentsTpl: attachments
             }"
           />`,
        )}

        ${section(
          'With footer',
          `<smart-description-list
             [options]="{
               title: 'With footer',
               items: items,
               footerTpl: footer
             }"
           />`,
        )}

        ${section(
          'All slots combined',
          `<smart-description-list
             [options]="{
               title: 'Applicant Information',
               description: 'Personal details and application.',
               items: items,
               attachmentsTpl: attachments,
               footerTpl: footer
             }"
           />`,
        )}

        ${section(
          'Long wrapping value',
          `<smart-description-list [options]="{ title: 'Long value', items: longItems }" />`,
        )}

        ${section(
          'Empty (no items)',
          `<smart-description-list [options]="{ title: 'Empty state', items: [] }" />`,
        )}

      </div>
    `,
  }),
};
