import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { SearchbarComponent } from './searchbar.component';
import { SearchbarStandardComponent } from './standard/standard.component';
import { ISearchbarOptions } from '../../models';

const meta: Meta = {
  title: 'Components/Searchbar',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(TranslateModule.forRoot())],
    }),
    moduleMetadata({
      imports: [SearchbarComponent, SearchbarStandardComponent],
    }),
  ],
  argTypes: {
    placeholder: {
      control: 'text',
      description:
        'Placeholder translation key (falls back to key string if not translated)',
    },
    debounceTime: {
      control: 'number',
      description: 'Debounce time (ms) before `text` model emits a new value',
    },
    showToggleButton: {
      control: 'boolean',
      description:
        'When `show` is false, display a magnifier button that toggles the input on',
    },
    show: {
      control: 'boolean',
      description: 'Whether the input is visible',
    },
    cssClass: {
      control: 'text',
      description:
        'External CSS classes (alias for `class`) forwarded to the input element',
    },
  },
  args: {
    placeholder: 'search',
    debounceTime: 1000,
    showToggleButton: false,
    show: true,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  name: 'Playground',
  render: (args: any) => ({
    props: {
      isShown: args.show,
      textModel: '',
      options: {
        placeholder: args.placeholder,
        debounceTime: args.debounceTime,
        showToggleButton: args.showToggleButton,
      } as ISearchbarOptions,
      cssClass: args.cssClass,
    },
    template: `
      <div style="padding: 24px; max-width: 480px;">
        <smart-searchbar
          [(show)]="isShown"
          [(text)]="textModel"
          [options]="options"
          [class]="cssClass"
        />
      </div>
    `,
  }),
};

export const Default: Story = {
  name: 'Default (shown, empty)',
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    props: {
      isShown: true,
      textModel: '',
    },
    template: `
      <div style="padding: 24px; max-width: 480px;">
        <smart-searchbar [(show)]="isShown" [(text)]="textModel" />
      </div>
    `,
  }),
};

export const WithInitialText: Story = {
  name: 'With initial text',
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    props: {
      isShown: true,
      textModel: 'hello world',
    },
    template: `
      <div style="padding: 24px; max-width: 480px;">
        <smart-searchbar [(show)]="isShown" [(text)]="textModel" />
      </div>
    `,
  }),
};

export const HiddenWithToggleButton: Story = {
  name: 'Hidden with toggle button',
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    props: {
      isShown: false,
      textModel: '',
      options: { showToggleButton: true } as ISearchbarOptions,
    },
    template: `
      <div style="padding: 24px; max-width: 480px;">
        <p style="margin-bottom: 12px; font-size: 14px; color: #4b5563;">
          Click the magnifier button to reveal the input.
        </p>
        <smart-searchbar
          [(show)]="isShown"
          [(text)]="textModel"
          [options]="options"
        />
      </div>
    `,
  }),
};

export const WithCustomPlaceholder: Story = {
  name: 'With custom placeholder',
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    props: {
      isShown: true,
      textModel: '',
      options: { placeholder: 'custom-search-key' } as ISearchbarOptions,
    },
    template: `
      <div style="padding: 24px; max-width: 480px;">
        <smart-searchbar
          [(show)]="isShown"
          [(text)]="textModel"
          [options]="options"
        />
      </div>
    `,
  }),
};

export const WithCssClass: Story = {
  name: 'With external CSS class',
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    props: {
      isShown: true,
      textModel: '',
    },
    template: `
      <div style="padding: 24px;">
        <smart-searchbar
          class="smart:max-w-md smart:p-4"
          [(show)]="isShown"
          [(text)]="textModel"
        />
      </div>
    `,
  }),
};

export const LightAndDarkMode: Story = {
  name: 'Light and dark mode',
  parameters: {
    controls: { disable: true },
  },
  // Storybook's built-in theme toggle (if configured) can also flip this automatically
  // by adding the `dark` class to the root — the second panel below hard-codes it for comparison.
  render: () => ({
    props: {
      lightShown: true,
      lightText: '',
      darkShown: true,
      darkText: '',
    },
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0; min-height: 200px;">

        <div class="smart:bg-white smart:p-4" style="color: #111827;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Light mode
          </h3>
          <smart-searchbar [(show)]="lightShown" [(text)]="lightText" />
        </div>

        <div class="dark smart:bg-gray-900 smart:p-4" style="color: #f9fafb;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Dark mode
          </h3>
          <smart-searchbar [(show)]="darkShown" [(text)]="darkText" />
        </div>

      </div>
    `,
  }),
};
