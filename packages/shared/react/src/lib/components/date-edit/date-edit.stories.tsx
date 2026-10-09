import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { SmartDateEdit } from './date-edit';

interface DateEditArgs {
  value: string;
  cssClass: string;
}

const meta: Meta<DateEditArgs> = {
  title: 'Components/DateEdit',
  tags: ['autodocs'],
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

/** A controlled date: the story keeps the value in its state. */
const PlaygroundExample = ({ value: initial, cssClass }: DateEditArgs) => {
  const [value, setValue] = useState(initial);

  return (
    <div style={{ padding: 40, minHeight: 480 }}>
      <SmartDateEdit
        variant="preset"
        className={cssClass}
        value={value}
        onValueChange={setValue}
      />
      <p style={{ marginTop: 12, fontSize: 14, color: '#6b7280' }}>
        Value: {value}
      </p>
    </div>
  );
};

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => <PlaygroundExample key={args.value} {...args} />,
};
// #endregion

const Section = ({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
    <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>{note}</p>
    {children}
  </section>
);

const AllVariantsExample = () => {
  const [validValue, setValidValue] = useState('2026-04-07');
  const [invalidValue, setInvalidValue] = useState('not-a-date');
  const [styledValue, setStyledValue] = useState('2026-04-07');
  const [firstValue, setFirstValue] = useState('2026-01-01');
  const [secondValue, setSecondValue] = useState('2026-12-31');

  // min-height keeps the absolutely-positioned calendar popover from clipping.
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        padding: 24,
        minHeight: 520,
      }}
    >
      <Section
        title="Default value"
        note="No value bound at all — the component falls back to 2001-01-01."
      >
        <SmartDateEdit variant="preset" />
      </Section>

      <Section
        title="Supplied date"
        note="A valid YYYY-MM-DD value shown in the trigger."
      >
        <SmartDateEdit
          variant="preset"
          value={validValue}
          onValueChange={setValidValue}
        />
        <p style={{ marginTop: 8, fontSize: 13, opacity: 0.7 }}>
          Bound value: {validValue}
        </p>
      </Section>

      <Section
        title="Invalid value"
        note="An unparseable value adds the invalid trigger ring."
      >
        <SmartDateEdit
          variant="preset"
          value={invalidValue}
          onValueChange={setInvalidValue}
        />
      </Section>

      <Section
        title="Multiple instances"
        note="Each instance keeps its own popover and value."
      >
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <SmartDateEdit
            variant="preset"
            value={firstValue}
            onValueChange={setFirstValue}
          />
          <SmartDateEdit
            variant="preset"
            value={secondValue}
            onValueChange={setSecondValue}
          />
        </div>
      </Section>

      <Section
        title="External class"
        note="The class is forwarded to the inner variant component."
      >
        <SmartDateEdit
          variant="preset"
          className="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
          value={styledValue}
          onValueChange={setStyledValue}
        />
      </Section>
    </div>
  );
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => <AllVariantsExample />,
};
