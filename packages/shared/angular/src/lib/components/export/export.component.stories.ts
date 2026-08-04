import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { ExportComponent } from './export.component';
import { provideStorybookTranslations } from '../../../../.storybook/storybook-translations';

const SINGLE = { name: 'John', email: 'john@example.com' };
const ROWS = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

interface ExportArgs {
  hasValue: boolean;
  payload: 'object' | 'rows';
  cssClass: string;
}

const meta: Meta<ExportArgs> = {
  title: 'Components/Export',
  tags: ['autodocs'],
  decorators: [
    // <smart-button> translates its confirm-mode labels, so the story needs the
    // real dictionaries — a bare TranslateModule.forRoot() would leave the keys
    // unresolved. Note: do NOT register BUTTON_STANDARD_COMPONENT_TOKEN here;
    // the button dispatches through NgComponentOutlet, which would drop the
    // projected download icon.
    applicationConfig({
      providers: [...provideStorybookTranslations()],
    }),
    moduleMetadata({
      imports: [ExportComponent, TranslateModule],
    }),
  ],
  argTypes: {
    hasValue: {
      control: 'boolean',
      description:
        'The button is disabled whenever `value` is absent — this is the only visual state the component has.',
    },
    payload: {
      control: 'inline-radio',
      options: ['object', 'rows'],
      description:
        'What gets handed to `handler`. Purely a handler-argument difference; the rendered button is identical.',
    },
    cssClass: { control: 'text', description: 'Passed through as `class`.' },
  },
  args: { hasValue: true, payload: 'object', cssClass: '' },
};

export default meta;
type Story = StoryObj<ExportArgs>;

// `handler` is input.required — every instance must bind it or Angular throws
// NG0950. `fileName` is deliberately not exercised: ExportBaseComponent declares
// it but never reads it, so it has no observable effect.
const handler = (value: unknown) => console.log('[storybook] exported', value);

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      handler,
      data: args.hasValue
        ? args.payload === 'rows'
          ? ROWS
          : SINGLE
        : undefined,
      cssClass: args.cssClass,
    },
    template: `
      <div style="padding: 40px;">
        <p style="margin-bottom: 16px; font-size: 14px; color: #6b7280;">
          Click the export button to trigger the handler (logged to the console).
        </p>
        <smart-export [value]="data" [handler]="handler" [class]="cssClass"></smart-export>
      </div>
    `,
  }),
};

const section = (title: string, note: string, body: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    <p style="font-size: 13px; opacity: .7; margin-bottom: 8px;">${note}</p>
    ${body}
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { handler, single: SINGLE, rows: ROWS },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section(
          'Enabled',
          '`value` is set, so the button is active.',
          `<smart-export [value]="single" [handler]="handler"></smart-export>`,
        )}

        ${section(
          'Disabled',
          'No `value`, so the button gets smart:opacity-50 and smart:cursor-not-allowed.',
          `<smart-export [handler]="handler"></smart-export>`,
        )}

        ${section(
          'Array payload',
          'Visually identical to the enabled cell — only the value handed to `handler` differs.',
          `<smart-export [value]="rows" [handler]="handler"></smart-export>`,
        )}

        ${section(
          'External class',
          'The class is forwarded to the host element.',
          `<smart-export
             class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
             [value]="single"
             [handler]="handler"
           ></smart-export>`,
        )}

      </div>
    `,
  }),
};
