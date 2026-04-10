import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { AccordionComponent } from './accordion.component';
import { IAccordionOptions } from '../../models';

const meta: Meta = {
  title: 'Components/Accordion',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [AccordionComponent],
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
  },
  args: {
    open: false,
    disabled: false,
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
    },
    template: `
      <smart-accordion [(show)]="isOpen" [options]="options">
        <span accordionHeader>What is the best thing about Switzerland?</span>
        <span accordionBody>I don't know, but the flag is a big plus.</span>
      </smart-accordion>
    `,
  }),
};

export const DefaultClosed: Story = {
  name: 'Default Closed',
  render: () => ({
    props: { isOpen: false },
    template: `
      <smart-accordion [(show)]="isOpen">
        <span accordionHeader>Click to expand</span>
        <span accordionBody>This content is hidden by default.</span>
      </smart-accordion>
    `,
  }),
};

export const DefaultOpen: Story = {
  name: 'Default Open',
  render: () => ({
    props: { isOpen: true },
    template: `
      <smart-accordion [(show)]="isOpen">
        <span accordionHeader>This accordion starts open</span>
        <span accordionBody>This content is visible by default.</span>
      </smart-accordion>
    `,
  }),
};

export const Disabled: Story = {
  name: 'Disabled',
  render: () => ({
    props: {
      isOpen: false,
      options: { disabled: true } as IAccordionOptions,
    },
    template: `
      <smart-accordion [(show)]="isOpen" [options]="options">
        <span accordionHeader>This accordion is disabled</span>
        <span accordionBody>You should not see this.</span>
      </smart-accordion>
    `,
  }),
};

export const MultipleFAQ: Story = {
  name: 'Multiple (FAQ)',
  render: () => ({
    props: {
      q1Open: false,
      q2Open: false,
      q3Open: false,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <smart-accordion [(show)]="q1Open">
          <span accordionHeader>What payment methods do you accept?</span>
          <span accordionBody>We accept Visa, Mastercard, PayPal, and bank transfers.</span>
        </smart-accordion>
        <smart-accordion [(show)]="q2Open">
          <span accordionHeader>How long does shipping take?</span>
          <span accordionBody>Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.</span>
        </smart-accordion>
        <smart-accordion [(show)]="q3Open">
          <span accordionHeader>Can I return my order?</span>
          <span accordionBody>Yes, you can return any item within 30 days of purchase for a full refund.</span>
        </smart-accordion>
      </div>
    `,
  }),
};

export const NestedContent: Story = {
  name: 'Nested Content',
  render: () => ({
    props: { isOpen: true },
    template: `
      <smart-accordion [(show)]="isOpen">
        <span accordionHeader>Accordion with rich content</span>
        <div accordionBody>
          <h4 style="font-weight: 600; margin-bottom: 8px;">Section Title</h4>
          <p style="margin-bottom: 8px;">This accordion contains structured content with multiple elements.</p>
          <ul style="list-style: disc; padding-left: 20px;">
            <li>Item one</li>
            <li>Item two</li>
            <li>Item three</li>
          </ul>
        </div>
      </smart-accordion>
    `,
  }),
};
