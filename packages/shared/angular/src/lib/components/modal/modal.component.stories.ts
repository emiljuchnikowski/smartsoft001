import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ModalComponent } from './modal.component';
import { ModalPresetComponent } from './preset/preset.component';
import {
  IModalAction,
  SmartModalFooterStyle,
  SmartModalVariant,
} from '../../models';
import { MODAL_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const VARIANTS: SmartModalVariant[] = [
  'centered',
  'wide',
  'alert',
  'left-aligned-buttons',
];

// Showcase headings read as prose, not as the raw option value.
const VARIANT_LABELS: Record<SmartModalVariant, string> = {
  centered: 'Centered',
  wide: 'Wide',
  alert: 'Alert',
  'left-aligned-buttons': 'Buttons aligned to the left',
};

const ACTIONS: IModalAction[] = [
  { id: 'cancel', label: 'Close', variant: 'secondary' },
  { id: 'save', label: 'Save changes', variant: 'primary' },
];

interface ModalArgs {
  open: boolean;
  title: string;
  description: string;
  variant: SmartModalVariant;
  footerStyle: SmartModalFooterStyle;
  withDismiss: boolean;
}

const meta: Meta<ModalArgs> = {
  title: 'Components/Modal',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ModalComponent],
      // Register the preset variation as the replacement for the standard
      // modal, so every <smart-modal> renders ModalPresetComponent.
      providers: [
        {
          provide: MODAL_STANDARD_COMPONENT_TOKEN,
          useValue: ModalPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
    variant: { control: 'select', options: VARIANTS },
    footerStyle: { control: 'radio', options: ['default', 'gray'] },
    withDismiss: { control: 'boolean' },
  },
  args: {
    open: true,
    title: 'Modal title',
    description:
      'This is a wider card with supporting text below as a natural introduction to additional content.',
    variant: 'centered',
    footerStyle: 'default',
    withDismiss: true,
  },
};

export default meta;
type Story = StoryObj<ModalArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      open: args.open,
      title: args.title,
      description: args.description,
      actions: ACTIONS,
      options: {
        variant: args.variant,
        footerStyle: args.footerStyle,
        withDismiss: args.withDismiss,
      },
    },
    template: `
      <div style="position: relative; transform: translateZ(0); overflow: hidden; min-height: 420px;">
        <smart-modal
          [open]="open"
          [title]="title"
          [description]="description"
          [actions]="actions"
          [options]="options"
        ></smart-modal>
      </div>
    `,
  }),
};

// The modal's ROOT is the full-screen backdrop (`smart:fixed smart:inset-0`),
// so `position: relative` alone does nothing — a fixed element only resolves
// against an ancestor that creates a containing block. `transform` does that
// (and gives each variant its own stacking context, isolating the equal
// z-[80] values); `overflow: hidden` clips the backdrop to the preview card.
// Without this, all variants stack on the viewport, their translucent
// backdrops compose to near-black, and only the topmost is clickable.
const modalBlock = (variant: SmartModalVariant) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${VARIANT_LABELS[variant]}</h3>
    <div style="position: relative; transform: translateZ(0); overflow: hidden; min-height: 360px;">
      <smart-modal
        [open]="true"
        title="Modal title"
        description="This is a wider card with supporting text below as a natural introduction to additional content."
        [actions]="actions"
        [options]="{ variant: '${variant}', withDismiss: true }"
      ></smart-modal>
    </div>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { actions: ACTIONS },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
        ${VARIANTS.map((variant) => modalBlock(variant)).join('\n        ')}
      </div>
    `,
  }),
};
