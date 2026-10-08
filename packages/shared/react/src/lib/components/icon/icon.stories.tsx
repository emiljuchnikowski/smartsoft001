import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { SmartIcon } from './icon';
import { IconName } from './icon.types';
import { SmartIconPreset } from './preset/icon-preset';
import { IconPresetSize, IconPresetVariant } from './preset/preset-classes';

// `IconName` is a string-union type with no runtime counterpart, so the story
// declares its own list to iterate.
const ICON_NAMES: IconName[] = ['spinner', 'chevron-down', 'chevron-up'];
const VARIANTS: IconPresetVariant[] = ['plain', 'contained', 'soft'];
const SIZES: IconPresetSize[] = ['sm', 'md', 'lg'];

interface IconArgs {
  name: IconName;
  variant: IconPresetVariant;
  size: IconPresetSize;
  useCustomTemplate: boolean;
  cssClass: string;
}

const meta: Meta<IconArgs> = {
  title: 'Components/Icon',
  tags: ['autodocs'],
  // Icon has no registry key by design, so the preset is used directly as
  // `SmartIconPreset` rather than swapped in through `SmartProvider`.
  argTypes: {
    name: { control: 'inline-radio', options: ICON_NAMES },
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    useCustomTemplate: {
      control: 'boolean',
      description:
        'Render a custom SVG through `template`, which wins over `name`.',
    },
    cssClass: { control: 'text', description: 'Passed through as `class`.' },
  },
  args: {
    name: 'spinner',
    variant: 'plain',
    size: 'md',
    useCustomTemplate: false,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<IconArgs>;

const heart: ReactNode = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="smart:size-8 smart:text-pink-500"
  >
    <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4.5 4.5 8.5C19 16.65 12 21 12 21z" />
  </svg>
);

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div
      style={{
        padding: 40,
        display: 'flex',
        gap: 24,
        alignItems: 'center',
      }}
    >
      <SmartIconPreset
        name={args.name}
        variant={args.variant}
        size={args.size}
        className={args.cssClass}
        template={args.useCustomTemplate ? heart : null}
      />
    </div>
  ),
};
// #endregion

const Cell = ({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) => (
  <div style={{ textAlign: 'center' }}>
    {children}
    <p style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>{label}</p>
  </div>
);

const Grid = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: 24,
      alignItems: 'center',
      justifyItems: 'center',
    }}
  >
    {children}
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
    {children}
  </section>
);

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
      {VARIANTS.map((variant) => (
        <Section key={variant} title={`Variant: ${variant}`}>
          <Grid>
            {ICON_NAMES.map((name) => (
              // The icon name is an API value, so it is marked up as code
              // rather than presented as a prose label.
              <Cell key={name} label={<code>{name}</code>}>
                <SmartIconPreset variant={variant} name={name} size="md" />
              </Cell>
            ))}
          </Grid>
        </Section>
      ))}

      <Section title="Sizes">
        <Grid>
          {SIZES.map((size) => (
            <Cell key={size} label={size}>
              <SmartIconPreset
                variant="contained"
                name="chevron-down"
                size={size}
              />
            </Cell>
          ))}
        </Grid>
      </Section>

      <Section title="Bare icon sized and coloured by class">
        <Grid>
          <Cell label="indigo">
            <SmartIcon
              name="spinner"
              className="smart:size-8 smart:text-indigo-600"
            />
          </Cell>
          <Cell label="red">
            <SmartIcon
              name="chevron-down"
              className="smart:size-8 smart:text-red-500"
            />
          </Cell>
          <Cell label="green">
            <SmartIcon
              name="chevron-up"
              className="smart:size-8 smart:text-green-500"
            />
          </Cell>
        </Grid>
      </Section>

      <Section title="Custom SVG template (wins over name)">
        <Grid>
          <Cell label="bare icon">
            <SmartIcon template={heart} />
          </Cell>
          <Cell label="preset, soft">
            <SmartIconPreset variant="soft" size="lg" template={heart} />
          </Cell>
        </Grid>
      </Section>
    </div>
  ),
};
