import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartListContainer } from './list-container';
import { IListContainerOptions, SmartListContainerVariant } from '../../models';

const VARIANTS: SmartListContainerVariant[] = [
  'simple-dividers',
  'card-dividers',
  'separate-cards',
  'flat-card-dividers',
];

interface ListContainerArgs {
  variant: SmartListContainerVariant;
  fullWidthOnMobile: boolean;
  cssClass: string;
}

// No implementation is registered, so <SmartListContainer> falls back to
// SmartListContainerStandard — a role="list" wrapper around the children.
const meta: Meta<ListContainerArgs> = {
  title: 'Components/List Container',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      description:
        'Exposed by the standard component as the `data-variant` attribute; styling is left to a custom implementation.',
    },
    fullWidthOnMobile: {
      control: 'boolean',
      description:
        "Reserved for implementations registered as components['list-container']; ignored by the standard component.",
    },
    cssClass: {
      control: 'text',
      description: 'External CSS classes (alias for `class`).',
    },
  },
  args: {
    variant: 'simple-dividers',
    fullWidthOnMobile: false,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<ListContainerArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => {
    const options = {
      variant: args.variant,
      fullWidthOnMobile: args.fullWidthOnMobile,
    } satisfies IListContainerOptions;

    return (
      <div style={{ padding: 40, maxWidth: '32rem' }}>
        <SmartListContainer options={options} className={args.cssClass}>
          <div role="listitem">Lindsay Walton — Front-end Developer</div>
          <div role="listitem">Courtney Henry — Designer</div>
          <div role="listitem">Tom Cook — Director of Product</div>
        </SmartListContainer>
      </div>
    );
  },
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const Container = ({ options }: { options: IListContainerOptions }) => (
  <SmartListContainer options={options}>
    <div role="listitem">Lindsay Walton</div>
    <div role="listitem">Courtney Henry</div>
  </SmartListContainer>
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
        maxWidth: '32rem',
      }}
    >
      {VARIANTS.map((variant) => (
        <section key={variant}>
          <h3 style={sectionTitle}>variant: {variant}</h3>
          <Container options={{ variant }} />
        </section>
      ))}

      <section>
        <h3 style={sectionTitle}>Without options</h3>
        <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>
          No <code>data-variant</code> attribute is written when{' '}
          <code>options</code> is omitted.
        </p>
        <SmartListContainer>
          <div role="listitem">Lindsay Walton</div>
          <div role="listitem">Courtney Henry</div>
        </SmartListContainer>
      </section>

      <section>
        <h3 style={sectionTitle}>External class</h3>
        <SmartListContainer
          className="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
          options={{ variant: 'separate-cards' }}
        >
          <div role="listitem">Lindsay Walton</div>
          <div role="listitem">Courtney Henry</div>
        </SmartListContainer>
      </section>
    </div>
  ),
};
