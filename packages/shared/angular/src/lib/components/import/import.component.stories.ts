import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { ImportComponent } from './import.component';
import { provideStorybookTranslations } from '../../../../.storybook/storybook-translations';

const ACCEPTS = ['application/json', '.csv', '*/*'] as const;

interface ImportArgs {
  accept: string;
  cssClass: string;
}

const meta: Meta<ImportArgs> = {
  title: 'Components/Import',
  tags: ['autodocs'],
  decorators: [
    // <smart-button> translates its confirm-mode labels, so the story needs the
    // real dictionaries. Note: do NOT register BUTTON_STANDARD_COMPONENT_TOKEN
    // here; the button dispatches through NgComponentOutlet, which would drop
    // the projected upload icon.
    applicationConfig({
      providers: [...provideStorybookTranslations()],
    }),
    moduleMetadata({
      imports: [ImportComponent, TranslateModule],
    }),
  ],
  argTypes: {
    accept: {
      control: 'select',
      options: ACCEPTS,
      description:
        'Sets the `accept` attribute on the hidden <input type="file">. It filters the native file dialog and has no effect on the rendered output.',
    },
    cssClass: { control: 'text', description: 'Passed through as `class`.' },
  },
  args: { accept: 'application/json', cssClass: '' },
};

export default meta;
type Story = StoryObj<ImportArgs>;

const onFileSelected = (file: File) =>
  console.log('[storybook] imported', file.name, file.size);

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: { onFileSelected, accept: args.accept, cssClass: args.cssClass },
    template: `
      <div style="padding: 40px;">
        <p style="margin-bottom: 16px; font-size: 14px; color: #6b7280;">
          Click to open the native file dialog. The chosen file is emitted through
          <code>(set)</code> and logged to the console.
        </p>
        <smart-import
          [accept]="accept"
          [class]="cssClass"
          (set)="onFileSelected($event)"
        ></smart-import>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { onFileSelected },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Accept filters</h3>
          <p style="font-size: 13px; opacity: .7; margin-bottom: 12px; max-width: 60ch;">
            These three cells render <strong>identical</strong> markup. <code>accept</code> is
            written to a hidden <code>&lt;input type="file"&gt;</code>, so it only changes which
            files the native dialog offers. Open one and pick a file — the selection is logged
            to the console through <code>(set)</code>.
          </p>
          <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
            ${ACCEPTS.map(
              (accept) => `
              <div style="text-align: center;">
                <smart-import accept="${accept}" (set)="onFileSelected($event)"></smart-import>
                <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">${accept}</p>
              </div>`,
            ).join('\n')}
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">External class</h3>
          <smart-import
            class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
            (set)="onFileSelected($event)"
          ></smart-import>
        </section>

      </div>
    `,
  }),
};
