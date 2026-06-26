import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { AccordionPresetComponent } from './preset/preset.component';
import { IAccordionOptions } from '../../models';

// The accordion has NO standard-component token, so the preset is rendered
// directly via its <smart-accordion-preset> selector (not DI-swappable). The
// required headerTpl / bodyTpl inputs are supplied as <ng-template> refs.
const meta: Meta = {
  title: 'Components/Accordion',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [AccordionPresetComponent],
    }),
  ],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Initial open state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state — prevents toggle',
    },
    cssClass: {
      control: 'text',
      description: 'Additional CSS classes for the container',
    },
  },
  args: {
    open: false,
    disabled: false,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  name: 'Playground',
  render: (args: any) => ({
    props: {
      isOpen: args.open,
      options: { disabled: args.disabled } as IAccordionOptions,
      cssClass: args.cssClass,
    },
    template: `
      <div style="padding: 24px; max-width: 480px;">
        <ng-template #headerTpl>What is the best thing about Switzerland?</ng-template>
        <ng-template #bodyTpl>I don't know, but the flag is a big plus.</ng-template>
        <smart-accordion-preset
          [headerTpl]="headerTpl"
          [bodyTpl]="bodyTpl"
          [(show)]="isOpen"
          [options]="options"
          [cssClass]="cssClass"
        />
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      closedOpen: false,
      openOpen: true,
      disabledOpen: false,
      disabledOptions: { disabled: true } as IAccordionOptions,
      faq1: false,
      faq2: true,
      faq3: false,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px; max-width: 560px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Closed</h3>
          <ng-template #h1>Click to expand</ng-template>
          <ng-template #b1>This content is hidden by default.</ng-template>
          <smart-accordion-preset [headerTpl]="h1" [bodyTpl]="b1" [(show)]="closedOpen" />
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Open</h3>
          <ng-template #h2>This accordion starts open</ng-template>
          <ng-template #b2>This content is visible by default.</ng-template>
          <smart-accordion-preset [headerTpl]="h2" [bodyTpl]="b2" [(show)]="openOpen" />
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Disabled</h3>
          <ng-template #h3>This accordion is disabled</ng-template>
          <ng-template #b3>You should not see this.</ng-template>
          <smart-accordion-preset
            [headerTpl]="h3"
            [bodyTpl]="b3"
            [(show)]="disabledOpen"
            [options]="disabledOptions"
          />
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Multiple (FAQ)</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <ng-template #fh1>What payment methods do you accept?</ng-template>
            <ng-template #fb1>We accept Visa, Mastercard, PayPal, and bank transfers.</ng-template>
            <smart-accordion-preset [headerTpl]="fh1" [bodyTpl]="fb1" [(show)]="faq1" />

            <ng-template #fh2>How long does shipping take?</ng-template>
            <ng-template #fb2>Standard shipping takes 3-5 business days.</ng-template>
            <smart-accordion-preset [headerTpl]="fh2" [bodyTpl]="fb2" [(show)]="faq2" />

            <ng-template #fh3>Can I return my order?</ng-template>
            <ng-template #fb3>Yes, you can return any item within 30 days for a full refund.</ng-template>
            <smart-accordion-preset [headerTpl]="fh3" [bodyTpl]="fb3" [(show)]="faq3" />
          </div>
        </section>

      </div>
    `,
  }),
};
