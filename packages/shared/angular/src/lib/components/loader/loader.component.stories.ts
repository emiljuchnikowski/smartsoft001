import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { LoaderComponent } from './loader.component';
import { LoaderStandardComponent } from './standard/standard.component';

const meta: Meta<LoaderComponent> = {
  title: 'Components/Loader',
  component: LoaderComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LoaderComponent, LoaderStandardComponent],
    }),
  ],
  argTypes: {
    show: {
      control: 'boolean',
      description: 'Show or hide the spinner',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Spinner size',
    },
    color: {
      control: 'select',
      options: [
        'slate',
        'gray',
        'zinc',
        'red',
        'orange',
        'amber',
        'yellow',
        'lime',
        'green',
        'emerald',
        'teal',
        'cyan',
        'sky',
        'blue',
        'indigo',
        'violet',
        'purple',
        'fuchsia',
        'pink',
        'rose',
      ],
      description: 'Spinner color',
    },
    cssClass: {
      control: 'text',
      description: 'External CSS class (alias for `class`)',
    },
  },
};

export default meta;
type Story = StoryObj<LoaderComponent>;

export const Playground: Story = {
  name: 'Playground',
  args: {
    show: true,
    size: 'md',
    color: 'indigo',
    cssClass: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 40px;">
        <smart-loader
          [show]="show"
          [size]="size"
          [color]="color"
          [class]="cssClass"
        ></smart-loader>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Sizes (indigo)
          </h3>
          <div style="display: flex; align-items: center; gap: 24px;">
            <smart-loader [show]="true" size="xs"></smart-loader>
            <smart-loader [show]="true" size="sm"></smart-loader>
            <smart-loader [show]="true" size="md"></smart-loader>
            <smart-loader [show]="true" size="lg"></smart-loader>
            <smart-loader [show]="true" size="xl"></smart-loader>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Colors (size md)
          </h3>
          <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 16px;">
            <smart-loader [show]="true" color="slate"></smart-loader>
            <smart-loader [show]="true" color="red"></smart-loader>
            <smart-loader [show]="true" color="orange"></smart-loader>
            <smart-loader [show]="true" color="amber"></smart-loader>
            <smart-loader [show]="true" color="yellow"></smart-loader>
            <smart-loader [show]="true" color="green"></smart-loader>
            <smart-loader [show]="true" color="emerald"></smart-loader>
            <smart-loader [show]="true" color="teal"></smart-loader>
            <smart-loader [show]="true" color="sky"></smart-loader>
            <smart-loader [show]="true" color="blue"></smart-loader>
            <smart-loader [show]="true" color="indigo"></smart-loader>
            <smart-loader [show]="true" color="violet"></smart-loader>
            <smart-loader [show]="true" color="purple"></smart-loader>
            <smart-loader [show]="true" color="pink"></smart-loader>
            <smart-loader [show]="true" color="rose"></smart-loader>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Hidden (show = false)
          </h3>
          <div
            style="display: flex; align-items: center; gap: 8px; min-height: 32px; padding: 8px; border: 1px dashed #d1d5db;"
          >
            <smart-loader [show]="false"></smart-loader>
            <span style="font-size: 14px; color: #6b7280;">
              Nothing rendered above
            </span>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            With external class
          </h3>
          <smart-loader
            [show]="true"
            size="lg"
            class="smart:text-fuchsia-500"
          ></smart-loader>
        </section>

      </div>
    `,
  }),
};

export const LightAndDarkMode: Story = {
  name: 'Light and dark mode',
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0; min-height: 240px;">

        <div style="padding: 24px; background: #f9fafb; color: #111827;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Light mode
          </h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <smart-loader [show]="true" size="md" color="indigo"></smart-loader>
            <smart-loader [show]="true" size="md" color="emerald"></smart-loader>
            <smart-loader [show]="true" size="md" color="rose"></smart-loader>
          </div>
        </div>

        <div class="dark" style="padding: 24px; background: #111827; color: #f9fafb;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Dark mode
          </h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <smart-loader [show]="true" size="md" color="indigo"></smart-loader>
            <smart-loader [show]="true" size="md" color="emerald"></smart-loader>
            <smart-loader [show]="true" size="md" color="rose"></smart-loader>
          </div>
        </div>

      </div>
    `,
  }),
};
