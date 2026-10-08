import type { Meta, StoryObj } from '@storybook/react-vite';

import { IContainerOptions } from '../../models';
import { SmartContainerPreset } from './preset/container-preset';

const MODES = ['full-width', 'constrained', 'container'] as const;

// Showcase headings read as prose, not as the raw option value.
const MODE_LABELS: Record<(typeof MODES)[number], string> = {
  'full-width': 'Full width',
  constrained: 'Constrained',
  container: 'Container',
};
const PADDINGS = ['none', 'mobile', 'always'] as const;

const PADDING_LABELS: Record<(typeof PADDINGS)[number], string> = {
  none: 'No padding',
  mobile: 'Padded on mobile only',
  always: 'Padded at every width',
};

interface ContainerArgs {
  mode: (typeof MODES)[number];
  padding: (typeof PADDINGS)[number];
  narrow: boolean;
}

const meta: Meta<ContainerArgs> = {
  title: 'Components/Container',
  tags: ['autodocs'],
  // The stories render SmartContainerPreset directly; the registration below
  // additionally swaps the preset in for any <SmartContainer> usage.
  parameters: {
    smart: { components: { container: SmartContainerPreset } },
  },
  argTypes: {
    mode: { control: 'inline-radio', options: MODES },
    padding: { control: 'inline-radio', options: PADDINGS },
    narrow: {
      control: 'boolean',
      description: 'Forces max-w-3xl — wins over `mode`.',
    },
  },
  args: { mode: 'container', padding: 'always', narrow: false },
};

export default meta;
type Story = StoryObj<ContainerArgs>;

// The container itself is a neutral layout primitive with no colours of its own,
// so the demo surfaces below supply them. They must be theme-aware Tailwind
// classes, not hardcoded hex: story text inherits its colour from <body>, which
// preview-head.html flips to near-white in dark mode — a hardcoded white box
// would render invisible text.
const PAGE_CLASS = 'smart:bg-gray-100 smart:dark:bg-gray-800';
const BOX_CLASS = [
  'smart:rounded-lg',
  'smart:border',
  'smart:border-gray-300',
  'smart:dark:border-gray-600',
  'smart:bg-white',
  'smart:dark:bg-gray-900',
  'smart:p-4',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => {
    const options: IContainerOptions = { ...args };

    return (
      <div className={PAGE_CLASS} style={{ padding: '40px 0' }}>
        <SmartContainerPreset options={options}>
          <div className={BOX_CLASS}>
            {`mode: ${options.mode} · padding: ${options.padding}`}
            {options.narrow && ' · narrow'}
          </div>
        </SmartContainerPreset>
      </div>
    );
  },
};
// #endregion

const Box = ({
  label,
  options,
}: {
  label: string;
  options: IContainerOptions;
}) => (
  // In Angular the preset renders inside its host element
  // (<smart-container-preset>), and that element, not the container, is the
  // flex item, so the `mx-auto` container keeps its full width instead of
  // shrinking around its content. This <div> plays the part of the host.
  <div>
    <SmartContainerPreset options={options}>
      <div className={BOX_CLASS}>{label}</div>
    </SmartContainerPreset>
  </div>
);

const sectionTitle = { fontSize: 16, fontWeight: 600, margin: '0 24px 12px' };

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      className={PAGE_CLASS}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        padding: '24px 0',
      }}
    >
      {MODES.map((mode) => (
        <section key={mode}>
          <h3 style={sectionTitle}>{MODE_LABELS[mode]}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PADDINGS.map((padding) => (
              <Box
                key={padding}
                label={PADDING_LABELS[padding]}
                options={{ mode, padding }}
              />
            ))}
          </div>
        </section>
      ))}

      <section>
        <h3 style={sectionTitle}>Narrow, which overrides the mode</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Box
            label="Container, narrowed, padded at every width"
            options={{ mode: 'container', narrow: true, padding: 'always' }}
          />
          <Box
            label="Full width, narrowed, padded on mobile only"
            options={{ mode: 'full-width', narrow: true, padding: 'mobile' }}
          />
        </div>
      </section>
    </div>
  ),
};
