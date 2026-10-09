import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { PagingVariant } from './base/base.component';
import { PagingComponent } from './paging.component';
import { PagingPresetComponent } from './preset/preset.component';
import { PAGING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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
  decorators: [
    moduleMetadata({
      // Register the preset variation as the replacement for the standard
      // paging, so every <smart-paging> renders PagingPresetComponent; the
      // wrapper forwards every input, `variant` included.
      imports: [PagingComponent],
      providers: [
        {
          provide: PAGING_STANDARD_COMPONENT_TOKEN,
          useValue: PagingPresetComponent,
        },
      ],
    }),
  ],
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      ...args,
      // The page is owned by the parent: keep it in a signal and move it on
      // `pageChange`, so a click on a page makes it the current one.
      page: signal(args.currentPage),
    },
    template: `
      <div style="padding: 40px;">
        <smart-paging
          [currentPage]="page()"
          [totalPages]="totalPages"
          [pageSize]="pageSize"
          [totalItems]="totalItems"
          [variant]="variant"
          (pageChange)="page.set($event)"
        ></smart-paging>
      </div>
    `,
  }),
};
// #endregion

const variantSection = (variant: PagingVariant) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${VARIANT_LABELS[variant]}</h3>
    <smart-paging
      [currentPage]="page['${variant}']()"
      [totalPages]="10"
      [pageSize]="10"
      [totalItems]="98"
      variant="${variant}"
      (pageChange)="page['${variant}'].set($event)"
    ></smart-paging>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    // One page signal per variant, so each pager moves on its own clicks.
    props: {
      page: Object.fromEntries(VARIANTS.map((variant) => [variant, signal(3)])),
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
        ${VARIANTS.map((variant) => variantSection(variant)).join('\n')}
      </div>
    `,
  }),
};
