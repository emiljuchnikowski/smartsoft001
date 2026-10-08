import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { SmartDescriptionList } from './description-list';
import { SmartDescriptionListPreset } from './preset/description-list-preset';
import { IDescriptionListOptions } from '../../models';

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
  parameters: {
    // Register the preset variation as the replacement for the standard
    // component, so every <SmartDescriptionList> renders the preset.
    smart: {
      components: { 'description-list': SmartDescriptionListPreset },
    },
  },
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

const action: ReactNode = (
  <button
    type="button"
    className="smart:font-medium smart:text-indigo-600 smart:hover:text-indigo-500 smart:dark:text-indigo-400"
  >
    Update
  </button>
);

const attachments: ReactNode = (
  <ul className="smart:divide-y smart:divide-gray-200 smart:dark:divide-gray-700 smart:rounded-md smart:border smart:border-gray-200 smart:dark:border-gray-700">
    <li className="smart:flex smart:items-center smart:justify-between smart:py-2 smart:px-3">
      <span>resume_backend_developer.pdf</span>
      <a
        href="#"
        className="smart:font-medium smart:text-indigo-600 smart:dark:text-indigo-400"
      >
        Download
      </a>
    </li>
    <li className="smart:flex smart:items-center smart:justify-between smart:py-2 smart:px-3">
      <span>coverletter_backend_developer.pdf</span>
      <a
        href="#"
        className="smart:font-medium smart:text-indigo-600 smart:dark:text-indigo-400"
      >
        Download
      </a>
    </li>
  </ul>
);

const footer: ReactNode = (
  <a
    href="#"
    className="smart:font-medium smart:text-indigo-600 smart:dark:text-indigo-400"
  >
    Read full application &rarr;
  </a>
);

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => {
    const options: IDescriptionListOptions = {
      title: args.title,
      description: args.description,
      items: ITEMS.slice(0, args.itemCount).map((item, index) =>
        index === 0 && args.withItemAction
          ? { ...item, actionTpl: action }
          : item,
      ),
      attachmentsTpl: args.withAttachments ? attachments : undefined,
      footerTpl: args.withFooter ? footer : undefined,
    };

    return (
      <div style={{ padding: 40, maxWidth: 640 }}>
        <SmartDescriptionList options={options} />
      </div>
    );
  },
};
// #endregion

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
    {children}
  </section>
);

const longItems: IDescriptionListOptions['items'] = [
  {
    label: 'About',
    value:
      'Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint.',
  },
];

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
        maxWidth: 640,
      }}
    >
      <Section title="Title and description only">
        <SmartDescriptionList
          options={{
            title: 'Applicant Information',
            description: 'Personal details and application.',
            items: ITEMS,
          }}
        />
      </Section>

      <Section title="Item with action slot">
        <SmartDescriptionList
          options={{
            title: 'With item action',
            items: [
              { label: 'Full name', value: 'Margot Foster', actionTpl: action },
            ],
          }}
        />
      </Section>

      <Section title="With attachments">
        <SmartDescriptionList
          options={{
            title: 'With attachments',
            items: ITEMS,
            attachmentsTpl: attachments,
          }}
        />
      </Section>

      <Section title="With footer">
        <SmartDescriptionList
          options={{
            title: 'With footer',
            items: ITEMS,
            footerTpl: footer,
          }}
        />
      </Section>

      <Section title="All slots combined">
        <SmartDescriptionList
          options={{
            title: 'Applicant Information',
            description: 'Personal details and application.',
            items: ITEMS,
            attachmentsTpl: attachments,
            footerTpl: footer,
          }}
        />
      </Section>

      <Section title="Long wrapping value">
        <SmartDescriptionList
          options={{ title: 'Long value', items: longItems }}
        />
      </Section>

      <Section title="Empty (no items)">
        <SmartDescriptionList options={{ title: 'Empty state', items: [] }} />
      </Section>
    </div>
  ),
};
