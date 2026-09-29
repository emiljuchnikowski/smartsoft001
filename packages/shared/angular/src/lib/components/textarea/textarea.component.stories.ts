import { TemplateRef } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { TextareaPresetComponent } from './preset/preset.component';
import { TextareaComponent } from './textarea.component';
import { ITextareaOptions, SmartTextareaVariant } from '../../models';
import { TEXTAREA_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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

type Tpl = TemplateRef<unknown>;

interface Slots {
  avatar: Tpl;
  toolbar: Tpl;
  preview: Tpl;
}

const ACTIONS: ITextareaOptions['actions'] = [
  { id: 'cancel', label: 'Cancel', variant: 'ghost' },
  { id: 'submit', label: 'Send', variant: 'primary' },
];

const AVATAR =
  'https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80';

/** Slot templates shared by both stories; `<smart-textarea>` reads them from options. */
const SLOT_TEMPLATES = `
  <ng-template #avatar>
    <img src="${AVATAR}" alt="" class="smart:inline-block smart:size-10 smart:rounded-full smart:outline smart:-outline-offset-1 smart:outline-black/5 smart:dark:outline-white/10" />
  </ng-template>
  <ng-template #toolbar>
    <button type="button" aria-label="Attach a file" class="smart:-m-2 smart:inline-flex smart:size-9 smart:items-center smart:justify-center smart:rounded-full smart:text-gray-400 smart:hover:text-gray-500 smart:dark:text-gray-500 smart:dark:hover:text-white">
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="smart:size-5"><path fill-rule="evenodd" d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clip-rule="evenodd" /></svg>
    </button>
  </ng-template>
  <ng-template #preview>
    <p>Looks good to me &mdash; <strong>shipping it</strong> on Friday.</p>
  </ng-template>
`;

/**
 * Builds the options once per story render: Angular templates have no object
 * spread, and returning a fresh object on every change-detection pass would
 * trip ExpressionChangedAfterItHasBeenChecked.
 */
function optionsFactory(build: (slots: Slots) => ITextareaOptions) {
  let cached: ITextareaOptions | undefined;
  return (avatar: Tpl, toolbar: Tpl, preview: Tpl): ITextareaOptions =>
    (cached ??= build({ avatar, toolbar, preview }));
}

const meta: Meta<TextareaArgs> = {
  title: 'Components/Textarea',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [TextareaComponent],
      // Register the preset variation as the replacement for the standard
      // textarea, so every <smart-textarea> renders TextareaPresetComponent.
      providers: [
        {
          provide: TEXTAREA_STANDARD_COMPONENT_TOKEN,
          useValue: TextareaPresetComponent,
        },
      ],
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      comment: args.value,
      placeholder: args.placeholder,
      disabled: args.disabled,
      cssClass: args.cssClass,
      options: optionsFactory(({ avatar, toolbar, preview }) => ({
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
      })),
      onActionClick: (event: { actionId: string; value: string }) =>
        console.log('[storybook] actionClick', event),
    },
    template: `
      ${SLOT_TEMPLATES}
      <div style="padding: 40px; max-width: 36rem;">
        <smart-textarea
          [(value)]="comment"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [options]="options(avatar, toolbar, preview)"
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
    <div style="max-width: 36rem;">${body}</div>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      simpleValue: '',
      avatarValue: '',
      underlineValue: '',
      pillValue: '',
      previewValue: 'Looks good to me — **shipping it** on Friday.',
      limitedValue: 'Short and sweet.',
      disabledValue: 'This field cannot be edited.',
      styledValue: '',
      simple: optionsFactory(() => ({
        label: 'Comment',
        rows: 4,
        actions: ACTIONS,
      })),
      withAvatarActions: optionsFactory(({ avatar, toolbar }) => ({
        variant: 'with-avatar-actions',
        rows: 3,
        ariaLabel: 'Add your comment',
        avatarTpl: avatar,
        toolbarTpl: toolbar,
        actions: [{ id: 'submit', label: 'Post', variant: 'primary' }],
      })),
      withUnderline: optionsFactory(({ avatar, toolbar }) => ({
        variant: 'with-underline',
        rows: 3,
        ariaLabel: 'Add your comment',
        avatarTpl: avatar,
        toolbarTpl: toolbar,
        actions: [{ id: 'submit', label: 'Post', variant: 'primary' }],
      })),
      withPillActions: optionsFactory(({ toolbar }) => ({
        variant: 'with-pill-actions',
        label: 'Description',
        rows: 3,
        toolbarTpl: toolbar,
        actions: [
          { id: 'draft', label: 'Save draft', variant: 'secondary' },
          { id: 'submit', label: 'Create', variant: 'primary' },
        ],
      })),
      withPreview: optionsFactory(({ preview }) => ({
        variant: 'with-preview',
        rows: 4,
        ariaLabel: 'Comment',
        previewTpl: preview,
        actions: [{ id: 'submit', label: 'Post', variant: 'primary' }],
      })),
      limited: optionsFactory(() => ({
        label: 'Short update',
        rows: 3,
        maxLength: 140,
      })),
      disabledOptions: optionsFactory(() => ({
        label: 'Locked',
        rows: 3,
        actions: ACTIONS,
      })),
      styled: optionsFactory(() => ({ label: 'Notes' })),
    },
    template: `
      ${SLOT_TEMPLATES}
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section(
          'Simple',
          `<smart-textarea [(value)]="simpleValue" [options]="simple(avatar, toolbar, preview)" placeholder="Add your comment..." />`,
          'Outlined field with the actions row below it.',
        )}

        ${section(
          'With avatar and actions',
          `<smart-textarea [(value)]="avatarValue" [options]="withAvatarActions(avatar, toolbar, preview)" placeholder="Add your comment..." />`,
          'The toolbar and actions sit inside the outlined box.',
        )}

        ${section(
          'With underline',
          `<smart-textarea [(value)]="underlineValue" [options]="withUnderline(avatar, toolbar, preview)" placeholder="Add your comment..." />`,
          'Only a bottom border, which thickens on focus.',
        )}

        ${section(
          'With pill actions',
          `<smart-textarea [(value)]="pillValue" [options]="withPillActions(avatar, toolbar, preview)" placeholder="Write a description..." />`,
          'A divided bar inside the box with pill-shaped buttons.',
        )}

        ${section(
          'With preview',
          `<smart-textarea [(value)]="previewValue" [options]="withPreview(avatar, toolbar, preview)" />`,
          'Write / Preview tabs swap the field for previewTpl.',
        )}

        ${section(
          'With a maximum length',
          `<smart-textarea [(value)]="limitedValue" [options]="limited(avatar, toolbar, preview)" />`,
          'maxLength is the native maxlength attribute, plus a character counter.',
        )}

        ${section(
          'Disabled',
          `<smart-textarea [(value)]="disabledValue" [disabled]="true" [options]="disabledOptions(avatar, toolbar, preview)" />`,
          'The field and every action button are disabled.',
        )}

        ${section(
          'External class',
          `<smart-textarea
             class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
             [(value)]="styledValue"
             [options]="styled(avatar, toolbar, preview)"
           />`,
        )}

      </div>
    `,
  }),
};
