import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { IDateRange } from '@smartsoft001/domain-core';

import { SmartDateRange } from './date-range';
import { SmartDateRangeModalStandard } from './standard/date-range-modal-standard';

const RANGE: IDateRange = { start: '2026-04-01', end: '2026-04-07' };

interface DateRangeArgs {
  withValue: boolean;
  showFilterBtns: boolean;
  restrictSelectionTo: number;
  cssClass: string;
}

const MODAL_ONLY =
  'Consumed only by <SmartDateRangeModalStandard> — the preset trigger ignores it.';

const meta: Meta<DateRangeArgs> = {
  title: 'Components/DateRange',
  tags: ['autodocs'],
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

/** A controlled range: the story keeps the value in its state. */
const PlaygroundExample = ({ withValue, cssClass }: DateRangeArgs) => {
  const [value, setValue] = useState<IDateRange | null>(
    withValue ? { ...RANGE } : null,
  );

  return (
    <div style={{ padding: 40, minHeight: 520 }}>
      <SmartDateRange
        variant="preset"
        className={cssClass}
        value={value}
        onValueChange={(next) => setValue(next ?? null)}
      />
      <p style={{ marginTop: 12, fontSize: 14, color: '#6b7280' }}>
        Value: {value ? value.start + ' - ' + value.end : 'none'}
      </p>
    </div>
  );
};

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <PlaygroundExample key={String(args.withValue)} {...args} />
  ),
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

const modalFrame = {
  position: 'relative',
  transform: 'translateZ(0)',
  overflow: 'hidden',
  height: 600,
} as const;

const onApply = (data: unknown) => console.log('[storybook] applied', data);
const onDismiss = () => console.log('[storybook] dismissed');

const AllVariantsExample = () => {
  const [emptyValue, setEmptyValue] = useState<IDateRange | null>(null);
  const [filledValue, setFilledValue] = useState<IDateRange | null>({
    ...RANGE,
  });
  const [styledValue, setStyledValue] = useState<IDateRange | null>({
    ...RANGE,
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        padding: 24,
      }}
    >
      <div
        style={{
          minHeight: 520,
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        <Section
          title="Empty trigger"
          note='No value — the trigger shows the translated "select" label and no clear button.'
        >
          <SmartDateRange
            variant="preset"
            value={emptyValue}
            onValueChange={(next) => setEmptyValue(next ?? null)}
          />
        </Section>

        <Section
          title="Filled trigger"
          note='With a range the trigger shows "start - end" and the clear (×) button appears.'
        >
          <SmartDateRange
            variant="preset"
            value={filledValue}
            onValueChange={(next) => setFilledValue(next ?? null)}
          />
        </Section>

        <Section
          title="External class"
          note="The class is forwarded to the inner variant component."
        >
          <SmartDateRange
            variant="preset"
            className="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
            value={styledValue}
            onValueChange={(next) => setStyledValue(next ?? null)}
          />
        </Section>
      </div>

      <Section
        title="Modal, with quick filters"
        note="The standard modal rendered inline, with the six quick filter buttons."
      >
        <div style={modalFrame}>
          <SmartDateRangeModalStandard
            showFilterBtns={true}
            onApply={onApply}
            onDismiss={onDismiss}
          />
        </div>
      </Section>

      <Section
        title="Modal, without quick filters"
        note="The same modal with the quick filter row hidden."
      >
        <div style={modalFrame}>
          <SmartDateRangeModalStandard
            showFilterBtns={false}
            onApply={onApply}
            onDismiss={onDismiss}
          />
        </div>
      </Section>
    </div>
  );
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => <AllVariantsExample />,
};
