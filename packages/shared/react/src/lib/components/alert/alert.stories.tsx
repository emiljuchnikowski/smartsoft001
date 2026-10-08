import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartAlert } from './alert';
import { IAlertOptions } from '../../models';

interface AlertArgs {
  header: string;
  subHeader: string;
  message: string;
  destructive: boolean;
  backdropDismiss: boolean;
}

const meta: Meta<AlertArgs> = {
  title: 'Components/Alert',
  tags: ['autodocs'],
  argTypes: {
    header: { control: 'text' },
    subHeader: { control: 'text' },
    message: { control: 'text' },
    destructive: { control: 'boolean' },
    backdropDismiss: { control: 'boolean' },
  },
  args: {
    header: 'Delete this record?',
    subHeader: '',
    message: 'The record is removed permanently. This cannot be undone.',
    destructive: true,
    backdropDismiss: false,
  },
};

export default meta;
type Story = StoryObj<AlertArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => {
    const options: IAlertOptions = {
      header: args.header,
      subHeader: args.subHeader || undefined,
      message: args.message || undefined,
      backdropDismiss: args.backdropDismiss,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: args.destructive ? 'Delete' : 'Confirm',
          role: args.destructive ? 'destructive' : undefined,
          handler: () => undefined,
        },
      ],
    };

    return (
      <div
        style={{
          position: 'relative',
          transform: 'translateZ(0)',
          overflow: 'hidden',
          minHeight: 320,
        }}
      >
        <SmartAlert options={options} />
      </div>
    );
  },
};
// #endregion

// The alert's ROOT is the full-screen backdrop (`smart:fixed smart:inset-0`),
// so each showcase block needs its own containing block: `transform` creates
// one (and a stacking context), `overflow: hidden` clips the backdrop to the
// preview card. Without it every backdrop covers the viewport at once.
const AlertBlock = ({
  title,
  options,
}: {
  title: string;
  options: IAlertOptions;
}) => (
  <section>
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
    <div
      style={{
        position: 'relative',
        transform: 'translateZ(0)',
        overflow: 'hidden',
        minHeight: 280,
      }}
    >
      <SmartAlert options={options} />
    </div>
  </section>
);

const confirm = {
  header: 'Save changes?',
  message: 'Your edits are applied to every selected row.',
  buttons: [
    { text: 'Cancel', role: 'cancel' },
    { text: 'Save', handler: () => undefined },
  ],
} satisfies IAlertOptions;

const destructive = {
  header: 'Delete this record?',
  subHeader: 'Invoice 2024/017',
  message: 'The record is removed permanently. This cannot be undone.',
  backdropDismiss: false,
  buttons: [
    { text: 'Cancel', role: 'cancel' },
    { text: 'Delete', role: 'destructive', handler: () => undefined },
  ],
} satisfies IAlertOptions;

const notice = {
  header: 'Export finished',
  message: 'The file is ready in your downloads folder.',
  buttons: [{ text: 'OK', role: 'cancel' }],
} satisfies IAlertOptions;

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
      <AlertBlock title="Confirm" options={confirm} />
      <AlertBlock title="Destructive" options={destructive} />
      <AlertBlock title="Single button" options={notice} />
    </div>
  ),
};
