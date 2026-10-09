import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { SmartExport } from './export';

const SINGLE = { name: 'John', email: 'john@example.com' };
const ROWS = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

interface ExportArgs {
  hasValue: boolean;
  payload: 'object' | 'rows';
  fileName: string;
  cssClass: string;
}

const meta: Meta<ExportArgs> = {
  title: 'Components/Export',
  tags: ['autodocs'],
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
    fileName: {
      control: 'text',
      description: 'Handed to `handler` as its second argument.',
    },
    cssClass: {
      control: 'text',
      description: 'Passed through as `className`.',
    },
  },
  args: {
    hasValue: true,
    payload: 'object',
    fileName: 'export.json',
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<ExportArgs>;

// `handler` is required — every instance must pass it. It receives `value`
// and `fileName`.
const handler = (value: unknown, fileName?: string) =>
  console.log('[storybook] exported', value, fileName);

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40 }}>
      <p style={{ marginBottom: 16, fontSize: 14, color: '#6b7280' }}>
        Click the export button to trigger the handler (logged to the console).
      </p>
      <SmartExport
        value={
          args.hasValue ? (args.payload === 'rows' ? ROWS : SINGLE) : undefined
        }
        fileName={args.fileName}
        handler={handler}
        className={args.cssClass}
      />
    </div>
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

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 24 }}
    >
      <Section title="Enabled" note="`value` is set, so the button is active.">
        <SmartExport value={SINGLE} handler={handler} />
      </Section>

      <Section
        title="Disabled"
        note="No `value`, so the button gets smart:opacity-50 and smart:cursor-not-allowed."
      >
        <SmartExport handler={handler} />
      </Section>

      <Section
        title="Array payload"
        note="Visually identical to the enabled cell — only the value handed to `handler` differs."
      >
        <SmartExport value={ROWS} handler={handler} />
      </Section>

      <Section
        title="External class"
        note="The class is forwarded to the wrapper around the button."
      >
        <SmartExport
          className="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
          value={SINGLE}
          handler={handler}
        />
      </Section>
    </div>
  ),
};
