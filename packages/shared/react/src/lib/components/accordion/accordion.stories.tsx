import type { Meta, StoryObj } from '@storybook/react-vite';

import { IAccordionOptions } from '../../models';
import { SmartAccordionPreset } from './preset/accordion-preset';

interface AccordionArgs {
  open: boolean;
  disabled: boolean;
  cssClass: string;
}

// The accordion has NO registry key, so the preset is rendered directly as
// `SmartAccordionPreset` (not swappable through `SmartProvider`). The required
// headerTpl / bodyTpl props are supplied as React nodes.
const meta: Meta<AccordionArgs> = {
  title: 'Components/Accordion',
  tags: ['autodocs'],
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
type Story = StoryObj<AccordionArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <SmartAccordionPreset
        // Remounts when the `open` control changes, so it becomes the new
        // initial state; clicks toggle the accordion's own state.
        key={String(args.open)}
        headerTpl="What is the best thing about Switzerland?"
        bodyTpl="I don't know, but the flag is a big plus."
        defaultShow={args.open}
        options={{ disabled: args.disabled } as IAccordionOptions}
        className={args.cssClass}
      />
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const disabledOptions: IAccordionOptions = { disabled: true };

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
        maxWidth: 560,
      }}
    >
      <section>
        <h3 style={sectionTitle}>Closed</h3>
        <SmartAccordionPreset
          headerTpl="Click to expand"
          bodyTpl="This content is hidden by default."
          defaultShow={false}
        />
      </section>

      <section>
        <h3 style={sectionTitle}>Open</h3>
        <SmartAccordionPreset
          headerTpl="This accordion starts open"
          bodyTpl="This content is visible by default."
          defaultShow={true}
        />
      </section>

      <section>
        <h3 style={sectionTitle}>Disabled</h3>
        <SmartAccordionPreset
          headerTpl="This accordion is disabled"
          bodyTpl="You should not see this."
          defaultShow={false}
          options={disabledOptions}
        />
      </section>

      <section>
        <h3 style={sectionTitle}>Multiple (FAQ)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SmartAccordionPreset
            headerTpl="What payment methods do you accept?"
            bodyTpl="We accept Visa, Mastercard, PayPal, and bank transfers."
            defaultShow={false}
          />

          <SmartAccordionPreset
            headerTpl="How long does shipping take?"
            bodyTpl="Standard shipping takes 3-5 business days."
            defaultShow={true}
          />

          <SmartAccordionPreset
            headerTpl="Can I return my order?"
            bodyTpl="Yes, you can return any item within 30 days for a full refund."
            defaultShow={false}
          />
        </div>
      </section>
    </div>
  ),
};
