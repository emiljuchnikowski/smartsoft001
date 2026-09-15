import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SelectMenuComponent } from './select-menu.component';
import { ISelectMenuItem, ISelectMenuOptions } from '../../models';

const COUNTRIES: ISelectMenuItem[] = [
  { value: 'pl', label: 'Poland' },
  { value: 'de', label: 'Germany' },
  { value: 'us', label: 'United States' },
  { value: 'jp', label: 'Japan' },
];

interface SelectMenuArgs {
  value: string;
  placeholder: string;
  ariaLabel: string;
  disabled: boolean;
  cssClass: string;
}

const meta: Meta<SelectMenuArgs> = {
  title: 'Components/Select Menu',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      // No token is registered, so <smart-select-menu> falls back to
      // SelectMenuStandardComponent, which renders a native <select>.
      imports: [SelectMenuComponent],
    }),
  ],
  argTypes: {
    value: {
      control: 'select',
      options: ['', ...COUNTRIES.map((item) => String(item.value))],
      description: 'Selected value (two-way bindable). Empty means unselected.',
    },
    placeholder: {
      control: 'text',
      description: 'Rendered as a disabled first option.',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name put on the <select> element.',
    },
    disabled: { control: 'boolean' },
    cssClass: {
      control: 'text',
      description: 'External CSS classes (alias for `class`).',
    },
  },
  args: {
    value: '',
    placeholder: 'Choose a country',
    ariaLabel: 'Country',
    disabled: false,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<SelectMenuArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      selected: args.value || null,
      disabled: args.disabled,
      cssClass: args.cssClass,
      options: {
        placeholder: args.placeholder,
        ariaLabel: args.ariaLabel,
        items: [
          { value: 'pl', label: 'Poland' },
          { value: 'de', label: 'Germany' },
          { value: 'us', label: 'United States' },
        ],
      } satisfies ISelectMenuOptions,
    },
    template: `
      <div style="padding: 40px; max-width: 20rem;">
        <smart-select-menu
          [(value)]="selected"
          [disabled]="disabled"
          [options]="options"
          [class]="cssClass"
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
    <div style="max-width: 20rem;">${body}</div>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      empty: null,
      preselected: 'de',
      disabledValue: 'pl',
      partlyDisabled: null,
      noItems: null,
      styled: 'jp',
      countries: { items: COUNTRIES } satisfies ISelectMenuOptions,
      withPlaceholder: {
        placeholder: 'Choose a country',
        items: COUNTRIES,
      } satisfies ISelectMenuOptions,
      withDisabledItem: {
        placeholder: 'Choose a plan',
        items: [
          { value: 'free', label: 'Free' },
          { value: 'team', label: 'Team' },
          { value: 'enterprise', label: 'Enterprise', disabled: true },
        ],
      } satisfies ISelectMenuOptions,
    },
    template: `
      <ng-template #emptyTpl>
        <span>No countries available</span>
      </ng-template>

      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section(
          'With placeholder',
          `<smart-select-menu [(value)]="empty" [options]="withPlaceholder" />`,
        )}

        ${section(
          'With a preselected value',
          `<smart-select-menu [(value)]="preselected" [options]="countries" />`,
        )}

        ${section(
          'Disabled',
          `<smart-select-menu [(value)]="disabledValue" [disabled]="true" [options]="countries" />`,
        )}

        ${section(
          'Per-item disabled',
          `<smart-select-menu [(value)]="partlyDisabled" [options]="withDisabledItem" />`,
          'Enterprise is not selectable.',
        )}

        ${section(
          'Empty state',
          `<smart-select-menu [(value)]="noItems" [options]="{ items: [], emptyTpl: emptyTpl }" />`,
          'emptyTpl is rendered only when items is empty.',
        )}

        ${section(
          'External class',
          `<smart-select-menu
             class="smart:rounded-lg smart:bg-yellow-50 smart:p-2 smart:dark:bg-yellow-900/30"
             [(value)]="styled"
             [options]="countries"
           />`,
        )}

      </div>
    `,
  }),
};
