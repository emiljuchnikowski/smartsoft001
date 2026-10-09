import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartModal } from './modal';
import { SmartModalPreset } from './preset/modal-preset';
import {
  IModalAction,
  SmartModalFooterStyle,
  SmartModalVariant,
} from '../../models';

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
  parameters: {
    // Register the preset variation as the replacement for the standard
    // modal, so every <SmartModal> renders SmartModalPreset.
    smart: { components: { modal: SmartModalPreset } },
  },
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

// The `open` control sets `defaultOpen` (the modal is re-mounted when the
// control changes) rather than `open`, so the modal can still close itself.

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div
      style={{
        position: 'relative',
        transform: 'translateZ(0)',
        overflow: 'hidden',
        minHeight: 420,
      }}
    >
      <SmartModal
        key={String(args.open)}
        defaultOpen={args.open}
        title={args.title}
        description={args.description}
        actions={ACTIONS}
        options={{
          variant: args.variant,
          footerStyle: args.footerStyle,
          withDismiss: args.withDismiss,
        }}
      />
    </div>
  ),
};
// #endregion

// The modal's ROOT is the full-screen backdrop (`smart:fixed smart:inset-0`),
// so `position: relative` alone does nothing — a fixed element only resolves
// against an ancestor that creates a containing block. `transform` does that
// (and gives each variant its own stacking context, isolating the equal
// z-[80] values); `overflow: hidden` clips the backdrop to the preview card.
// Without this, all variants stack on the viewport, their translucent
// backdrops compose to near-black, and only the topmost is clickable.
const ModalBlock = ({ variant }: { variant: SmartModalVariant }) => (
  <section>
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
      {VARIANT_LABELS[variant]}
    </h3>
    <div
      style={{
        position: 'relative',
        transform: 'translateZ(0)',
        overflow: 'hidden',
        minHeight: 360,
      }}
    >
      <SmartModal
        defaultOpen={true}
        title="Modal title"
        description="This is a wider card with supporting text below as a natural introduction to additional content."
        actions={ACTIONS}
        options={{ variant, withDismiss: true }}
      />
    </div>
  </section>
);

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
      {VARIANTS.map((variant) => (
        <ModalBlock key={variant} variant={variant} />
      ))}
    </div>
  ),
};
