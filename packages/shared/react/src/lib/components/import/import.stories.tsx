import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartImport } from './import';

const ACCEPTS = ['application/json', '.csv', '*/*'] as const;

interface ImportArgs {
  accept: string;
  cssClass: string;
}

const meta: Meta<ImportArgs> = {
  title: 'Components/Import',
  tags: ['autodocs'],
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40 }}>
      <p style={{ marginBottom: 16, fontSize: 14, color: '#6b7280' }}>
        Click to open the native file dialog. The chosen file is emitted through{' '}
        <code>(set)</code> and logged to the console.
      </p>
      <SmartImport
        accept={args.accept}
        className={args.cssClass}
        onSet={onFileSelected}
      />
    </div>
  ),
};
// #endregion

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 24 }}
    >
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          Accept filters
        </h3>
        <p
          style={{
            fontSize: 13,
            opacity: 0.7,
            marginBottom: 12,
            maxWidth: '60ch',
          }}
        >
          These three cells render <strong>identical</strong> markup.{' '}
          <code>accept</code> is written to a hidden{' '}
          <code>&lt;input type=&quot;file&quot;&gt;</code>, so it only changes
          which files the native dialog offers. Open one and pick a file — the
          selection is logged to the console through <code>(set)</code>.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 24,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {ACCEPTS.map((accept) => (
            <div key={accept} style={{ textAlign: 'center' }}>
              <SmartImport accept={accept} onSet={onFileSelected} />
              <p style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
                {accept}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          External class
        </h3>
        <SmartImport
          className="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
          onSet={onFileSelected}
        />
      </section>
    </div>
  ),
};
