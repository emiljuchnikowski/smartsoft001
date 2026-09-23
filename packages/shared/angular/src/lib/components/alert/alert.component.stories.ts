import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { AlertComponent } from './alert.component';
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
  decorators: [
    moduleMetadata({
      imports: [AlertComponent],
    }),
  ],
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

    return {
      props: { options },
      template: `
        <div style="position: relative; transform: translateZ(0); overflow: hidden; min-height: 320px;">
          <smart-alert [options]="options"></smart-alert>
        </div>
      `,
    };
  },
};
// #endregion

// The alert's ROOT is the full-screen backdrop (`smart:fixed smart:inset-0`),
// so each showcase block needs its own containing block: `transform` creates
// one (and a stacking context), `overflow: hidden` clips the backdrop to the
// preview card. Without it every backdrop covers the viewport at once.
const alertBlock = (title: string, options: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    <div style="position: relative; transform: translateZ(0); overflow: hidden; min-height: 280px;">
      <smart-alert [options]="${options}"></smart-alert>
    </div>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      confirm: {
        header: 'Save changes?',
        message: 'Your edits are applied to every selected row.',
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          { text: 'Save', handler: () => undefined },
        ],
      } satisfies IAlertOptions,
      destructive: {
        header: 'Delete this record?',
        subHeader: 'Invoice 2024/017',
        message: 'The record is removed permanently. This cannot be undone.',
        backdropDismiss: false,
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          { text: 'Delete', role: 'destructive', handler: () => undefined },
        ],
      } satisfies IAlertOptions,
      notice: {
        header: 'Export finished',
        message: 'The file is ready in your downloads folder.',
        buttons: [{ text: 'OK', role: 'cancel' }],
      } satisfies IAlertOptions,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
        ${alertBlock('Confirm', 'confirm')}
        ${alertBlock('Destructive', 'destructive')}
        ${alertBlock('Single button', 'notice')}
      </div>
    `,
  }),
};
