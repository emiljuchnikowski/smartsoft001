import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { CardComponent } from './card.component';
import { ICardOptions, SmartCardVariant } from '../../models';

const meta: Meta = {
  title: 'Components/Card',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CardComponent],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'basic',
        'edge-to-edge',
        'well',
        'well-on-gray',
        'well-edge-to-edge',
      ] as SmartCardVariant[],
      description: 'Card variant',
    },
    hasHeader: {
      control: 'boolean',
      description: 'Show header section',
    },
    hasFooter: {
      control: 'boolean',
      description: 'Show footer section',
    },
    grayFooter: {
      control: 'boolean',
      description: 'Gray background on footer',
    },
    grayBody: {
      control: 'boolean',
      description: 'Gray background on body',
    },
    title: {
      control: 'text',
      description: 'Card title (shown in header)',
    },
  },
  args: {
    variant: 'basic',
    hasHeader: false,
    hasFooter: false,
    grayFooter: false,
    grayBody: false,
    title: '',
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  name: 'Playground',
  render: (args: any) => ({
    props: {
      options: {
        variant: args.variant,
        grayFooter: args.grayFooter,
        grayBody: args.grayBody,
        title: args.title || undefined,
      } as ICardOptions,
      hasHeader: args.hasHeader,
      hasFooter: args.hasFooter,
    },
    template: `
      <smart-card [options]="options" [hasHeader]="hasHeader" [hasFooter]="hasFooter">
        <div cardHeader>Card Header</div>
        <p>This is the card body content. You can put anything here.</p>
        <div cardFooter>Card Footer</div>
      </smart-card>
    `,
  }),
};

export const BasicCard: Story = {
  name: 'Basic Card',
  render: () => ({
    template: `
      <smart-card>
        <p>This is a basic card with just body content.</p>
      </smart-card>
    `,
  }),
};

export const WithHeader: Story = {
  name: 'With Header',
  render: () => ({
    props: {
      options: { title: 'Card Title' } as ICardOptions,
    },
    template: `
      <smart-card [options]="options" [hasHeader]="true">
        <p>Card body with a titled header above.</p>
      </smart-card>
    `,
  }),
};

export const WithFooter: Story = {
  name: 'With Footer',
  render: () => ({
    template: `
      <smart-card [hasFooter]="true">
        <p>Card body content goes here.</p>
        <div cardFooter>
          <button style="color: #4f46e5; font-weight: 600; font-size: 14px;">View all &rarr;</button>
        </div>
      </smart-card>
    `,
  }),
};

export const WithHeaderAndFooter: Story = {
  name: 'With Header and Footer',
  render: () => ({
    props: {
      options: { title: 'Project Details' } as ICardOptions,
    },
    template: `
      <smart-card [options]="options" [hasHeader]="true" [hasFooter]="true">
        <p>Main content area between header and footer.</p>
        <div cardFooter>
          <button style="color: #4f46e5; font-weight: 600; font-size: 14px;">Save changes</button>
        </div>
      </smart-card>
    `,
  }),
};

export const GrayFooter: Story = {
  name: 'Gray Footer',
  render: () => ({
    props: {
      options: { grayFooter: true } as ICardOptions,
    },
    template: `
      <smart-card [options]="options" [hasFooter]="true">
        <p>Card with a gray-tinted footer section.</p>
        <div cardFooter>Footer with gray background</div>
      </smart-card>
    `,
  }),
};

export const GrayBody: Story = {
  name: 'Gray Body',
  render: () => ({
    props: {
      options: { title: 'Header', grayBody: true } as ICardOptions,
    },
    template: `
      <smart-card [options]="options" [hasHeader]="true">
        <p>Body area with gray background, contrasting with white header.</p>
      </smart-card>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => ({
    props: {
      basic: {} as ICardOptions,
      edgeToEdge: { variant: 'edge-to-edge' } as ICardOptions,
      well: { variant: 'well' } as ICardOptions,
      wellOnGray: { variant: 'well-on-gray' } as ICardOptions,
      wellEdge: { variant: 'well-edge-to-edge' } as ICardOptions,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <section>
          <h3 style="margin-bottom: 8px; font-weight: 600;">Basic</h3>
          <smart-card [options]="basic"><p>Basic card content</p></smart-card>
        </section>
        <section>
          <h3 style="margin-bottom: 8px; font-weight: 600;">Edge-to-edge on mobile</h3>
          <smart-card [options]="edgeToEdge"><p>No rounded corners on mobile</p></smart-card>
        </section>
        <section>
          <h3 style="margin-bottom: 8px; font-weight: 600;">Well</h3>
          <smart-card [options]="well"><p>Gray background, no shadow</p></smart-card>
        </section>
        <section>
          <h3 style="margin-bottom: 8px; font-weight: 600;">Well on gray</h3>
          <smart-card [options]="wellOnGray"><p>Darker gray background</p></smart-card>
        </section>
        <section>
          <h3 style="margin-bottom: 8px; font-weight: 600;">Well, edge-to-edge</h3>
          <smart-card [options]="wellEdge"><p>Gray well, no rounding on mobile</p></smart-card>
        </section>
      </div>
    `,
  }),
};
