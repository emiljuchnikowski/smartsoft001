import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { ITextareaOptions, SmartTextareaVariant } from '../../models';
import { SmartTextareaPreset } from './preset/textarea-preset';
import { SmartTextarea } from './textarea';

const VARIANTS: SmartTextareaVariant[] = [
  'simple',
  'with-avatar-actions',
  'with-underline',
  'with-pill-actions',
  'with-preview',
];

interface TextareaArgs {
  value: string;
  placeholder: string;
  label: string;
  rows: number;
  maxLength: number;
  variant: SmartTextareaVariant;
  required: boolean;
  disabled: boolean;
  withActions: boolean;
  cssClass: string;
}

const ACTIONS: ITextareaOptions['actions'] = [
  { id: 'cancel', label: 'Cancel', variant: 'ghost' },
  { id: 'submit', label: 'Send', variant: 'primary' },
];

const AVATAR =
  'https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80';

/** Slot templates shared by both stories; `<SmartTextarea>` reads them from options. */
const avatar = (
  <img
    src={AVATAR}
    alt=""
    className="smart:inline-block smart:size-10 smart:rounded-full smart:outline smart:-outline-offset-1 smart:outline-black/5 smart:dark:outline-white/10"
  />
);
const toolbar = (
  <button
    type="button"
    aria-label="Attach a file"
    className="smart:-m-2 smart:inline-flex smart:size-9 smart:items-center smart:justify-center smart:rounded-full smart:text-gray-400 smart:hover:text-gray-500 smart:dark:text-gray-500 smart:dark:hover:text-white"
  >
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="smart:size-5"
    >
      <path
        fillRule="evenodd"
        d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
        clipRule="evenodd"
      />
    </svg>
  </button>
);
const preview = (
  <p>
    Looks good to me &mdash; <strong>shipping it</strong> on Friday.
  </p>
);

const meta: Meta<TextareaArgs> = {
  title: 'Components/Textarea',
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // textarea, so every <SmartTextarea> renders SmartTextareaPreset.
    smart: { components: { textarea: SmartTextareaPreset } },
  },
  argTypes: {
    value: { control: 'text', description: 'Text content (two-way bindable).' },
    placeholder: { control: 'text' },
    label: {
      control: 'text',
      description: 'Rendered as a <label> above the field.',
    },
    rows: { control: { type: 'number', min: 1, max: 20 } },
    maxLength: {
      control: { type: 'number', min: 0 },
      description: 'Native maxlength; the preset also shows a counter.',
    },
    variant: {
      control: 'select',
      options: VARIANTS,
      description:
        'Layout of the preset: field frame, where the toolbar/actions bar sits, pill buttons, or Write / Preview tabs.',
    },
    required: { control: 'boolean' },
    disabled: {
      control: 'boolean',
      description: 'Disables the field and every action button.',
    },
    withActions: {
      control: 'boolean',
      description: 'Renders Cancel and Send buttons that emit `actionClick`.',
    },
    cssClass: {
      control: 'text',
      description: 'External CSS classes (alias for `class`).',
    },
  },
  args: {
    value: '',
    placeholder: 'Add your comment...',
    label: 'Comment',
    rows: 4,
    maxLength: 280,
    variant: 'simple',
    required: false,
    disabled: false,
    withActions: true,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<TextareaArgs>;

/** A controlled `value`: the story keeps it in its state. */
const TextareaPlayground = (args: TextareaArgs) => {
  const [comment, setComment] = useState(args.value);

  return (
    <div style={{ padding: 40, maxWidth: '36rem' }}>
      <SmartTextarea
        value={comment}
        onValueChange={setComment}
        placeholder={args.placeholder}
        disabled={args.disabled}
        options={{
          label: args.label,
          rows: args.rows,
          maxLength: args.maxLength,
          variant: args.variant,
          required: args.required,
          actions: args.withActions ? ACTIONS : [],
          avatarTpl:
            args.variant === 'with-avatar-actions' ||
            args.variant === 'with-underline'
              ? avatar
              : undefined,
          toolbarTpl: args.variant === 'simple' ? undefined : toolbar,
          previewTpl: args.variant === 'with-preview' ? preview : undefined,
        }}
        className={args.cssClass}
        onActionClick={(event) => console.log('[storybook] actionClick', event)}
      />
    </div>
  );
};

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => <TextareaPlayground key={args.value} {...args} />,
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const Section = ({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={sectionTitle}>{title}</h3>
    {note ? (
      <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>{note}</p>
    ) : null}
    <div style={{ maxWidth: '36rem' }}>{children}</div>
  </section>
);

const simple: ITextareaOptions = {
  label: 'Comment',
  rows: 4,
  actions: ACTIONS,
};
const withAvatarActions: ITextareaOptions = {
  variant: 'with-avatar-actions',
  rows: 3,
  ariaLabel: 'Add your comment',
  avatarTpl: avatar,
  toolbarTpl: toolbar,
  actions: [{ id: 'submit', label: 'Post', variant: 'primary' }],
};
const withUnderline: ITextareaOptions = {
  variant: 'with-underline',
  rows: 3,
  ariaLabel: 'Add your comment',
  avatarTpl: avatar,
  toolbarTpl: toolbar,
  actions: [{ id: 'submit', label: 'Post', variant: 'primary' }],
};
const withPillActions: ITextareaOptions = {
  variant: 'with-pill-actions',
  label: 'Description',
  rows: 3,
  toolbarTpl: toolbar,
  actions: [
    { id: 'draft', label: 'Save draft', variant: 'secondary' },
    { id: 'submit', label: 'Create', variant: 'primary' },
  ],
};
const withPreview: ITextareaOptions = {
  variant: 'with-preview',
  rows: 4,
  ariaLabel: 'Comment',
  previewTpl: preview,
  actions: [{ id: 'submit', label: 'Post', variant: 'primary' }],
};
const limited: ITextareaOptions = {
  label: 'Short update',
  rows: 3,
  maxLength: 140,
};
const disabledOptions: ITextareaOptions = {
  label: 'Locked',
  rows: 3,
  actions: ACTIONS,
};
const styled: ITextareaOptions = { label: 'Notes' };

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
      <Section
        title="Simple"
        note="Outlined field with the actions row below it."
      >
        <SmartTextarea
          defaultValue=""
          options={simple}
          placeholder="Add your comment..."
        />
      </Section>

      <Section
        title="With avatar and actions"
        note="The toolbar and actions sit inside the outlined box."
      >
        <SmartTextarea
          defaultValue=""
          options={withAvatarActions}
          placeholder="Add your comment..."
        />
      </Section>

      <Section
        title="With underline"
        note="Only a bottom border, which thickens on focus."
      >
        <SmartTextarea
          defaultValue=""
          options={withUnderline}
          placeholder="Add your comment..."
        />
      </Section>

      <Section
        title="With pill actions"
        note="A divided bar inside the box with pill-shaped buttons."
      >
        <SmartTextarea
          defaultValue=""
          options={withPillActions}
          placeholder="Write a description..."
        />
      </Section>

      <Section
        title="With preview"
        note="Write / Preview tabs swap the field for previewTpl."
      >
        <SmartTextarea
          defaultValue="Looks good to me — **shipping it** on Friday."
          options={withPreview}
        />
      </Section>

      <Section
        title="With a maximum length"
        note="maxLength is the native maxlength attribute, plus a character counter."
      >
        <SmartTextarea defaultValue="Short and sweet." options={limited} />
      </Section>

      <Section
        title="Disabled"
        note="The field and every action button are disabled."
      >
        <SmartTextarea
          defaultValue="This field cannot be edited."
          disabled={true}
          options={disabledOptions}
        />
      </Section>

      <Section title="External class">
        <SmartTextarea
          className="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
          defaultValue=""
          options={styled}
        />
      </Section>
    </div>
  ),
};
