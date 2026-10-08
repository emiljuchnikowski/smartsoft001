import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { PagingVariant } from './paging.types';
import { SmartPagingPreset } from './preset/paging-preset';

interface PagingArgs {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  variant: PagingVariant;
}

const VARIANTS: PagingVariant[] = ['card-footer', 'centered', 'simple'];

// Showcase headings read as prose, not as the raw option value.
const VARIANT_LABELS: Record<PagingVariant, string> = {
  'card-footer': 'Card footer',
  centered: 'Centered',
  simple: 'Simple',
};

const meta: Meta<PagingArgs> = {
  title: 'Components/Paging',
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // paging, so every <SmartPaging> renders SmartPagingPreset. The preset is
    // rendered directly for the variant showcase.
    smart: { components: { paging: SmartPagingPreset } },
  },
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    pageSize: { control: { type: 'number', min: 1 } },
    totalItems: { control: { type: 'number', min: 0 } },
    variant: { control: 'radio', options: VARIANTS },
  },
  args: {
    currentPage: 1,
    totalPages: 5,
    pageSize: 10,
    totalItems: 48,
    variant: 'card-footer',
  },
};

export default meta;
type Story = StoryObj<PagingArgs>;

/** Keeps the page the paging requests, starting from the `currentPage` arg. */
const PagingPlayground = (args: PagingArgs) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage);

  return (
    <div style={{ padding: 40 }}>
      <SmartPagingPreset
        currentPage={currentPage}
        totalPages={args.totalPages}
        pageSize={args.pageSize}
        totalItems={args.totalItems}
        variant={args.variant}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => <PagingPlayground key={args.currentPage} {...args} />,
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

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
        <section key={variant}>
          <h3 style={sectionTitle}>{VARIANT_LABELS[variant]}</h3>
          <SmartPagingPreset
            currentPage={3}
            totalPages={10}
            pageSize={10}
            totalItems={98}
            variant={variant}
          />
        </section>
      ))}
    </div>
  ),
};
