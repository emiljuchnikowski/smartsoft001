import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { SmartSelectMenu } from './select-menu';
import { SelectMenuValue } from './select-menu.types';
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

// No implementation is registered, so <SmartSelectMenu> falls back to
// SmartSelectMenuStandard, which renders a native <select>.
const meta: Meta<SelectMenuArgs> = {
  title: 'Components/Select Menu',
  tags: ['autodocs'],
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
      description: 'External CSS classes, passed as `className`.',
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

/** A controlled `value`: the story keeps it in its state. */
const SelectMenuPlayground = (args: SelectMenuArgs) => {
  const [selected, setSelected] = useState<SelectMenuValue>(args.value || null);

  return (
    <div style={{ padding: 40, maxWidth: '20rem' }}>
      <SmartSelectMenu
        value={selected}
        onValueChange={setSelected}
        disabled={args.disabled}
        options={
          {
            placeholder: args.placeholder,
            ariaLabel: args.ariaLabel,
            items: [
              { value: 'pl', label: 'Poland' },
              { value: 'de', label: 'Germany' },
              { value: 'us', label: 'United States' },
            ],
          } satisfies ISelectMenuOptions
        }
        className={args.cssClass}
      />
    </div>
  );
};

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => <SelectMenuPlayground key={args.value} {...args} />,
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const Section = ({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={sectionTitle}>{title}</h3>
    {note ? (
      <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>{note}</p>
    ) : null}
    <div style={{ maxWidth: '20rem' }}>{children}</div>
  </section>
);

const countries = { items: COUNTRIES } satisfies ISelectMenuOptions;
const withPlaceholder = {
  placeholder: 'Choose a country',
  items: COUNTRIES,
} satisfies ISelectMenuOptions;
const withDisabledItem = {
  placeholder: 'Choose a plan',
  items: [
    { value: 'free', label: 'Free' },
    { value: 'team', label: 'Team' },
    { value: 'enterprise', label: 'Enterprise', disabled: true },
  ],
} satisfies ISelectMenuOptions;

const emptyTpl = <span>No countries available</span>;

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
      <Section title="With placeholder">
        <SmartSelectMenu defaultValue={null} options={withPlaceholder} />
      </Section>

      <Section title="With a preselected value">
        <SmartSelectMenu defaultValue="de" options={countries} />
      </Section>

      <Section title="Disabled">
        <SmartSelectMenu
          defaultValue="pl"
          disabled={true}
          options={countries}
        />
      </Section>

      <Section title="Per-item disabled" note="Enterprise is not selectable.">
        <SmartSelectMenu defaultValue={null} options={withDisabledItem} />
      </Section>

      <Section
        title="Empty state"
        note="emptyTpl is rendered only when items is empty."
      >
        <SmartSelectMenu
          defaultValue={null}
          options={{ items: [], emptyTpl: emptyTpl }}
        />
      </Section>

      <Section title="External class">
        <SmartSelectMenu
          className="smart:rounded-lg smart:bg-yellow-50 smart:p-2 smart:dark:bg-yellow-900/30"
          defaultValue="jp"
          options={countries}
        />
      </Section>
    </div>
  ),
};
