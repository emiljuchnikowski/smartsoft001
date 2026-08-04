import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { DateEditComponent } from './date-edit.component';

interface DateEditArgs {
  value: string;
  cssClass: string;
}

const meta: Meta<DateEditArgs> = {
  title: 'Components/DateEdit',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      // Only DateEditComponent — deliberately NOT FormsModule. Without the
      // NgModel directive in scope, [(ngModel)] binds the component's own
      // model() signal. Pulling FormsModule in would route it through the CVA
      // writeValue() -> cd.detectChanges() path, which loops (NG0103).
      imports: [DateEditComponent],
    }),
  ],
  argTypes: {
    value: {
      control: 'text',
      description:
        'YYYY-MM-DD. A value that does not parse renders the invalid trigger styling.',
    },
    cssClass: { control: 'text', description: 'Passed through as `class`.' },
  },
  args: { value: '2026-04-07', cssClass: '' },
};

export default meta;
type Story = StoryObj<DateEditArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: { value: args.value, cssClass: args.cssClass },
    template: `
      <div style="padding: 40px; min-height: 480px;">
        <smart-date-edit
          variant="preset"
          [class]="cssClass"
          [(ngModel)]="value"
        ></smart-date-edit>
        <p style="margin-top: 12px; font-size: 14px; color: #6b7280;">Value: {{ value }}</p>
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
    props: {
      defaultValue: '2001-01-01',
      validValue: '2026-04-07',
      invalidValue: 'not-a-date',
      styledValue: '2026-04-07',
      firstValue: '2026-01-01',
      secondValue: '2026-12-31',
    },
    // min-height keeps the absolutely-positioned calendar popover from clipping.
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px; min-height: 520px;">

        ${section(
          'Default value',
          'No value supplied — the component falls back to 2001-01-01.',
          `<smart-date-edit variant="preset" [(ngModel)]="defaultValue"></smart-date-edit>`,
        )}

        ${section(
          'Supplied date',
          'A valid YYYY-MM-DD value shown in the trigger.',
          `<smart-date-edit variant="preset" [(ngModel)]="validValue"></smart-date-edit>`,
        )}

        ${section(
          'Invalid value',
          'An unparseable value adds the invalid trigger ring.',
          `<smart-date-edit variant="preset" [(ngModel)]="invalidValue"></smart-date-edit>`,
        )}

        ${section(
          'Multiple instances',
          'Each instance keeps its own popover and value.',
          `<div style="display: flex; gap: 24px; flex-wrap: wrap;">
             <smart-date-edit variant="preset" [(ngModel)]="firstValue"></smart-date-edit>
             <smart-date-edit variant="preset" [(ngModel)]="secondValue"></smart-date-edit>
           </div>`,
        )}

        ${section(
          'External class',
          'The class is forwarded to the inner variant component.',
          `<smart-date-edit
             variant="preset"
             class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
             [(ngModel)]="styledValue"
           ></smart-date-edit>`,
        )}

      </div>
    `,
  }),
};
