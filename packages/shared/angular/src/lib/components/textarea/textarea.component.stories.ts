import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { TextareaComponent } from './textarea.component';
import { ITextareaOptions, SmartTextareaVariant } from '../../models';

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

const meta: Meta<TextareaArgs> = {
  title: 'Components/Textarea',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      // No token is registered, so <smart-textarea> falls back to
      // TextareaStandardComponent, which renders a native <textarea>.
      imports: [TextareaComponent],
    }),
  ],
  argTypes: {
    value: { control: 'text', description: 'Text content (two-way bindable).' },
    placeholder: { control: 'text' },
    label: {
      control: 'text',
      description: 'Rendered as a <label> above the field.',
    },
    rows: { control: { type: 'number', min: 1, max: 20 } },
    maxLength: { control: { type: 'number', min: 0 } },
    variant: {
      control: 'select',
      options: VARIANTS,
      description:
        'Layout hint for implementations registered through TEXTAREA_STANDARD_COMPONENT_TOKEN; ignored by the standard component.',
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      comment: args.value,
      placeholder: args.placeholder,
      disabled: args.disabled,
      cssClass: args.cssClass,
      options: {
        label: args.label,
        rows: args.rows,
        maxLength: args.maxLength,
        variant: args.variant,
        required: args.required,
        actions: args.withActions
          ? [
              { id: 'cancel', label: 'Cancel', variant: 'ghost' },
              { id: 'submit', label: 'Send', variant: 'primary' },
            ]
          : [],
      } satisfies ITextareaOptions,
      onActionClick: (event: { actionId: string; value: string }) =>
        console.log('[storybook] actionClick', event),
    },
    template: `
      <div style="padding: 40px; max-width: 32rem;">
        <smart-textarea
          [(value)]="comment"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [options]="options"
          [class]="cssClass"
          (actionClick)="onActionClick($event)"
        />
      </div>
    `,
  }),
};
// #endregion

const section = (title: string, body: string, note?: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    ${note ? `<p style="font-size: 13px; opacity: .7; margin-bottom: 8px;">${note}</p>` : ''}
    <div style="max-width: 32rem;">${body}</div>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      plain: '',
      labelled: '',
      filled: 'Looks good to me — shipping it on Friday.',
      limited: '',
      replyValue: '',
      disabledValue: 'This field cannot be edited.',
      styled: '',
      labelOptions: { label: 'Bio', rows: 6 } satisfies ITextareaOptions,
      limitOptions: {
        label: 'Short update',
        rows: 3,
        maxLength: 140,
      } satisfies ITextareaOptions,
      actionOptions: {
        rows: 4,
        actions: [
          { id: 'cancel', label: 'Cancel', variant: 'ghost' },
          { id: 'submit', label: 'Send', variant: 'primary' },
        ],
      } satisfies ITextareaOptions,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section(
          'Simple',
          `<smart-textarea [(value)]="plain" placeholder="Add your comment..." />`,
        )}

        ${section(
          'With a label and custom rows',
          `<smart-textarea [(value)]="labelled" [options]="labelOptions" />`,
        )}

        ${section(
          'With content',
          `<smart-textarea [(value)]="filled" [options]="{ label: 'Review' }" />`,
        )}

        ${section(
          'With a maximum length',
          `<smart-textarea [(value)]="limited" [options]="limitOptions" />`,
          'maxLength is applied as the native maxlength attribute.',
        )}

        ${section(
          'With actions',
          `<smart-textarea [(value)]="replyValue" [options]="actionOptions" placeholder="Write a reply..." />`,
          'Each button emits actionClick with its id and the current value.',
        )}

        ${section(
          'Disabled',
          `<smart-textarea [(value)]="disabledValue" [disabled]="true" [options]="actionOptions" />`,
          'The field and every action button are disabled.',
        )}

        ${section(
          'External class',
          `<smart-textarea
             class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
             [(value)]="styled"
             [options]="{ label: 'Notes' }"
           />`,
        )}

      </div>
    `,
  }),
};
