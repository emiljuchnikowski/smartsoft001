import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { DateRangeComponent } from './date-range.component';
import { DateRangePresetComponent } from './preset/preset.component';
import { DateRangeModalStandardComponent } from './standard/standard-modal.component';
import { provideStorybookTranslations } from '../../../../.storybook/storybook-translations';
import { StyleService, UIService } from '../../services';

const RANGE = { start: '2026-04-01', end: '2026-04-07' };

interface DateRangeArgs {
  withValue: boolean;
  showFilterBtns: boolean;
  restrictSelectionTo: number;
  cssClass: string;
}

const MODAL_ONLY =
  'Consumed only by <smart-date-range-modal-standard> — the preset trigger ignores it.';

const meta: Meta<DateRangeArgs> = {
  title: 'Components/DateRange',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [...provideStorybookTranslations()],
    }),
    moduleMetadata({
      // Deliberately NOT FormsModule: without the NgModel directive in scope,
      // [(ngModel)] binds the component's own model() signal. Pulling FormsModule
      // in would route it through the CVA writeValue() -> cd.detectChanges()
      // path, which loops (NG0103).
      imports: [
        DateRangeComponent,
        DateRangeModalStandardComponent,
        DateRangePresetComponent,
      ],
      // UIService and StyleService are plain @Injectable() with no
      // providedIn: 'root', so they must be provided here.
      providers: [UIService, StyleService],
    }),
  ],
  argTypes: {
    withValue: {
      control: 'boolean',
      description:
        'With a value the trigger shows "start - end" and a clear button; without it, the translated "select" label.',
    },
    showFilterBtns: { control: 'boolean', description: MODAL_ONLY },
    restrictSelectionTo: {
      control: 'number',
      description: `Maximum selectable span in days (0 = unrestricted). ${MODAL_ONLY}`,
    },
    cssClass: { control: 'text', description: 'Passed through as `class`.' },
  },
  args: {
    withValue: true,
    showFilterBtns: true,
    restrictSelectionTo: 0,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<DateRangeArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      value: args.withValue ? { ...RANGE } : undefined,
      cssClass: args.cssClass,
    },
    template: `
      <div style="padding: 40px; min-height: 520px;">
        <smart-date-range
          variant="preset"
          [class]="cssClass"
          [(ngModel)]="value"
        ></smart-date-range>
        <p style="margin-top: 12px; font-size: 14px; color: #6b7280;">
          Value: {{ value ? value.start + ' - ' + value.end : 'none' }}
        </p>
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
      emptyValue: undefined,
      filledValue: { ...RANGE },
      styledValue: { ...RANGE },
      onApply: (data: unknown) => console.log('[storybook] applied', data),
      onDismiss: () => console.log('[storybook] dismissed'),
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        <div style="min-height: 520px; display: flex; flex-direction: column; gap: 32px;">
          ${section(
            'Empty trigger',
            'No value — the trigger shows the translated "select" label and no clear button.',
            `<smart-date-range variant="preset" [(ngModel)]="emptyValue"></smart-date-range>`,
          )}

          ${section(
            'Filled trigger',
            'With a range the trigger shows "start - end" and the clear (×) button appears.',
            `<smart-date-range variant="preset" [(ngModel)]="filledValue"></smart-date-range>`,
          )}

          ${section(
            'External class',
            'The class is forwarded to the inner variant component.',
            `<smart-date-range
               variant="preset"
               class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
               [(ngModel)]="styledValue"
             ></smart-date-range>`,
          )}
        </div>

        ${section(
          'Modal, with quick filters',
          'The standard modal rendered inline, with the six quick-filter buttons.',
          `<div style="position: relative; height: 600px;">
             <smart-date-range-modal-standard
               [showFilterBtns]="true"
               (apply)="onApply($event)"
               (dismiss)="onDismiss()"
             />
           </div>`,
        )}

        ${section(
          'Modal, without quick filters',
          'Same modal with showFilterBtns false — the quick-filter row is hidden.',
          `<div style="position: relative; height: 600px;">
             <smart-date-range-modal-standard
               [showFilterBtns]="false"
               (apply)="onApply($event)"
               (dismiss)="onDismiss()"
             />
           </div>`,
        )}

      </div>
    `,
  }),
};
